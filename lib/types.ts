/**
 * 채점·인코딩 레이어 공용 타입.
 *
 * `data/schema.ts`가 콘텐츠(문항·유형·윙)의 타입을 소유하고,
 * 이 파일은 **응답과 결과**의 타입을 소유한다.
 */

import type { TypeId } from '../data/schema';

/** 5점 리커트 응답값. */
export type Likert = 1 | 2 | 3 | 4 | 5;

/** 한 문항에 대한 응답. `questionId`는 `data/questions.ts`의 `id`다. */
export type Answer = {
  questionId: string;
  value: Likert;
};

/**
 * 결과가 어느 문항 세트에서 나왔는지.
 *
 * - `'base'` 기본 27문항. 유형당 3문항 → 점수 3~15.
 * - `'legacy-base'` 기존 45문항 공유 결과. 유형당 5문항 → 점수 5~25.
 * - `'full'` 전체 90문항. 유형당 10문항 → 점수 10~50.
 *
 * 세 문항 세트는 점수 척도와 내용 범위가 다르므로 **같은 것으로 취급하지 않는다.** 이 값이
 * `lib/code.ts`의 버전 바이트를 고르고, 결과 화면이 어떤 한계를 적을지를 정한다.
 */
export type ResultKind = 'base' | 'legacy-base' | 'full';

/**
 * 9유형 원점수. 범위는 문항 세트가 정한다 — 유형당 `n`문항 × 리커트 1~5이므로
 * 기본 검사(n=3)는 **3~15**, 기존 검사(n=5)는 **5~25**, 전체 90문항(n=10)은 **10~50**이다.
 * 역채점(`6 - value`)을 적용해도 문항당 기여는 1~5로 동일하므로 범위는 변하지 않는다.
 */
export type Scores = Record<TypeId, number>;

/** 결과. URL 코드가 담는 것은 `kind`와 `scores`뿐이고 나머지는 디코드 시 재계산된다. */
export type Result = {
  kind: ResultKind;
  scores: Scores;
  primaryType: TypeId;
  /** `5w4` 형식. `^[1-9]w[1-9]$` */
  wing: string;
  ambiguous: boolean;
};
