/**
 * 랜딩의 이어하기 안내.
 *
 * 저장본이 없거나 서명이 어긋나면 **아무것도 그리지 않는다**는 쪽이 본체다 —
 * 이 컴포넌트가 잘못 뜨면 처음 온 사람에게 없는 기록을 있다고 말하게 된다.
 */
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { questions } from '../data/questions';

import ResumeNotice from './ResumeNotice';

const TOTAL = questions.length;
const KEY = 'enneagram-test.progress.v1';
const SIGNATURE = `${TOTAL}:${questions[0].id}:${questions[TOTAL - 1].id}`;

function save(answeredCount: number, signature = SIGNATURE) {
  const answers = Array.from({ length: TOTAL }, (_, position) => (position < answeredCount ? 4 : null));
  window.sessionStorage.setItem(KEY, JSON.stringify({ signature, answers, index: answeredCount }));
}

describe('ResumeNotice', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(cleanup);

  it('저장본이 없으면 아무것도 그리지 않는다', () => {
    const { container } = render(<ResumeNotice total={TOTAL} signature={SIGNATURE} />);
    expect(container.innerHTML).toBe('');
  });

  it('문항 세트 서명이 다른 저장본은 조용히 무시한다', () => {
    save(24, 'stale');
    const { container } = render(<ResumeNotice total={TOTAL} signature={SIGNATURE} />);
    expect(container.innerHTML).toBe('');
  });

  it('진행 중인 응답이 있으면 남은 문항 수와 묶음 위치를 보여준다', () => {
    save(24);
    render(<ResumeNotice total={TOTAL} signature={SIGNATURE} />);

    expect(screen.getByText('답하다 만 기록이 남아 있습니다')).toBeTruthy();
    expect(
      screen.getByText(`${TOTAL}문항 중 24문항 · 9묶음 중 3번째 묶음까지 왔습니다. 아래 버튼을 누르면 멈춘 자리에서 이어서 답합니다.`),
    ).toBeTruthy();
  });

  it('"처음부터 다시 하기"는 확인을 거쳐야 저장본을 지운다', () => {
    save(24);
    render(<ResumeNotice total={TOTAL} signature={SIGNATURE} />);

    fireEvent.click(screen.getByRole('button', { name: '처음부터 다시 하기' }));
    expect(window.sessionStorage.getItem(KEY)).not.toBeNull();

    fireEvent.click(screen.getByRole('button', { name: '취소' }));
    fireEvent.click(screen.getByRole('button', { name: '처음부터 다시 하기' }));
    fireEvent.click(screen.getByRole('button', { name: '지우고 1번부터' }));

    expect(window.sessionStorage.getItem(KEY)).toBeNull();
    expect(screen.queryByText('답하다 만 기록이 남아 있습니다')).toBeNull();
  });
});
