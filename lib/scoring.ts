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

import { questions } from '../data/questions';
import type { TypeId } from '../data/schema';
import type { Answer, Result, Scores } from './types';

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
 * 90문항 응답을 유형별 원점수로 환산한다.
 *
 * 응답이 하나라도 누락됐거나 값이 1~5 정수가 아니면 예외를 던진다 —
 * 부분 응답을 조용히 채점하면 10 미만의 점수가 나와 인코딩(1바이트, 10~50)이
 * 깨진다. 결과 페이지는 90문항 완주 시에만 도달 가능하므로(AC-4) 이는 버그 신호다.
 */
export function scoreAnswers(answers: Answer[]): Scores {
  const byQuestionId = new Map<string, number>();
  for (const answer of answers) {
    byQuestionId.set(answer.questionId, answer.value);
  }

  const scores: Scores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  for (const question of questions) {
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

/** 1위와 2위의 점수차가 3 미만이면 유형이 뚜렷하지 않다고 본다. */
export function isAmbiguous(scores: Scores): boolean {
  const sorted = TYPE_IDS.map((t) => scores[t]).sort((a, b) => b - a);
  return sorted[0] - sorted[1] < 3;
}

/** 점수에서 결과를 파생한다. 인코딩된 코드를 디코드할 때도 같은 경로를 쓴다. */
export function resultFromScores(scores: Scores): Result {
  const primaryType = resolvePrimary(scores);
  return {
    scores,
    primaryType,
    wing: resolveWing(scores, primaryType),
    ambiguous: isAmbiguous(scores),
  };
}

/** 응답 → 결과. */
export function buildResult(answers: Answer[]): Result {
  return resultFromScores(scoreAnswers(answers));
}
