import type { Question } from './schema';

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
 * 90문항 전체. 유형 번호 → 유형 내 문항 번호 순서로 고정된다.
 *
 * 문항 본문은 `data/questions/type-*.ts` 아홉 파일이 소유하고, 이 파일은
 * 순서만 고정한다 — 문항을 여기에 다시 적지 않는다. 세 작성 배치
 * (worker-items-a / -b / -c)가 서로를 보지 않고 작성했으므로, 배치 간
 * 정합성(시간 프레임 고정, §5 고충돌 쌍 변별)은 Step 2-C의 통합 검수에서
 * 한 번에 확인했고 그 결과는 `docs/item-review.md` §facet 충돌 검수에 있다.
 *
 * `copyrightReview`는 90문항 전부 `verdict: 'pending'`이다. Step 2.5의
 * 독립 리뷰어만 이 필드를 덮어쓴다(`docs/sources.md` §4.1).
 */
export const questions: Question[] = [
  ...type1Questions,
  ...type2Questions,
  ...type3Questions,
  ...type4Questions,
  ...type5Questions,
  ...type6Questions,
  ...type7Questions,
  ...type8Questions,
  ...type9Questions,
];
