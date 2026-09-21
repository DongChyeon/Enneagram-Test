import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { LAST_RESULT_KEY } from './progress';
import { ResultNextStep } from './ResultNextStep';

describe('ResultNextStep', () => {
  beforeEach(() => window.sessionStorage.clear());
  afterEach(cleanup);

  it('공유 링크 방문자에게는 이어하기 대신 새 검사를 안내한다', () => {
    render(<ResultNextStep code="shared-code" />);

    expect(screen.getByText('내 결과도 알아보기')).toBeTruthy();
    expect(screen.getByRole('link', { name: '27문항 검사 시작하기' }).getAttribute('href')).toBe('/test');
    expect(screen.queryByText('총 90문항으로 더 자세히 알아보기')).toBeNull();
  });

  it('이 세션에서 결과를 만든 사람에게만 총 90문항으로 더 자세히 알아보기 이어하기를 보여준다', async () => {
    window.sessionStorage.setItem(LAST_RESULT_KEY, 'owned-code');
    render(<ResultNextStep code="owned-code" />);

    await waitFor(() => expect(screen.getByText('총 90문항으로 더 자세히 알아보기')).toBeTruthy());
    expect(screen.getByRole('link', { name: '63문항 이어서 답하기' }).getAttribute('href')).toBe(
      '/test?continue',
    );
  });
});
