import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import type { Scores } from '../lib/types';
import { RadialScoreProfile } from './RadialScoreProfile';

afterEach(cleanup);

describe('RadialScoreProfile', () => {
  it('9유형 전체를 그리고 상위 세 유형과 정규화 범위를 설명한다', () => {
    const scores: Scores = { 1: 4, 2: 5, 3: 14, 4: 13, 5: 12, 6: 8, 7: 7, 8: 6, 9: 3 };
    const { container } = render(<RadialScoreProfile scores={scores} scoreRange={[3, 15]} />);

    expect(screen.getByRole('img', { name: '9유형 점수 분포. 1위 3유형, 2위 4유형, 3위 5유형' })).toBeTruthy();
    expect(screen.getByText('3~15점 범위를 0~100%로 바꿔 같은 검사 안에서 비교한 상대 프로필이에요. 정확한 원점수는 아래 점수 분포에서 확인할 수 있어요.')).toBeTruthy();
    expect(container.querySelectorAll('svg circle').length).toBeGreaterThanOrEqual(9);
    expect(screen.getByText('1위').parentElement?.textContent).toContain('3유형');
  });
});
