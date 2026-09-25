import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { LAST_RESULT_KEY } from './progress';
import { ResultNextStep } from './ResultNextStep';

describe('ResultNextStep', () => {
  beforeEach(() => window.sessionStorage.clear());
  afterEach(cleanup);

  it('공유 링크 방문자에게는 이어하기 대신 새 검사를 안내한다', () => {
    render(<ResultNextStep code="shared-code" kind="base" />);

    expect(screen.getByText('내 결과도 알아보기')).toBeTruthy();
    expect(screen.getByRole('link', { name: '27문항 검사 시작하기' }).getAttribute('href')).toBe('/test');
    expect(screen.queryByText('총 90문항으로 더 자세히 알아보기')).toBeNull();
  });

  it('이 세션에서 결과를 만든 사람에게만 총 90문항으로 더 자세히 알아보기 이어하기를 보여준다', async () => {
    window.sessionStorage.setItem(LAST_RESULT_KEY, 'owned-code');
    render(<ResultNextStep code="owned-code" kind="base" />);

    await waitFor(() => expect(screen.getByText('총 90문항으로 더 자세히 알아보기')).toBeTruthy());
    expect(screen.getByRole('link', { name: '63문항 이어서 답하기' }).getAttribute('href')).toBe(
      '/test?continue',
    );
  });

  it.each(['legacy-base', 'full'] as const)(
    '%s 결과를 받은 공유 방문자에게도 27문항 검사 시작을 안내한다',
    (kind) => {
      render(<ResultNextStep code={`shared-${kind}`} kind={kind} />);

      expect(screen.getByText('내 결과도 알아보기')).toBeTruthy();
      expect(screen.getByRole('link', { name: '27문항 검사 시작하기' }).getAttribute('href')).toBe('/test');
    },
  );

  it('90문항 결과를 만든 본인에게는 새 검사 유도 버튼을 반복하지 않는다', async () => {
    window.sessionStorage.setItem(LAST_RESULT_KEY, 'owned-full');
    const { container } = render(<ResultNextStep code="owned-full" kind="full" />);

    await waitFor(() => expect(container.textContent).toBe(''));
  });
});
