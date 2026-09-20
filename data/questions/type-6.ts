import type { Question } from '../schema';

/**
 * 유형 6 문항 10개 = 5 facet × 2.
 *
 * 전부 `data/types.ts`의 구성개념 요약만 보고 새로 쓴 한국어 문장이다
 * (`docs/sources.md` §1 원문 격리).
 *
 * **상태-특성 혼동 방어**: 유형 6은 불안 상태를 잘못 포착할 위험이 크다(§5).
 * 따라서 ① `t6-doubt-loop` 문항은 전부 `지난 몇 년간 대체로`로 시간 프레임을
 * 길게 고정했고 ② 어느 문항도 지금의 긴장·불안감을 묻지 않으며 ③ 측정 대상을
 * "위험 예측과 확인 습관"이라는 행동 패턴으로 한정했다.
 */
export const type6Questions: Question[] = [
  {
    id: 'q6-01',
    typeId: 6,
    text: '평소에 일을 시작하기 전에 기댈 만한 근거부터 확보해 둔다.',
    sourceId: 'riso-hudson-wisdom',
    origin: 'authored',
    facet: 't6-security-seeking',
    reverse: false,
    rationale:
      '확보의 목적이 현재의 오류 교정이 아니라 앞으로 기댈 기반 마련이므로 1번이 아니라 6번의 동기를 잰다.',
    authoredBy: 'worker-items-b',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review-5', note: '"기댈 만한 근거부터 확보해 둔다"는 준비 행동 기술로 확실성 추구를 표현했다.' },
  },
  {
    id: 'q6-02',
    typeId: 6,
    text: '평소에 확실한 보장이 없어도 마음 편히 일을 진행하는 편이다.',
    sourceId: 'riso-hudson-wisdom',
    origin: 'authored',
    facet: 't6-security-seeking',
    reverse: true,
    rationale:
      '확실함 확보 동기의 반대 방향 긍정 진술로, 통제권 장악이 아니라 안전 기반의 필요를 재므로 8번이 아니라 6번을 잰다.',
    authoredBy: 'worker-items-b',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review-5', note: 'q6-01의 반대 방향 긍정 진술로 "확실한 보장이 없어도 마음 편히"라는 조건절 대비를 자체 구성했다.' },
  },
  {
    id: 'q6-03',
    typeId: 6,
    text: '평소에 기댈 사람이 없는 상황에 놓일 때를 미리 대비해 둔다.',
    sourceId: 'riso-hudson-wisdom',
    origin: 'authored',
    facet: 't6-unsupported-fear',
    reverse: false,
    rationale:
      '대비의 대상이 통제당할 가능성이 아니라 기댈 데 없이 혼자 감당하는 상황이므로 8번이 아니라 6번의 두려움을 잰다.',
    authoredBy: 'worker-items-b',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review-5', note: '"기댈 사람이 없는 상황"이라는 지지 상실 시나리오에 대한 사전 대비 행동으로 6번 핵심 두려움을 간접 기술했다.' },
  },
  {
    id: 'q6-04',
    typeId: 6,
    text: '평소에 어려운 일이 닥치면 누가 내 편에 있는지에 먼저 눈이 간다.',
    sourceId: 'palmer-1988',
    origin: 'authored',
    facet: 't6-unsupported-fear',
    reverse: false,
    rationale:
      '먼저 보이는 것이 누가 결정권을 쥐었는가가 아니라 누가 곁에 남아 줄 것인가이므로 8번이 아니라 6번을 잰다.',
    authoredBy: 'worker-items-b',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '곤경에서 아군 소재를 먼저 보는 주의 초점 문장이다.' },
  },
  {
    id: 'q6-05',
    typeId: 6,
    text: '평소에 새 계획을 들으면 앞으로 잘못될 수 있는 지점이 먼저 눈에 들어온다.',
    sourceId: 'palmer-1988',
    origin: 'authored',
    facet: 't6-risk-attention',
    reverse: false,
    rationale:
      '먼저 보이는 것이 지금 어긋나 있는 오류가 아니라 앞으로의 위험이므로 1번이 아니라 6번의 주의 초점을 잰다.',
    authoredBy: 'worker-items-b',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '미래 오류 지점에 주의가 가는 초점을 "앞으로 잘못될 수 있는 지점"으로 지정했다.' },
  },
  {
    id: 'q6-06',
    typeId: 6,
    text: '평소에 여행을 준비할 때는 일이 어긋날 경우의 대비책에 먼저 눈이 간다.',
    sourceId: 'palmer-1988',
    origin: 'authored',
    facet: 't6-risk-attention',
    reverse: false,
    rationale:
      '먼저 보이는 것이 현재 준비물의 결함이 아니라 최악의 경우에 대한 대비이므로 1번이 아니라 6번을 잰다.',
    authoredBy: 'worker-items-b',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review-5', note: '여행 준비라는 일상 장면에서 "어긋날 경우의 대비책"을 초점으로 지정한 독자적 주의 초점 문형이다.' },
  },
  {
    id: 'q6-07',
    typeId: 6,
    text: '평소에 처음 만난 사람에게는 의도를 확인한 뒤에야 마음을 연다.',
    sourceId: 'chestnut-2013',
    origin: 'authored',
    facet: 't6-trust-testing',
    reverse: false,
    rationale:
      '거리를 두는 이유가 통제 거부가 아니라 신뢰 가능 여부의 확인이므로 8번이 아니라 6번의 관계 방식을 잰다.',
    authoredBy: 'worker-items-b',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review-5', note: '초면 관계에서 "의도를 확인한 뒤에야 마음을 연다"는 순서 기술로 신뢰 검증 행동을 표현했다.' },
  },
  {
    id: 'q6-08',
    typeId: 6,
    text: '평소에 처음 보는 사람도 별다른 확인 없이 믿고 시작하는 편이다.',
    sourceId: 'chestnut-2013',
    origin: 'authored',
    facet: 't6-trust-testing',
    reverse: true,
    rationale:
      '신뢰 확인 절차의 반대 방향 긍정 진술로, 상대의 오류 점검이 아니라 신뢰성 확인을 재므로 1번이 아니라 6번을 잰다.',
    authoredBy: 'worker-items-b',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review-5', note: 'q6-07의 반대 방향 긍정 진술이며 "별다른 확인 없이 믿고 시작하는"이라는 한국어 표현을 사용했다.' },
  },
  {
    id: 'q6-09',
    typeId: 6,
    text: '지난 몇 년간 대체로 결정을 내린 뒤에도 그 선택을 여러 번 되짚어 보곤 했다.',
    sourceId: 'riso-hudson-personality-types',
    origin: 'authored',
    facet: 't6-doubt-loop',
    reverse: false,
    rationale:
      '되짚는 기준이 기준 위반 여부가 아니라 앞으로 안전한가이므로 1번이 아니라 6번의 부하 반응을 잰다.',
    authoredBy: 'worker-items-b',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '결정 후 재검토를 "여러 번 되짚어"로 표현한 자체 문장이다.' },
  },
  {
    id: 'q6-10',
    typeId: 6,
    text: '지난 몇 년간 대체로 이미 정한 일도 한 번 더 확인하고 나서야 넘어가는 편이었다.',
    sourceId: 'naranjo-1994',
    origin: 'authored',
    facet: 't6-doubt-loop',
    reverse: false,
    rationale:
      '확인의 목적이 고칠 점 발견이 아니라 확신과 의심 사이를 매듭짓는 것이므로 1번이 아니라 6번을 잰다.',
    authoredBy: 'worker-items-b',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '확정 사항의 재확인을 행동으로 기술했으며 기존 척도 표현과 겹치지 않는다.' },
  },
];
