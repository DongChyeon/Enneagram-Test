/**
 * AC-4 렌더 검증.
 *
 * 90문항 플로우를 사람이 매번 손으로 완주할 수는 없으므로, AC-4가 이름으로
 * 지목한 다섯 가지(n/90 표기, `aria-valuenow` 일치, 이전 복원, 1번에서 이전
 * 비활성, 전량 응답 전 제출 불가)와 R11의 새로고침 복원을 여기서 고정한다.
 */
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { questions } from '../data/questions';
import { decodeResult } from '../lib/code';

const push = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

const TOTAL = questions.length;

async function loadRunner() {
  const imported = await import('./TestRunner');
  return imported.default;
}

function progressBar(): HTMLElement {
  return screen.getByRole('progressbar');
}

/** 현재 화면의 리커트 라디오 5개. */
function options(): HTMLInputElement[] {
  return screen.getAllByRole('radio') as HTMLInputElement[];
}

/** 선택 후 자동 넘김 타이머까지 흘려보낸다. */
function answer(value: 1 | 2 | 3 | 4 | 5) {
  fireEvent.click(options()[value - 1]);
  act(() => {
    vi.advanceTimersByTime(300);
  });
}

describe('TestRunner (AC-4)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    push.mockReset();
    window.sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('첫 문항에서 n/90 표기와 진행률 0, 그리고 비활성 "이전" 버튼을 보여준다', async () => {
    const TestRunner = await loadRunner();
    render(<TestRunner />);

    expect(screen.getByText(`/${TOTAL}`)).toBeTruthy();
    expect(progressBar().getAttribute('aria-valuenow')).toBe('0');
    expect(progressBar().getAttribute('aria-valuemax')).toBe(String(TOTAL));
    expect((screen.getByRole('button', { name: '이전' }) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByText(questions[0].text)).toBeTruthy();
  });

  it('aria-valuenow가 응답한 문항 수를 따라간다', async () => {
    const TestRunner = await loadRunner();
    render(<TestRunner />);

    answer(4);
    expect(progressBar().getAttribute('aria-valuenow')).toBe('1');
    answer(2);
    expect(progressBar().getAttribute('aria-valuenow')).toBe('2');
  });

  it('"이전"으로 돌아가면 직전에 고른 값이 선택된 채로 복원된다', async () => {
    const TestRunner = await loadRunner();
    render(<TestRunner />);

    answer(5);
    expect(screen.getByText(questions[1].text)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '이전' }));

    expect(screen.getByText(questions[0].text)).toBeTruthy();
    expect(options().map((input) => input.checked)).toEqual([false, false, false, false, true]);
    // 되돌아가도 진행도는 줄지 않는다.
    expect(progressBar().getAttribute('aria-valuenow')).toBe('1');
  });

  it('새로고침(재마운트)해도 sessionStorage에서 응답과 위치가 복원된다', async () => {
    const TestRunner = await loadRunner();
    const first = render(<TestRunner />);

    answer(3);
    answer(1);
    first.unmount();

    render(<TestRunner />);
    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(progressBar().getAttribute('aria-valuenow')).toBe('2');
    expect(screen.getByText(questions[2].text)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '이전' }));
    expect(options().map((input) => input.checked)).toEqual([true, false, false, false, false]);
  });

  it('문항 세트 서명이 다른 저장본은 폐기하고 처음부터 시작한다', async () => {
    window.sessionStorage.setItem(
      'enneagram-test.progress.v1',
      JSON.stringify({ signature: 'stale', answers: Array.from({ length: TOTAL }, () => 5), index: 40 }),
    );

    const TestRunner = await loadRunner();
    render(<TestRunner />);
    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(progressBar().getAttribute('aria-valuenow')).toBe('0');
    expect(screen.getByText(questions[0].text)).toBeTruthy();
  });

  it('90문항을 전부 채우기 전에는 결과 이동이 막혀 있고, 다 채우면 /result/<code>로 간다', async () => {
    const TestRunner = await loadRunner();
    render(<TestRunner />);

    // 89문항까지만 답하고 마지막 문항으로 간다.
    for (let position = 0; position < TOTAL - 1; position += 1) {
      answer(4);
    }
    expect(screen.getByText(questions[TOTAL - 1].text)).toBeTruthy();

    const finish = screen.getByRole('button', { name: '결과 보기' }) as HTMLButtonElement;
    expect(finish.disabled).toBe(true);
    fireEvent.click(finish);
    expect(push).not.toHaveBeenCalled();

    answer(4);
    expect(progressBar().getAttribute('aria-valuenow')).toBe(String(TOTAL));

    const enabled = screen.getByRole('button', { name: '결과 보기' }) as HTMLButtonElement;
    expect(enabled.disabled).toBe(false);
    fireEvent.click(enabled);

    expect(push).toHaveBeenCalledTimes(1);
    const target = push.mock.calls[0][0] as string;
    expect(target.startsWith('/result/')).toBe(true);

    const decoded = decodeResult(target.slice('/result/'.length));
    expect(decoded).not.toBeNull();
  });
});
