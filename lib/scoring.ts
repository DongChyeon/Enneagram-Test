/**
 * 채점 엔진 (AC-5, AC-6).
 *
 * ## 채점
 * 유형당 10문항 × 리커트 1~5 → 유형 점수 **10~50**.
 * `question.reverse === true`인 문항은 응답값 `v` 대신 **`6 - v`**를 더한다
 * (1→5, 2→4, 3→3, 4→2, 5→1).
 *
 * **역채점은 점수 범위를 바꾸지 않는다** — 역채점 문항도 여전히 1~5를 기여하므로
 * 유형 합계는 10~50 그대로다. 따라서 `lib/code.ts`의 1바이트/유형 base64url
 * 페이로드, `code.length <= 20` 보장, AC-9의 경계 조합(전부 10 / 전부 50)은
 * 아무 영향도 받지 않는다. 이 사실이 명시돼 있으므로 인코딩 설계를 다시 열지 않는다.
 *
 * ## 인접(adjacency) 정의
 * 애니어그램 원은 순환이다. 유형 `n`의 인접 유형은
 * **`(n+7)%9+1`(이전)** 과 **`n%9+1`(다음)** 이며, `인접합`은 이 둘의 점수 합이다.
 * **자기 점수는 포함하지 않는다.** (n=1 → 9와 2, n=9 → 8과 1)
 *
 * ## 주유형 동점 규칙 — 결정적 필터 체인
 * pairwise 비교가 아니라 **남은 후보 집합 전체에 순차 적용**한다.
 *   1. `후보 = argmax(score)`
 *   2. `|후보| > 1`이면 `후보 = argmax(인접합)` — 남은 후보 집합에 대해서만
 *   3. 여전히 `|후보| > 1`이면 `min(typeId)`
 *
 * ## 윙 동점 규칙
 * 윙은 주유형의 인접 두 유형 중 고득점 쪽이다.
 * **동점이면 순환 `n-1` 쪽을 채택한다** (회전 대칭 보존).
 * 따라서 주유형 1의 동점은 `1w9`, 주유형 9의 동점은 `9w8`이다.
 *
 * ## 모호성
 * `isAmbiguous`는 `1위 − 2위 < 3`(10~50 척도의 절대 점수차)일 때 참이다.
 * 임계값 3은 "문항 1개 수준의 응답 흔들림(리커트 한 칸 = 1점)으로는 순위가
 * 뒤집히지 않는다"고 말할 수 있는 최소선으로 고른 값이며, 통계적으로 유도된
 * 컷오프가 아니다. 한계: 이 검사는 1위와 2위만 본다 — 3위 이하가 촘촘히 붙은
 * 분포는 모호하지 않다고 판정된다.
 *
 * **동점 규칙과 문항 세트는 URL 계약의 일부다** — 둘 중 하나라도 바꾸면
 * `lib/code.ts`의 버전 바이트를 올려야 하고, 기존 공유 링크는 무효가 된다.
 * 같은 내용이 `README.md`에도 기록돼 있다.
 */

import { baseQuestions, questions } from '../data/questions';
import type { Question, TypeId } from '../data/schema';
import type { Answer, Result, ResultKind, Scores } from './types';

/**
 * 문항 세트별 척도.
 *
 * `itemsPerType`만 바뀌고 나머지는 거기서 따라 나온다 — 점수 범위는
 * `[n, 5n]`이고, 이 범위가 `lib/code.ts`의 1바이트/유형 인코딩 검증에 그대로 쓰인다.
 *
 * ## `ambiguityBand`가 왜 세트마다 다른가
 * **같은 비율을 유지한 것이다.** 전체 90문항의 3점은 폭 41(10~50) 위의 값이고,
 * "리커트 한 칸 수준의 흔들림 세 번으로는 순위가 뒤집히지 않는다"고 말할 수 있는
 * 최소선으로 고른 값이다. 기본 45문항의 폭은 21(5~25)이므로 같은 비율이면
 * `3 × 21 / 41 ≈ 1.5`, 정수로 올려 **2**다. 같은 절대값 3을 그대로 쓰면 폭이
 * 절반인 척도에서 두 배로 관대해진다.
 *
 * 두 값 모두 통계적으로 유도된 컷오프가 아니라 판단이다. 결과 종류에 따라
 * 임계값이 갈린다는 사실은 `lib/scoring.test.ts`가 고정한다.
 */
export const SCALES: Record<ResultKind, { itemsPerType: number; min: number; max: number; ambiguityBand: number }> = {
  base: { itemsPerType: 5, min: 5, max: 25, ambiguityBand: 2 },
  full: { itemsPerType: 10, min: 10, max: 50, ambiguityBand: 3 },
};

/** 그 세트가 채점하는 문항들. 제시 순서는 무관하다 — `typeId`로만 합산한다. */
export function itemsFor(kind: ResultKind): readonly Question[] {
  return kind === 'base' ? baseQuestions : questions;
}

/** 1~9. 순회 순서를 고정하기 위한 단일 정본. */
export const TYPE_IDS: readonly TypeId[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

/** 유형 `n`의 순환 이전 유형. n=1 → 9 */
export function prevType(n: TypeId): TypeId {
  return (((n + 7) % 9) + 1) as TypeId;
}

/** 유형 `n`의 순환 다음 유형. n=9 → 1 */
export function nextType(n: TypeId): TypeId {
  return ((n % 9) + 1) as TypeId;
}

/** 인접합 = 이전 유형 점수 + 다음 유형 점수. 자기 점수는 포함하지 않는다. */
export function adjacentSum(scores: Scores, n: TypeId): number {
  return scores[prevType(n)] + scores[nextType(n)];
}

/**
 * 한 문항 세트의 응답을 유형별 원점수로 환산한다.
 *
 * 응답이 하나라도 누락됐거나 값이 1~5 정수가 아니면 예외를 던진다 —
 * 부분 응답을 조용히 채점하면 하한 미만의 점수가 나와 인코딩(1바이트)이
 * 깨진다. 결과 페이지는 그 세트를 완주해야만 도달 가능하므로 이는 버그 신호다.
 *
 * 세트가 달라도 코드는 하나다. 기본 45문항은 90문항의 **진부분집합**이므로
 * 같은 `typeId` 합산 규칙과 같은 역채점 규칙이 그대로 적용된다.
 */
export function scoreAnswers(answers: Answer[], kind: ResultKind = 'full'): Scores {
  const byQuestionId = new Map<string, number>();
  for (const answer of answers) {
    byQuestionId.set(answer.questionId, answer.value);
  }

  const scores: Scores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  for (const question of itemsFor(kind)) {
    const value = byQuestionId.get(question.id);
    if (value === undefined) {
      throw new Error(`응답 누락: ${question.id}`);
    }
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      throw new Error(`리커트 범위 위반: ${question.id} → ${value}`);
    }
    scores[question.typeId] += question.reverse ? 6 - value : value;
  }
  return scores;
}

/** 주유형. 위 문서의 결정적 필터 체인 ①→②→③을 순서대로 적용한다. */
export function resolvePrimary(scores: Scores): TypeId {
  // ① 최고점 후보
  const maxScore = Math.max(...TYPE_IDS.map((t) => scores[t]));
  let candidates = TYPE_IDS.filter((t) => scores[t] === maxScore);

  // ② 남은 후보 집합 안에서 인접합 최대 (pairwise 아님)
  if (candidates.length > 1) {
    const maxAdjacent = Math.max(...candidates.map((t) => adjacentSum(scores, t)));
    candidates = candidates.filter((t) => adjacentSum(scores, t) === maxAdjacent);
  }

  // ③ 그래도 남으면 최소 유형 번호
  return candidates.reduce((a, b) => (a <= b ? a : b));
}

/** 윙 라벨(`5w4`). 인접 두 유형 중 고득점, 동점이면 순환 `n-1` 쪽. */
export function resolveWing(scores: Scores, primary: TypeId): string {
  const prev = prevType(primary);
  const next = nextType(primary);
  const wing = scores[prev] >= scores[next] ? prev : next;
  return `${primary}w${wing}`;
}

/** 1위와 2위의 점수차가 세트의 `ambiguityBand` 미만이면 유형이 뚜렷하지 않다고 본다. */
export function isAmbiguous(scores: Scores, kind: ResultKind = 'full'): boolean {
  const sorted = TYPE_IDS.map((t) => scores[t]).sort((a, b) => b - a);
  return sorted[0] - sorted[1] < SCALES[kind].ambiguityBand;
}

/** 점수에서 결과를 파생한다. 인코딩된 코드를 디코드할 때도 같은 경로를 쓴다. */
export function resultFromScores(scores: Scores, kind: ResultKind = 'full'): Result {
  const primaryType = resolvePrimary(scores);
  return {
    kind,
    scores,
    primaryType,
    wing: resolveWing(scores, primaryType),
    ambiguous: isAmbiguous(scores, kind),
  };
}

/** 응답 → 결과. */
export function buildResult(answers: Answer[], kind: ResultKind = 'full'): Result {
  return resultFromScores(scoreAnswers(answers, kind), kind);
}
