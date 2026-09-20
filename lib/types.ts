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
 * 9유형 원점수. 유형당 10문항 × 리커트 1~5이므로 각 값은 **10~50**이다.
 * 역채점(`6 - value`)을 적용해도 문항당 기여는 1~5로 동일하므로 범위는 변하지 않는다.
 */
export type Scores = Record<TypeId, number>;

/** 결과. URL 코드가 담는 것은 `scores`뿐이고 나머지는 디코드 시 재계산된다. */
export type Result = {
  scores: Scores;
  primaryType: TypeId;
  /** `5w4` 형식. `^[1-9]w[1-9]$` */
  wing: string;
  ambiguous: boolean;
};
