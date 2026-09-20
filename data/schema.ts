/**
 * 데이터 레이어 공용 타입 정의.
 *
 * `data/sources.ts` · `data/types.ts` · `data/wings.ts` · `data/questions.ts`가
 * 모두 이 파일에서 타입을 가져온다. 문항 파일이 유형 파일을 import 하면
 * 작성 배치 간 순환 참조가 생기므로 타입만 별도 모듈로 분리했다.
 */

/** 애니어그램 유형 번호. 1~9 이외의 값은 컴파일 시점에 막힌다. */
export type TypeId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/* ------------------------------------------------------------------ */
/* 출처                                                                */
/* ------------------------------------------------------------------ */

/**
 * 이론 출처 레코드.
 *
 * `id`는 `docs/sources.md` §2의 `##` 표제와 **문자 그대로 일치**해야 한다.
 * AC-3의 표제 대조 테스트가 양쪽을 동시에 읽으므로 한쪽만 고치면 실패한다.
 */
export type Source = {
  id: string;
  /** docs/sources.md의 `명칭` */
  name: string;
  /** docs/sources.md의 `저자·기관` */
  author: string;
  /** docs/sources.md의 `라이선스` */
  license: string;
  /** docs/sources.md의 `접근 URL 또는 서지정보` 중 URL 성분 */
  url?: string;
  /** docs/sources.md의 `접근 URL 또는 서지정보` 중 서지 성분 (ISBN/DOI 등) */
  citation?: string;
  /** docs/sources.md의 `사용 방식` */
  usage: string;
};

/* ------------------------------------------------------------------ */
/* 유형 · 윙                                                            */
/* ------------------------------------------------------------------ */

/**
 * 9유형 서술.
 *
 * 유형 명칭은 **본 프로젝트가 자체적으로 정한 한국어 명칭**이다
 * (`docs/sources.md` §6 — 특정 출판물의 명칭 체계를 옮기지 않는다).
 * 서술은 전부 이론 구성개념에 근거한 자체 작성이며, 평균 발달 수준
 * (보통 사람의 일상적 표현)을 기준으로 쓴다.
 */
export type EnneagramType = {
  id: TypeId;
  nameKo: string;
  nameEn: string;
  summary: string;
  /** AC-8 ② 핵심 동기 */
  coreMotivation: string;
  /** AC-8 ② 핵심 두려움 */
  coreFear: string;
  /** AC-8 ② 강점 */
  strengths: string[];
  /** AC-8 ② 성장 포인트 */
  growthPoints: string[];
};

/**
 * 윙 서술. 9유형 × 인접 2유형 = 정확히 18개.
 *
 * 윙은 측정된 결과가 아니라 **이론적 해석**이다(hook-2021).
 * 결과 화면과 공유 카드는 이 사실을 명시하는 마커를 함께 렌더한다.
 */
export type Wing = {
  /** `5w4` 형식. `^[1-9]w[1-9]$` */
  label: string;
  baseTypeId: TypeId;
  wingTypeId: TypeId;
  description: string;
};

/* ------------------------------------------------------------------ */
/* facet                                                               */
/* ------------------------------------------------------------------ */

/**
 * facet의 측정 축(kind). 유형에 관계없이 다섯 축이 같다.
 * - `motivation`  핵심 동기
 * - `fear`        핵심 두려움
 * - `attention`   주의 초점 (palmer-1988) — 사회적 바람직성에 가장 덜 취약한 형식
 * - `interpersonal` 관계에서의 행동
 * - `stress`      부하가 걸릴 때의 반응
 */
export type FacetKind =
  | 'motivation'
  | 'fear'
  | 'attention'
  | 'interpersonal'
  | 'stress';

/**
 * facet 식별자. **유형별로 고유하다** — 9유형 × 5 facet = 45개.
 *
 * 전역 5축(`FacetKind`)만으로는 "유형 1의 두려움"과 "유형 6의 두려움"이
 * 같은 값을 갖게 되어, 인접 유형 간 문항이 실제로 다른 것을 재고 있는지
 * (`docs/sources.md` §5의 고충돌 쌍 검수)를 데이터에서 확인할 수 없다.
 * 유형 범위 facet id는 그 검수를 가능하게 한다.
 *
 * 유형당 10문항 = 5 facet × 2문항이므로, 한 유형 안에서 각 facet은
 * 정확히 2회 등장한다.
 */
export type Facet =
  // 유형 1 — 기준을 지키는 사람
  | 't1-standards'
  | 't1-flaw-fear'
  | 't1-error-attention'
  | 't1-correction-voice'
  | 't1-restraint-pressure'
  // 유형 2 — 마음을 살피는 사람
  | 't2-being-needed'
  | 't2-rejection-fear'
  | 't2-need-radar'
  | 't2-self-sacrifice'
  | 't2-unreturned-resentment'
  // 유형 3 — 성과로 증명하는 사람
  | 't3-achievement-drive'
  | 't3-failure-image-fear'
  | 't3-efficiency-attention'
  | 't3-impression-tuning'
  | 't3-pause-difficulty'
  // 유형 4 — 고유함을 찾는 사람
  | 't4-authenticity'
  | 't4-lack-fear'
  | 't4-comparison-attention'
  | 't4-depth-expectation'
  | 't4-mood-swing'
  // 유형 5 — 혼자 탐색하는 사람
  | 't5-competence-reserve'
  | 't5-depletion-fear'
  | 't5-observation-attention'
  | 't5-boundary-keeping'
  | 't5-withdrawal'
  // 유형 6 — 위험을 미리 살피는 사람
  | 't6-security-seeking'
  | 't6-unsupported-fear'
  | 't6-risk-attention'
  | 't6-trust-testing'
  | 't6-doubt-loop'
  // 유형 7 — 가능성을 좇는 사람
  | 't7-option-keeping'
  | 't7-confinement-fear'
  | 't7-possibility-attention'
  | 't7-mood-lifting'
  | 't7-follow-through'
  // 유형 8 — 주도권을 잡는 사람
  | 't8-self-agency'
  | 't8-vulnerability-fear'
  | 't8-power-attention'
  | 't8-direct-confrontation'
  | 't8-intensity-overrun'
  // 유형 9 — 균형을 맞추는 사람
  | 't9-inner-calm'
  | 't9-conflict-fear'
  | 't9-others-view-attention'
  | 't9-accommodation'
  | 't9-priority-blur';

/** facet 정의. 문항 작성자가 읽는 한 줄 설명이자, 검수의 기준선이다. */
export type FacetDef = {
  id: Facet;
  typeId: TypeId;
  kind: FacetKind;
  /** 이 facet이 무엇을 재는지 한 문장 */
  description: string;
};

/* ------------------------------------------------------------------ */
/* 문항                                                                */
/* ------------------------------------------------------------------ */

/**
 * 문항 저작권 판정 (Step 2.5).
 *
 * `'pending'`은 Step 2 산출 시점의 플레이스홀더다. AC-14가 `'clear'`만
 * 통과시키므로, 리뷰어가 명시적으로 판정을 덮어쓰지 않으면 게이트가
 * 열리지 않는다(fail-closed).
 *
 * **커밋된 `data/questions.ts`에 최종 존속할 수 있는 값은 `'clear'` 뿐이다.**
 * `'rewritten'` / `'rejected'`는 처리 이력이므로 `docs/item-review.md`에만
 * 남고, 해당 문항은 재작성되어 `'clear'`가 되거나 데이터에서 제거된다.
 */
export type CopyrightReview = {
  verdict: 'pending' | 'clear' | 'rewritten' | 'rejected';
  /** Step 2.5 리뷰어 식별자. 같은 문항의 `authoredBy`와 달라야 한다(AC-14). */
  reviewedBy: string;
  /** 판정 근거 1~2문장 */
  note: string;
};

/** 문항 레코드. 모든 필드가 필수다 — optional은 하나도 없다(AC-2). */
export type Question = {
  id: string;
  typeId: TypeId;
  text: string;
  /** `data/sources.ts`의 id 집합에 존재해야 한다(참조 무결성). */
  sourceId: string;
  origin: 'adapted' | 'authored';
  facet: Facet;
  /** true면 채점 시 `6 - value`. 유형당 정확히 2개. 부정문이 아니라 반대 방향 긍정 진술로 쓴다. */
  reverse: boolean;
  /** 이 문항이 왜 인접 유형이 아니라 이 유형을 재는지 */
  rationale: string;
  /** 이 문항을 작성한 배치의 작성자 식별자. AC-14가 `copyrightReview.reviewedBy`와 대조한다. */
  authoredBy: string;
  copyrightReview: CopyrightReview;
};
