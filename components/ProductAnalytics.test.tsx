import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { captureOnce, trackEvent } from '../lib/analytics';
import TestRunner from './TestRunner';
import { ResultAnalytics, LandingAnalytics } from './ProductAnalytics';
import { ShareActions, ShareTools } from './ShareActions';
import { ResultNextStep } from './ResultNextStep';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));
vi.mock('../lib/analytics', () => ({ captureOnce: vi.fn(), trackEvent: vi.fn() }));

beforeEach(() => { vi.clearAllMocks(); sessionStorage.clear(); });
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); });

it('records the base funnel without sending answers and blocks automatic capture', () => {
  vi.useFakeTimers();
  const { container } = render(<TestRunner requestedMode="base" />);
  expect(container.firstElementChild?.classList.contains('ph-no-capture')).toBe(true);
  const start = vi.mocked(captureOnce).mock.calls.find(([key]) => key === 'start:base');
  expect(start?.[1]).toBe('test_started');
  expect((start?.[2] as () => object)()).toEqual({ test_stage: 'base', entry_kind: 'direct', resumed: false });
  for (let i = 0; i < 27; i++) {
    fireEvent.click(screen.getAllByRole('radio')[2]);
    act(() => vi.advanceTimersByTime(110));
  }
  for (const milestone of [25, 50, 75, 100]) {
    expect(captureOnce).toHaveBeenCalledWith(`progress:base:${milestone}`, 'test_progress_reached',
      expect.objectContaining({ progress_percent: milestone, test_stage: 'base' }));
  }
  fireEvent.click(screen.getByRole('button', { name: '완료' }));
  expect(captureOnce).toHaveBeenCalledWith('complete:base', 'test_completed',
    expect.objectContaining({ primary_type: expect.any(Number), ambiguous_result: expect.any(Boolean) }));
  expect(push).toHaveBeenCalledTimes(1);
  for (const [, , raw] of vi.mocked(captureOnce).mock.calls) {
    const properties = typeof raw === 'function' ? raw() : raw;
    expect(Object.keys(properties || {})).not.toEqual(expect.arrayContaining(['answers']));
    expect(properties).not.toHaveProperty('code');
    expect(properties).not.toHaveProperty('value');
    expect(properties).not.toHaveProperty('question_text');
  }
});

it('records result sections but never interactions within private answer evidence', () => {
  render(<ResultAnalytics code="private-code" kind="full" primaryType={3}>
    <div data-analytics-section="radar_profile"><button>Explore</button></div>
    <div data-analytics-section="personalized_insights" className="ph-no-capture"><button>Private</button></div>
  </ResultAnalytics>);
  expect(captureOnce).toHaveBeenCalledWith('result:detail:3:shared', 'result_viewed', {
    result_stage: 'detail', primary_type: 3, viewer_context: 'shared',
  });
  fireEvent.click(screen.getByText('Explore'));
  fireEvent.click(screen.getByText('Private'));
  expect(trackEvent).toHaveBeenCalledTimes(1);
  expect(trackEvent).toHaveBeenCalledWith('result_section_engaged', {
    section: 'radar_profile', result_stage: 'detail', primary_type: 3,
  });
});

it('marks shared entry when a recipient starts their own test', () => {
  const { container } = render(<ResultNextStep code="other-result" kind="base" primaryType={4} />);
  // 랜딩처럼 문항 수를 앞세우지 않는다.
  expect(container.textContent).not.toMatch(/\d+문항/);
  const link = screen.getByRole('link', { name: '검사 시작하기' });
  link.addEventListener('click', (event) => event.preventDefault());
  fireEvent.click(link);
  expect(trackEvent).toHaveBeenCalledWith('try_my_test_clicked', { shared_primary_type: 4, source_section: 'next_step' });
  render(<LandingAnalytics />);
  expect(captureOnce).toHaveBeenCalledWith('landing', 'landing_viewed', expect.objectContaining({ entry_kind: 'shared_result' }));
});

it('records a confirmed clipboard outcome with no URL in event properties', async () => {
  vi.stubGlobal('navigator', { userAgent: 'desktop', clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
  render(<ShareActions code="sensitive-code" typeId={5} kind="full" />);
  await act(async () => fireEvent.click(screen.getByRole('button', { name: '내 5유형 결과 공유하기' })));
  expect(trackEvent).toHaveBeenCalledWith('share_attempted', { channel: 'copy_link', primary_type: 5, result_stage: 'detail' });
  expect(trackEvent).toHaveBeenCalledWith('share_succeeded', { channel: 'copy_link', primary_type: 5, result_stage: 'detail' });
  expect(JSON.stringify(vi.mocked(trackEvent).mock.calls)).not.toContain('sensitive-code');
});

it('tags only the first test after a shared-result click as shared entry', () => {
  sessionStorage.setItem('enneagram:analytics:entry', 'shared_result');
  render(<TestRunner requestedMode="base" />);
  const start = vi.mocked(captureOnce).mock.calls.find(([key]) => key === 'start:base');
  // Not consumed until the (possibly queued) event is actually sent.
  expect(sessionStorage.getItem('enneagram:analytics:entry')).toBe('shared_result');
  expect((start?.[2] as () => object)()).toMatchObject({ entry_kind: 'shared_result' });
  expect(sessionStorage.getItem('enneagram:analytics:entry')).toBeNull();
});

it('copies a clean result link from the secondary share tools', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal('navigator', { userAgent: 'desktop', clipboard: { writeText } });
  window.history.replaceState({}, '', '/result/share-code?from=kakao#top');
  render(<ShareTools code="share-code" typeId={5} kind="base" />);
  expect(screen.queryByRole('button', { name: '이미지로 공유' })).toBeNull();
  await act(async () => fireEvent.click(screen.getByRole('button', { name: '결과 링크 복사' })));
  expect(writeText).toHaveBeenCalledWith(`${window.location.origin}/result/share-code`);
  expect(trackEvent).toHaveBeenCalledWith('share_succeeded', { channel: 'copy_link', primary_type: 5, result_stage: 'base' });
  expect(screen.getByText('결과 링크를 복사했어요. 원하는 앱에 붙여 넣으세요.')).toBeTruthy();
  window.history.replaceState({}, '', '/');
});
