import type { FacetKind, Question } from './schema';
import { facets } from './types';

import { type1Questions } from './questions/type-1';
import { type2Questions } from './questions/type-2';
import { type3Questions } from './questions/type-3';
import { type4Questions } from './questions/type-4';
import { type5Questions } from './questions/type-5';
import { type6Questions } from './questions/type-6';
import { type7Questions } from './questions/type-7';
import { type8Questions } from './questions/type-8';
import { type9Questions } from './questions/type-9';

/**
 * 90문항 전체의 **제시 순서**와, 그 안에서 잘라낸 27문항 짧은 판.
 *
 * 문항 본문은 `data/questions/type-*.ts` 아홉 파일이 소유하고, 이 파일은
 * 순서만 고정한다 — 문항을 여기에 다시 적지 않는다. 아래의 어떤 배열도
 * 손으로 id를 옮겨 적어 만들지 않는다. 전부 아홉 모듈에서 계산한다.
 *
 * `copyrightReview`는 90문항 전부 Step 2.5 리뷰어가 덮어쓴다(`docs/sources.md` §4.1).
 *
 * ## 왜 유형 순서로 늘어놓지 않는가 (측정 문제)
 * 예전 순서는 아홉 모듈을 그대로 이어 붙인 `q1-01 … q1-10, q2-01 …`이었다.
 * 화면이 10문항씩 묶어 보여 주므로 **한 묶음이 정확히 한 유형**이 됐고,
 * 응답자는 "정확함"에 대한 열 문장을 연달아 읽은 뒤 "돌봄"에 대한 열 문장을
 * 읽었다. 이 배치는 두 가지를 부른다 —
 *   ① **응답 세트**: 묶음의 주제를 알아차린 뒤부터는 문항 하나하나가 아니라
 *      자기 개념("나는 꼼꼼한 사람인가")에 맞춰 답하게 된다.
 *   ② **후광 효과**: 묶음 안 첫 문항에 매긴 값이 남은 아홉 문항의 기준선이 된다.
 * 둘 다 유형 점수를 문항의 합이 아니라 **자기 개념 한 번의 판단**으로 만든다.
 *
 * ## 순서 규칙 — 고정된 라운드로빈 (`interleave`)
 * 무작위 셔플이 아니다. 사용자마다 순서가 달라지면 `sessionStorage` 복원과
 * 문항 세트 서명(`components/progress.ts`)이 성립하지 않고, 실패를 재현할 수도
 * 없다. 대신 **아홉 모듈의 선언 순서에서 산술로만 결정되는** 순서를 쓴다:
 *
 * ```
 * 라운드 r(0…9) 안에서 유형 t(0…8)를 차례로 돌며, t의 (r + 3t) mod 10 번째 문항
 * ```
 *
 * - 한 라운드 = 아홉 유형 각 1문항 → **인접한 두 문항의 유형이 절대 같지 않다**
 *   (라운드 경계에서도 t=8 다음이 t=0이므로 같아지지 않는다).
 * - `gcd(3, 10) = 1`이므로 유형마다 10문항이 **정확히 한 번씩** 쓰인다.
 * - 보폭 3은 facet 축까지 흩는다. 모듈은 facet당 2문항씩 동기→두려움→주의
 *   초점→관계→부하 순으로 묶여 있어 보폭 1이면 라운드 전체가 같은 축이 된다.
 *   보폭 3이면 인접한 두 문항이 같은 축인 경우가 90문항 통틀어 **0쌍**이다.
 * - 입력이 같으면 출력이 같다. 기계·실행·사용자에 따라 달라지는 값이 없다.
 *
 * 점수는 `typeId`로 합산되므로(`lib/scoring.ts`) 제시 순서는 점수에도, 따라서
 * URL 인코딩에도 영향을 주지 않는다. `lib/scoring.test.ts`가 그것을 확인한다.
 */

/** 배열 인덱스 = 유형 번호 − 1. 이 배열의 순서가 라운드로빈의 t 순서다. */
const QUESTIONS_BY_TYPE: readonly (readonly Question[])[] = [
  type1Questions,
  type2Questions,
  type3Questions,
  type4Questions,
  type5Questions,
  type6Questions,
  type7Questions,
  type8Questions,
  type9Questions,
];

export const TYPE_COUNT = QUESTIONS_BY_TYPE.length;

const facetKindById = new Map<Question['facet'], FacetKind>(
  facets.map((facet) => [facet.id, facet.kind]),
);

/**
 * 유형별 문항 묶음을 하나의 제시 순서로 엮는다.
 *
 * 모든 유형이 같은 개수 `n`을 가져야 하고 `gcd(stride, n) === 1`이어야 한다 —
 * 아니면 어떤 문항은 두 번 나오고 어떤 문항은 빠진다. 둘 다 여기서 막는다.
 */
function interleave(byType: readonly (readonly Question[])[], stride: number): Question[] {
  const perType = byType[0].length;
  for (const items of byType) {
    if (items.length !== perType) {
      throw new Error(`유형별 문항 수가 다르다: ${perType} ≠ ${items.length}`);
    }
  }
  let a = stride % perType;
  let b = perType;
  while (a !== 0) {
    [a, b] = [b % a, a];
  }
  if (b !== 1) {
    throw new Error(`보폭과 문항 수가 서로소가 아니다: stride=${stride}, perType=${perType}`);
  }

  const ordered: Question[] = [];
  for (let round = 0; round < perType; round += 1) {
    for (let type = 0; type < byType.length; type += 1) {
      ordered.push(byType[type][(round + stride * type) % perType]);
    }
  }
  return ordered;
}

/** 90문항 전체. 이 배열의 인덱스가 응답 배열의 인덱스다(정본 좌표계). */
export const questions: Question[] = interleave(QUESTIONS_BY_TYPE, 3);

/** 문항 id → 정본 좌표계에서의 위치. 아래의 모든 "계획"이 이 좌표를 쓴다. */
const positionById = new Map<string, number>(questions.map((question, at) => [question.id, at]));

function positionsOf(items: readonly Question[]): readonly number[] {
  return items.map((question) => {
    const at = positionById.get(question.id);
    if (at === undefined) throw new Error(`정본 순서에 없는 문항: ${question.id}`);
    return at;
  });
}

/**
 * ## 기본 45문항의 선택 규칙
 *
 * 새 문항을 쓰지 않는다. **90문항의 진부분집합**이고, 유형당 5문항이다.
 *
 * 1. `facet`은 유형마다 다섯 개이고 문항이 둘씩 붙어 있다. **다섯 facet에서
 *    각각 한 문항씩** 뽑는다 — 축을 빼지 않으므로 동기·두려움·주의 초점·관계·
 *    부하가 전부 한 번씩 측정된다. 45문항이 "빠른 판"이 아니라 **기본 검사**인
 *    이유가 이것이다: 재는 축의 구성이 90문항과 같고, 축당 문항 수만 절반이다.
 * 2. 한 facet의 두 문항 중 어느 쪽인가. 유형마다 동기→두려움→주의 초점→관계→
 *    부하 순으로 훑으며 **역채점 문항을 만나는 첫 facet에서만** 그 역채점 문항을
 *    채택하고, 나머지 facet에서는 그 facet의 첫 문항을 쓴다.
 *
 * 규칙 2가 있어야 하는 이유: 유형당 역채점은 2문항인데 둘 다 빠지면 기본 검사의
 * 묵종 편향 방어가 **0**이 된다. 아홉 유형 모두 두 역채점이 서로 다른 facet에
 * 있으므로, 이 규칙은 기본 45문항에 유형당 정확히 1문항(총 9문항), 남는 45문항에도
 * 유형당 1문항을 넣는다 — 양쪽 어느 쪽도 방어가 비지 않는다.
 *
 * 규칙이 데이터에서 계산되므로, 문항 파일에서 `reverse`나 `facet`이 바뀌면
 * 선택도 따라 바뀐다. 손으로 맞춰 둔 id 목록은 어디에도 없다.
 */
const FACET_KIND_ORDER: readonly FacetKind[] = [
  'motivation',
  'fear',
  'attention',
  'interpersonal',
  'stress',
];

export const BASE_ITEMS_PER_TYPE = FACET_KIND_ORDER.length;

function pickBaseItems(items: readonly Question[]): Question[] {
  const picked: Question[] = [];
  let tookReverse = false;
  for (const kind of FACET_KIND_ORDER) {
    const candidates = items.filter((question) => facetKindById.get(question.facet) === kind);
    if (candidates.length === 0) throw new Error(`축에 해당하는 문항이 없다: ${kind}`);
    const reverse = candidates.find((question) => question.reverse);
    if (!tookReverse && reverse !== undefined) {
      picked.push(reverse);
      tookReverse = true;
    } else {
      picked.push(candidates[0]);
    }
  }
  if (!tookReverse) throw new Error('기본 45문항에 역채점 문항이 하나도 없다');
  return picked;
}

const BASE_BY_TYPE = QUESTIONS_BY_TYPE.map(pickBaseItems);
const BASE_IDS = new Set(BASE_BY_TYPE.flat().map((question) => question.id));

/**
 * 세 가지 **진행 계획**. 각 원소는 `questions`(정본 90) 안의 위치이고,
 * 배열의 순서가 화면에 나오는 순서다.
 *
 * 응답은 언제나 길이 90의 배열 하나에 정본 좌표로 담긴다. 기본 검사는 그 90칸
 * 중 45칸만 채우고, 이어하기는 **남은 45칸만** 묻는다 — 계획이 서로 겹치지
 * 않는 좌표 집합이므로 이미 답한 문항을 다시 물을 방법이 구조적으로 없다.
 */
export const FULL_PLAN: readonly number[] = questions.map((_, at) => at);

/** 기본 45문항. 유형당 5문항을 보폭 3 라운드로빈으로 엮는다(`gcd(3, 5) = 1`). */
export const BASE_PLAN: readonly number[] = positionsOf(interleave(BASE_BY_TYPE, 3));

/** 기본 검사가 묻지 않은 45문항. 유형당 5문항, 보폭 3. */
export const CONTINUE_PLAN: readonly number[] = positionsOf(
  interleave(
    QUESTIONS_BY_TYPE.map((items) => items.filter((question) => !BASE_IDS.has(question.id))),
    3,
  ),
);

/** 기본 45문항의 문항들. 채점(`lib/scoring.ts`)이 이 배열로 합산한다. */
export const baseQuestions: Question[] = BASE_PLAN.map((at) => questions[at]);
