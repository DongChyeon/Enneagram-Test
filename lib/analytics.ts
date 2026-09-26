import type { CaptureResult, PostHog, PostHogConfig } from 'posthog-js';

const FLOW_KEY = 'enneagram:analytics:flow';
const ONCE_PREFIX = 'enneagram:analytics:once:';
let client: PostHog | undefined;
let loading: Promise<void> | undefined;
const queue: Array<(sdk: PostHog) => void> = [];
let flowId: string | undefined;
const sent = new Set<string>();

type Properties = Record<string, unknown>;
const enums: Record<string, readonly unknown[]> = {
  test_stage: ['base', 'detail'], result_stage: ['base', 'detail'],
  entry_kind: ['direct', 'shared_result', 'unknown'], device_class: ['mobile', 'tablet', 'desktop', 'unknown'],
  viewer_context: ['owner', 'shared', 'unknown'], progress_percent: [25, 50, 75, 100],
  section: ['radar_profile', 'score_distribution', 'compatibility', 'characters', 'personalized_insights'],
  channel: ['kakao', 'web_share', 'copy_link'],
  elapsed_bucket: ['under_1m', '1_3m', '3_5m', '5_10m', 'over_10m'],
  duration_bucket: ['under_1m', '1_3m', '3_5m', '5_10m', 'over_10m'],
  reason_code: ['cancelled', 'unsupported', 'permission_denied', 'sdk_unavailable', 'unknown'],
  source_section: ['hero', 'footer', 'result', 'personalized_insights', 'next_step', 'sticky'],
};
const fields = {
  landing_viewed: ['entry_kind', 'device_class'],
  test_started: ['test_stage', 'entry_kind', 'resumed'],
  test_progress_reached: ['test_stage', 'progress_percent', 'question_index', 'elapsed_bucket'],
  test_completed: ['test_stage', 'duration_bucket', 'primary_type', 'ambiguous_result'],
  result_viewed: ['result_stage', 'primary_type', 'viewer_context'],
  result_section_engaged: ['section', 'result_stage', 'primary_type'],
  share_attempted: ['channel', 'result_stage', 'primary_type'],
  share_succeeded: ['channel', 'result_stage', 'primary_type'],
  share_failed: ['channel', 'reason_code'],
  detail_cta_clicked: ['primary_type', 'source_section'],
  try_my_test_clicked: ['shared_primary_type', 'source_section'],
} satisfies Record<string, string[]>;
export type AnalyticsEvent = keyof typeof fields;

export function sanitizeEventProperties(event: AnalyticsEvent, properties: Properties): Properties {
  return Object.fromEntries(fields[event].filter((key) => {
    const value = properties[key];
    if (enums[key]) return enums[key].includes(value);
    if (key === 'primary_type' || key === 'shared_primary_type') return Number.isInteger(value) && Number(value) >= 1 && Number(value) <= 9;
    if (key === 'question_index') return Number.isInteger(value) && Number(value) >= 1 && Number(value) <= 90;
    return (key === 'resumed' || key === 'ambiguous_result') && typeof value === 'boolean';
  }).map((key) => [key, properties[key]]));
}

export function analyticsPath(value: string): string {
  try {
    const path = new URL(value, 'https://placeholder.invalid').pathname;
    if (path === '/') return '/';
    if (path === '/result' || path.startsWith('/result/')) return '/result';
    if (path === '/test' || path.startsWith('/test/')) return '/test';
  } catch { /* Fail closed for unknown paths. */ }
  return '/other';
}
export function sanitizeAnalyticsUrl(value: string): string {
  try {
    const url = new URL(value, window.location.origin);
    return `${url.origin}${analyticsPath(value)}`;
  } catch { return ''; }
}
export function isExplorationPage(value: string): boolean {
  return ['/', '/result'].includes(analyticsPath(value));
}

// Rebuild the payload rather than trying to blacklist every SDK/DOM property.
export function sanitizeCapture(event: CaptureResult | null): CaptureResult | null {
  if (!event) return null;
  const raw = event.properties;
  const automatic = ['$autocapture', '$$heatmap', '$pageview'].includes(event.event);
  if (!(event.event in fields) && !automatic) return null;
  // Heatmap buffers flush up to 5s late (often after leaving the landing), so they are
  // filtered per recorded URL below instead of by the page that happens to be open.
  if (automatic && event.event !== '$$heatmap' && !isExplorationPage(window.location.href)) return null;
  const properties: Properties = event.event in fields
    ? sanitizeEventProperties(event.event as AnalyticsEvent, raw) : {};
  for (const key of ['token', 'distinct_id', '$session_id', '$window_id', '$lib', '$lib_version']) {
    if (typeof raw[key] === 'string') properties[key] = raw[key];
  }
  properties.$process_person_profile = false;
  properties.$geoip_disable = true;
  properties.$current_url = sanitizeAnalyticsUrl(window.location.href);
  properties.$pathname = analyticsPath(window.location.href);
  // Referrers can contain private result URLs or arbitrary third-party identifiers; omit entirely.
  if (event.event === '$autocapture') {
    properties.$event_type = 'click';
    if (Array.isArray(raw.$elements)) properties.$elements = raw.$elements.map((element: Properties) => ({
      tag_name: /^[a-z0-9-]+$/.test(String(element.tag_name)) ? element.tag_name : 'unknown',
      ...(Number.isInteger(element.nth_child) ? { nth_child: element.nth_child } : {}),
      ...(Number.isInteger(element.nth_of_type) ? { nth_of_type: element.nth_of_type } : {}),
    }));
  }
  if (event.event === '$$heatmap') {
    const heatmap: Record<string, Properties[]> = {};
    for (const [url, points] of Object.entries(raw.$heatmap_data || {})) {
      // Heatmaps ignore ph-no-capture, so result coordinates could expose answer evidence.
      if (analyticsPath(url) !== '/' || !Array.isArray(points)) continue;
      const safeUrl = sanitizeAnalyticsUrl(url);
      heatmap[safeUrl] = [...(heatmap[safeUrl] || []), ...points.filter((p) =>
        Number.isFinite(p.x) && Number.isFinite(p.y) && ['click', 'mousemove', 'rageclick', 'deadclick'].includes(p.type)
      ).map((p) => ({ x: p.x, y: p.y, type: p.type, target_fixed: p.target_fixed === true }))];
    }
    if (!Object.keys(heatmap).length) return null;
    properties.$heatmap_data = heatmap;
  }
  return { uuid: event.uuid, event: event.event, timestamp: event.timestamp, properties };
}

export function analyticsEnabled(): boolean {
  return typeof window !== 'undefined' && process.env.NODE_ENV === 'production' &&
    process.env.NEXT_PUBLIC_POSTHOG_ENABLED === 'true' && !!process.env.NEXT_PUBLIC_POSTHOG_KEY;
}

function randomId(): string {
  // Older in-app WebViews lack randomUUID; analytics must still get a flow ID there.
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, '0')).join('');
}

function getFlowId(): string {
  if (flowId) return flowId;
  const reload = performance.getEntriesByType?.('navigation')[0] as PerformanceNavigationTiming | undefined;
  try {
    // A new navigation must not inherit sessionStorage copied from an opener/duplicated tab.
    const previous = reload?.type === 'reload' ? sessionStorage.getItem(FLOW_KEY) : null;
    flowId = previous || randomId();
    sessionStorage.setItem(FLOW_KEY, flowId);
  } catch { flowId = randomId(); }
  return flowId;
}

export function analyticsConfig(id: string): Partial<PostHogConfig> {
  return {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    persistence: 'memory', disable_persistence: true,
    bootstrap: { distinctID: id, isIdentifiedID: false },
    person_profiles: 'never', ip: false,
    capture_pageview: false, capture_pageleave: false, autocapture: false, capture_heatmaps: false,
    disable_session_recording: true, disable_surveys: true, capture_performance: false,
    capture_exceptions: false, capture_dead_clicks: false, rageclick: false,
    advanced_disable_flags: true, advanced_disable_feature_flags: true,
    disable_external_dependency_loading: true,
    save_referrer: false, save_campaign_params: false,
    mask_all_text: true, mask_all_element_attributes: true,
    before_send: sanitizeCapture,
  };
}

// The SDK is loaded lazily so disabled builds and the test flow never pay for its bundle.
// Calls made while it loads are queued and replayed in order; a failed load drops them.
function withAnalytics(run: (sdk: PostHog) => void): void {
  if (!analyticsEnabled()) return;
  const safeRun = (sdk: PostHog) => { try { run(sdk); } catch { /* Analytics must never break the test. */ } };
  if (client) return safeRun(client);
  queue.push(safeRun);
  loading ??= import('posthog-js').then(({ default: sdk }) => {
    sdk.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, analyticsConfig(getFlowId()));
    client = sdk;
    for (const pending of queue.splice(0)) pending(sdk);
  }).catch(() => { loading = undefined; queue.length = 0; });
}

export function initializeAnalytics(): Promise<void> {
  withAnalytics(() => {});
  return loading ?? Promise.resolve();
}
export function configureAnalyticsPage(pathname: string): void {
  withAnalytics((sdk) => {
    // A call replayed after the SDK loads may be for a page the user already left; the
    // later queued call configures the current page, so skip rather than mislabel it.
    if (analyticsPath(window.location.href) !== analyticsPath(pathname)) return;
    const allowed = isExplorationPage(pathname);
    sdk.set_config({
      autocapture: allowed ? {
        url_allowlist: [/^https?:\/\/[^/]+\/(?:result(?:\/[^?#]*)?)?(?:[?#].*)?$/],
        dom_event_allowlist: ['click'], element_allowlist: ['a', 'button'], capture_copied_text: false,
      } : false,
      // Kept on after leaving the landing: disabling clears the unflushed buffer (losing the
      // CTA click), and sanitizeCapture sends only coordinates recorded on `/`.
      capture_heatmaps: true,
    });
    if (allowed) sdk.capture('$pageview');
  });
}
export function trackEvent(event: AnalyticsEvent, properties: Properties = {}): void {
  withAnalytics((sdk) => { sdk.capture(event, sanitizeEventProperties(event, properties)); });
}
/** Pass a function when building the properties has side effects that must wait until the send. */
export function captureOnce(key: string, event: AnalyticsEvent, properties: Properties | (() => Properties) = {}): void {
  withAnalytics((sdk) => {
    const storageKey = `${ONCE_PREFIX}${getFlowId()}:${key}`;
    if (sent.has(storageKey)) return;
    try { if (sessionStorage.getItem(storageKey)) return; } catch { /* Memory fallback. */ }
    sent.add(storageKey);
    try { sessionStorage.setItem(storageKey, '1'); } catch { /* Memory fallback. */ }
    const resolved = typeof properties === 'function' ? properties() : properties;
    sdk.capture(event, sanitizeEventProperties(event, resolved));
  });
}
