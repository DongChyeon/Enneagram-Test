import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { BASE_PLAN, questions } from '../data/questions';
import { resultFromScores } from '../lib/scoring';
import type { Scores } from '../lib/types';
import { PersonalizedInsights } from './PersonalizedInsights';
import { emptyAnswers, rememberAnswerProfile } from './progress';

afterEach(() => {
  cleanup();
  sessionStorage.clear();
});

const fullScores: Scores = { 1: 20, 2: 21, 3: 22, 4: 37, 5: 40, 6: 23, 7: 24, 8: 25, 9: 26 };

describe('PersonalizedInsights', () => {
  it('상위 세 유형의 조합과 결과가 맞지 않을 수 있는 신호를 보여준다', () => {
    render(<PersonalizedInsights result={resultFromScores(fullScores)} code="shared" />);

    expect(screen.getByText(/5유형이 가장 높고, 4유형과 3점 차이/)).toBeTruthy();
    expect(screen.getByText(/세 번째 후보는 9유형/)).toBeTruthy();
    expect(screen.getByText('이 결과가 잘 맞지 않을 수 있는 신호')).toBeTruthy();
  });

  it('90문항을 완료한 본인에게만 세부 경향과 응답 근거를 보여준다', async () => {
    const answers = questions.map(() => 5 as const);
    rememberAnswerProfile('mine-full', answers);
    render(<PersonalizedInsights result={resultFromScores(fullScores)} code="mine-full" />);

    await waitFor(() => expect(screen.getByText('90문항에서 나타난 세부 경향')).toBeTruthy());
    expect(screen.getByText('이런 응답이 결과에 영향을 줬어요')).toBeTruthy();
    expect(screen.getByText(/공유 링크에는 포함되지 않아요/)).toBeTruthy();
  });

  it('27문항을 완료한 본인에게 상위 두 유형용 추가 질문 6개를 제공한다', async () => {
    const answers = emptyAnswers(questions.length);
    for (const position of BASE_PLAN) answers[position] = 4;
    rememberAnswerProfile('mine-base', answers);
    const scores: Scores = { 1: 8, 2: 8, 3: 8, 4: 13, 5: 14, 6: 8, 7: 8, 8: 8, 9: 8 };
    const { container } = render(
      <PersonalizedInsights result={resultFromScores(scores, 'base')} code="mine-base" />,
    );

    await waitFor(() => expect(screen.getByText('상위 두 유형을 조금 더 비교해 볼까요?')).toBeTruthy());
    expect(container.querySelectorAll('fieldset')).toHaveLength(6);
  });
});
