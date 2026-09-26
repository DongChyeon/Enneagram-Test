'use client';

import { useEffect, type ReactNode } from 'react';
import { captureOnce, trackEvent } from '../lib/analytics';
import type { ResultKind } from '../lib/types';
import { ownsResult } from './progress';

export const resultStage = (kind: ResultKind) => kind === 'full' ? 'detail' : 'base';

const ENTRY_KEY = 'enneagram:analytics:entry';

export function entryKind(): 'shared_result' | 'direct' {
  try {
    return sessionStorage.getItem(ENTRY_KEY) === 'shared_result' ? 'shared_result' : 'direct';
  } catch {
    return 'direct';
  }
}

/** Reads the shared-result entry mark once, so later tests in the tab count as direct. */
export function consumeEntryKind(): 'shared_result' | 'direct' {
  const kind = entryKind();
  try { sessionStorage.removeItem(ENTRY_KEY); } catch { /* Optional measurement. */ }
  return kind;
}

export function markSharedEntry() {
  try {
    sessionStorage.setItem(ENTRY_KEY, 'shared_result');
  } catch { /* Optional measurement. */ }
}

export function durationBucket(start: number) {
  const minutes = (Date.now() - start) / 60000;
  if (minutes < 1) return 'under_1m';
  if (minutes < 3) return '1_3m';
  if (minutes < 5) return '3_5m';
  if (minutes < 10) return '5_10m';
  return 'over_10m';
}

export function LandingAnalytics() {
  useEffect(() => {
    const width = window.innerWidth;
    captureOnce('landing', 'landing_viewed', {
      entry_kind: entryKind(),
      device_class: width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop',
    });
  }, []);
  return null;
}

export function ResultAnalytics({ code, kind, primaryType, children }: {
  code: string;
  kind: ResultKind;
  primaryType: number;
  children: ReactNode;
}) {
  useEffect(() => {
    // The viewer is part of the key: a recipient who opens a shared type-X result and then
    // gets type X themselves must still record their own (owner) view for the funnel.
    const viewer = ownsResult(code) ? 'owner' : 'shared';
    captureOnce(`result:${resultStage(kind)}:${primaryType}:${viewer}`, 'result_viewed', {
      result_stage: resultStage(kind), primary_type: primaryType, viewer_context: viewer,
    });
  }, [code, kind, primaryType]);
  return (
    <div onClick={(event) => {
      const target = event.target;
      if (!(target instanceof Element) || target.closest('.ph-no-capture')) return;
      const section = target.closest('[data-analytics-section]')?.getAttribute('data-analytics-section');
      if (!section) return;
      trackEvent('result_section_engaged', {
        section, result_stage: resultStage(kind), primary_type: primaryType,
      });
    }}>
      {children}
    </div>
  );
}
