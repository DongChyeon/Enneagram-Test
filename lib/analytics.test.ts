import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CaptureResult } from 'posthog-js';

const sdk = vi.hoisted(() => ({ init: vi.fn(), capture: vi.fn(), set_config: vi.fn() }));
vi.mock('posthog-js', () => ({ default: sdk }));

beforeEach(() => {
  vi.resetModules(); vi.resetAllMocks(); vi.unstubAllEnvs();
  sessionStorage.clear(); window.history.replaceState({}, '', '/');
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); });

function enableAnalytics() {
  vi.stubEnv('NODE_ENV', 'production');
  vi.stubEnv('NEXT_PUBLIC_POSTHOG_ENABLED', 'true');
  vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', 'phc_test');
}

// The SDK is imported lazily; wait until queued calls have been replayed.
const settle = async () => (await import('./analytics')).initializeAnalytics();

const payload = (event: string, properties: Record<string, unknown>): CaptureResult => ({
  uuid: 'event-id', event, properties, $set: { email: 'private@example.com' },
});

describe('analytics privacy boundary', () => {
  it('does not initialize or capture without an explicit production opt-in and key', async () => {
    const { trackEvent } = await import('./analytics');
    trackEvent('test_started', { test_stage: 'base' });
    await settle();
    expect(sdk.init).not.toHaveBeenCalled();
    expect(sdk.capture).not.toHaveBeenCalled();
  });
  it('disables persistence, profiles, replay, location, and implicit collection', async () => {
    const { analyticsConfig } = await import('./analytics');
    expect(analyticsConfig('tab-id')).toMatchObject({
      persistence: 'memory', disable_persistence: true, person_profiles: 'never',
      disable_session_recording: true, ip: false, autocapture: false, capture_heatmaps: false,
      capture_pageview: false, mask_all_text: true, mask_all_element_attributes: true,
      bootstrap: { distinctID: 'tab-id', isIdentifiedID: false },
    });
  });
  it('only accepts the event-specific enum and numeric allowlist', async () => {
    const { sanitizeEventProperties } = await import('./analytics');
    expect(sanitizeEventProperties('result_viewed', {
      primary_type: 9, result_stage: 'base', viewer_context: 'shared', answer: 5, code: 'secret',
    })).toEqual({ primary_type: 9, result_stage: 'base', viewer_context: 'shared' });
    expect(sanitizeEventProperties('result_viewed', {
      primary_type: 10, result_stage: 'secret', viewer_context: 'secret',
    })).toEqual({});
  });
  it('removes codes, query, hash, referrer, person mutations, text and DOM attributes', async () => {
    window.history.replaceState({}, '', '/result/3w4-SECRET?answer=5#private');
    const { sanitizeCapture } = await import('./analytics');
    const clean = sanitizeCapture(payload('$autocapture', {
      $current_url: window.location.href, $referrer: 'https://secret.example/answer',
      answer: 5, $elements: [{ tag_name: 'a', nth_child: 1, attr__href: '/result/SECRET', $el_text: 'answer' }],
    }));
    expect(clean?.properties.$pathname).toBe('/result');
    expect(clean?.properties.$current_url).toBe(`${window.location.origin}/result`);
    expect(clean?.properties.$elements).toEqual([{ tag_name: 'a', nth_child: 1 }]);
    expect(JSON.stringify(clean)).not.toMatch(/SECRET|private|answer|referrer|email/);
  });
  it('drops automatic events and pageviews on test or unknown pages even during route races', async () => {
    const { sanitizeCapture } = await import('./analytics');
    for (const path of ['/test', '/test/detail', '/unknown']) {
      window.history.replaceState({}, '', path);
      for (const event of ['$autocapture', '$$heatmap', '$pageview']) {
        expect(sanitizeCapture(payload(event, {}))).toBeNull();
      }
      expect(sanitizeCapture(payload('test_started', { test_stage: 'base' }))).not.toBeNull();
    }
  });
  it('retains only landing heatmap coordinates and strips query/hash URL keys', async () => {
    const { sanitizeCapture } = await import('./analytics');
    const clean = sanitizeCapture(payload('$$heatmap', { $heatmap_data: {
      'https://example.com/?secret=5#private': [{ x: 10, y: 20, type: 'click', text: 'answer' }],
      'https://example.com/result/SECRET': [{ x: 50, y: 60, type: 'click' }],
      'https://example.com/test': [{ x: 30, y: 40, type: 'click' }],
    } }));
    expect(clean?.properties.$heatmap_data).toEqual({
      'https://example.com/': [{ x: 10, y: 20, type: 'click', target_fixed: false }],
    });
    expect(sanitizeCapture(payload('$identify', {}))).toBeNull();
    expect(sanitizeCapture(payload('$exception', {}))).toBeNull();
  });
  it('keeps landing heatmap points that flush after navigating to the test', async () => {
    window.history.replaceState({}, '', '/test');
    const { sanitizeCapture } = await import('./analytics');
    expect(sanitizeCapture(payload('$$heatmap', { $heatmap_data: {
      'https://example.com/': [{ x: 1, y: 2, type: 'click' }],
      'https://example.com/test': [{ x: 3, y: 4, type: 'click' }],
    } }))?.properties.$heatmap_data).toEqual({
      'https://example.com/': [{ x: 1, y: 2, type: 'click', target_fixed: false }],
    });
  });
  it('drops result-only heatmap buffers even after navigating back to landing', async () => {
    const { sanitizeCapture } = await import('./analytics');
    expect(sanitizeCapture(payload('$$heatmap', { $heatmap_data: {
      'https://example.com/result/SECRET': [{ x: 10, y: 20, type: 'click' }],
    } }))).toBeNull();
  });
  it('initializes once, captures a milestone once, and gates exploration per route', async () => {
    vi.stubEnv('NODE_ENV', 'production'); vi.stubEnv('NEXT_PUBLIC_POSTHOG_ENABLED', 'true');
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', 'phc_test');
    const { captureOnce, configureAnalyticsPage } = await import('./analytics');
    captureOnce('base:25', 'test_progress_reached', { test_stage: 'base', progress_percent: 25 });
    captureOnce('base:25', 'test_progress_reached', { test_stage: 'base', progress_percent: 25 });
    await settle();
    expect(sdk.capture).toHaveBeenCalledTimes(1);
    expect(sdk.init).toHaveBeenCalledTimes(1);
    window.history.replaceState({}, '', '/test');
    configureAnalyticsPage('/test');
    expect(sdk.set_config).toHaveBeenLastCalledWith({ autocapture: false, capture_heatmaps: true });
    expect(sdk.capture).toHaveBeenCalledTimes(1);
    window.history.replaceState({}, '', '/result/SECRET');
    configureAnalyticsPage('/result/SECRET');
    expect(sdk.set_config).toHaveBeenLastCalledWith(expect.objectContaining({ autocapture: expect.any(Object) }));
    expect(sdk.capture).toHaveBeenLastCalledWith('$pageview');
  });
  it('does not reuse cloned sessionStorage identity on a fresh document navigation', async () => {
    vi.stubEnv('NODE_ENV', 'production'); vi.stubEnv('NEXT_PUBLIC_POSTHOG_ENABLED', 'true');
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', 'phc_test');
    sessionStorage.setItem('enneagram:analytics:flow', 'other-tab');
    const { initializeAnalytics } = await import('./analytics');
    await initializeAnalytics();
    expect(sdk.init.mock.calls[0][1].bootstrap.distinctID).not.toBe('other-tab');
    expect(document.cookie).toBe('');
  });
});


describe('analytics resilience and deduplication', () => {
  it.each([
    ['development', 'true', 'phc_test'],
    ['test', 'true', 'phc_test'],
    ['production', 'false', 'phc_test'],
    ['production', 'true', ''],
  ])('does not send data with environment %s, enabled %s, key %s', async (env, enabled, key) => {
    vi.stubEnv('NODE_ENV', env);
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_ENABLED', enabled);
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', key);
    const { captureOnce, configureAnalyticsPage } = await import('./analytics');
    captureOnce('start:base', 'test_started', { test_stage: 'base' });
    configureAnalyticsPage('/');
    await settle();
    expect(sdk.init).not.toHaveBeenCalled();
    expect(sdk.capture).not.toHaveBeenCalled();
    expect(sessionStorage.length).toBe(0);
  });

  it('retries initialization after an SDK failure without breaking the caller', async () => {
    enableAnalytics();
    sdk.init.mockImplementationOnce(() => { throw new Error('SDK unavailable'); });
    const { captureOnce } = await import('./analytics');
    expect(() => captureOnce('start:base', 'test_started', { test_stage: 'base' })).not.toThrow();
    await settle();
    expect(sdk.capture).not.toHaveBeenCalled();
    captureOnce('start:base', 'test_started', { test_stage: 'base' });
    await settle();
    expect(sdk.init).toHaveBeenCalledTimes(2);
    expect(sdk.capture).toHaveBeenCalledTimes(1);
  });

  it('does not propagate SDK capture or route configuration failures', async () => {
    enableAnalytics();
    sdk.capture.mockImplementation(() => { throw new Error('capture unavailable'); });
    sdk.set_config.mockImplementation(() => { throw new Error('configuration unavailable'); });
    const { trackEvent, captureOnce, configureAnalyticsPage } = await import('./analytics');
    expect(() => trackEvent('share_attempted', { channel: 'copy_link' })).not.toThrow();
    expect(() => captureOnce('start:base', 'test_started', { test_stage: 'base' })).not.toThrow();
    expect(() => configureAnalyticsPage('/')).not.toThrow();
    await expect(settle()).resolves.toBeUndefined();
    expect(() => trackEvent('share_attempted', { channel: 'copy_link' })).not.toThrow();
  });

  it('keeps a stable in-memory identity and deduplicates when sessionStorage is blocked', async () => {
    enableAnalytics();
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    const { captureOnce } = await import('./analytics');
    expect(() => {
      captureOnce('base:25', 'test_progress_reached', { test_stage: 'base', progress_percent: 25 });
      captureOnce('base:25', 'test_progress_reached', { test_stage: 'base', progress_percent: 25 });
      captureOnce('detail:25', 'test_progress_reached', { test_stage: 'detail', progress_percent: 25 });
    }).not.toThrow();
    await settle();
    expect(sdk.init).toHaveBeenCalledTimes(1);
    expect(sdk.capture).toHaveBeenCalledTimes(2);
  });

  it('preserves the flow and deduplication across a reload in the same tab', async () => {
    enableAnalytics();
    vi.spyOn(performance, 'getEntriesByType').mockReturnValue([
      { type: 'reload' } as PerformanceNavigationTiming,
    ]);
    const first = await import('./analytics');
    first.captureOnce('base:25', 'test_progress_reached', { test_stage: 'base', progress_percent: 25 });
    await first.initializeAnalytics();
    const id = sdk.init.mock.calls[0][1].bootstrap.distinctID;
    vi.resetModules();
    const reloaded = await import('./analytics');
    reloaded.captureOnce('base:25', 'test_progress_reached', { test_stage: 'base', progress_percent: 25 });
    reloaded.captureOnce('base:50', 'test_progress_reached', { test_stage: 'base', progress_percent: 50 });
    await reloaded.initializeAnalytics();
    expect(sdk.init.mock.calls[1][1].bootstrap.distinctID).toBe(id);
    expect(sdk.capture).toHaveBeenCalledTimes(2);
  });

  it('builds lazy properties only when the deduplicated event is sent', async () => {
    enableAnalytics();
    const build = vi.fn(() => ({ test_stage: 'base' }));
    const { captureOnce } = await import('./analytics');
    captureOnce('start:base', 'test_started', build);
    captureOnce('start:base', 'test_started', build);
    expect(build).not.toHaveBeenCalled();
    await settle();
    expect(build).toHaveBeenCalledTimes(1);
    expect(sdk.capture).toHaveBeenCalledWith('test_started', { test_stage: 'base' });
  });

  it('skips a replayed page configuration for a page the user already left', async () => {
    enableAnalytics();
    const { configureAnalyticsPage } = await import('./analytics');
    configureAnalyticsPage('/');
    window.history.replaceState({}, '', '/result/SECRET');
    configureAnalyticsPage('/result/SECRET');
    await settle();
    expect(sdk.set_config).toHaveBeenCalledTimes(1);
    expect(sdk.capture).toHaveBeenCalledTimes(1);
  });

  it('still creates a flow ID on WebViews without crypto.randomUUID', async () => {
    enableAnalytics();
    vi.stubGlobal('crypto', { getRandomValues: (bytes: Uint8Array) => bytes.fill(7) });
    const { captureOnce } = await import('./analytics');
    captureOnce('start:base', 'test_started', { test_stage: 'base' });
    await settle();
    vi.unstubAllGlobals();
    expect(sdk.init.mock.calls[0][1].bootstrap.distinctID).toBe('07'.repeat(16));
    expect(sdk.capture).toHaveBeenCalledTimes(1);
  });

  it('rejects coerced types and out-of-range progress data', async () => {
    const { sanitizeEventProperties } = await import('./analytics');
    expect(sanitizeEventProperties('test_progress_reached', {
      question_index: 91, progress_percent: '25', elapsed_bucket: 'private', answer: 5,
    })).toEqual({});
    expect(sanitizeEventProperties('test_completed', {
      primary_type: '3', ambiguous_result: 'true', duration_bucket: '3_5m',
    })).toEqual({ duration_bucket: '3_5m' });
    expect(sanitizeEventProperties('test_progress_reached', {
      question_index: 90, progress_percent: 100, test_stage: 'detail',
    })).toEqual({ question_index: 90, progress_percent: 100, test_stage: 'detail' });
  });
});
