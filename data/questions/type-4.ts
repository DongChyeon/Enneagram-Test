import type { Question } from '../schema';

/**
 * 유형 4 문항 10개 = 5 facet × 2.
 *
 * 전부 `data/types.ts`의 구성개념 요약만 보고 새로 쓴 한국어 문장이다
 * (`docs/sources.md` §1 원문 격리). 어떤 상용 검사 문항도 열람·참조하지 않았다.
 *
 * **상태-특성 혼동 방어**: 유형 4는 우울 상태를 잘못 포착할 위험이 가장 큰
 * 유형이다(§5). 따라서 ① `t4-mood-swing` 문항은 전부 `지난 몇 년간 대체로`로
 * 시간 프레임을 길게 고정했고 ② 어느 문항도 지금의 슬픔·외로움을 묻지 않으며
 * ③ 측정 대상을 "비교에서 오는 결여감과 고유함 추구"라는 패턴으로 한정했다.
 */
export const type4Questions: Question[] = [
  {
    id: 'q4-01',
    typeId: 4,
    text: '평소에 남들과 같은 방식으로 하기보다 내 방식대로 가는 쪽을 택한다.',
    sourceId: 'riso-hudson-wisdom',
    origin: 'authored',
    facet: 't4-authenticity',
    reverse: false,
    rationale:
      '선택의 이유가 기준 준수가 아니라 자기다움 유지이므로 1번이 아니라 4번의 동기를 잰다.',
    authoredBy: 'worker-items-b',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '방식 선택의 독자성을 재는 문장으로, 낭만·예술성 어휘를 쓰는 상용 4번 문항과 표현이 다르다.' },
  },
  {
    id: 'q4-02',
    typeId: 4,
    text: '평소에 남들이 하는 방식을 그대로 따라도 마음이 편한 편이다.',
    sourceId: 'riso-hudson-wisdom',
    origin: 'authored',
    facet: 't4-authenticity',
    reverse: true,
    rationale:
      '고유함 추구의 반대 방향 긍정 진술로, 자원 보호가 아니라 정체성 유지 동기를 재므로 5번이 아니라 4번을 잰다.',
    authoredBy: 'worker-items-b',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '관습 수용을 긍정문 역채점으로 썼다.' },
  },
  {
    id: 'q4-03',
    typeId: 4,
    text: '지난 몇 년간 대체로 남들에겐 있는 무언가가 내게는 빠져 있다고 여겨 왔다.',
    sourceId: 'riso-hudson-wisdom',
    origin: 'authored',
    facet: 't4-lack-fear',
    reverse: false,
    rationale:
      '자책의 근거가 기준 위반이 아니라 남과 비교한 결여감이므로 1번이 아니라 4번의 두려움을 잰다.',
    authoredBy: 'worker-items-b',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '결여감 서술은 Arica v. Palmer가 보호 대상에서 제외한 유형 특성 기술이며 문장은 자체 작성이다.' },
  },
  {
    id: 'q4-04',
    typeId: 4,
    text: '평소에 남들에게는 당연한 것이 내게만 없다는 생각이 드는 편이다.',
    sourceId: 'riso-hudson-wisdom',
    origin: 'authored',
    facet: 't4-lack-fear',
    reverse: false,
    rationale:
      '결핍의 내용이 시간·에너지 자원이 아니라 정체성 조건이므로 5번이 아니라 4번을 잰다.',
    authoredBy: 'worker-items-b',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '같은 결여 구성개념을 "당연한 것이 내게만 없다"는 다른 통사로 표현한 자체 문장이다.' },
  },
  {
    id: 'q4-05',
    typeId: 4,
    text: '평소에 새 모임에 들어가면 다른 사람들과 나의 다른 점이 먼저 눈에 들어온다.',
    sourceId: 'palmer-1988',
    origin: 'authored',
    facet: 't4-comparison-attention',
    reverse: false,
    rationale:
      '먼저 보이는 것이 고쳐야 할 오류가 아니라 남과 자기의 차이이므로 1번이 아니라 4번의 주의 초점을 잰다.',
    authoredBy: 'worker-items-b',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '새 집단에서 차이에 주의가 가는 초점을 자체 표현으로 썼다.' },
  },
  {
    id: 'q4-06',
    typeId: 4,
    text: '평소에 남의 소식을 들어도 나와 견주기보다 내 할 일에 먼저 눈이 간다.',
    sourceId: 'palmer-1988',
    origin: 'authored',
    facet: 't4-comparison-attention',
    reverse: true,
    rationale:
      '비교 초점의 반대 방향 긍정 진술로, 경계 유지가 아니라 비교 주의 초점을 재므로 5번이 아니라 4번을 잰다.',
    authoredBy: 'worker-items-b',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '비교 대신 자기 과업으로 주의가 가는 반대 방향을 긍정문 역채점으로 썼다.' },
  },
  {
    id: 'q4-07',
    typeId: 4,
    text: '평소에 가벼운 안부만 오가는 대화는 오래 이어 가기가 어렵다.',
    sourceId: 'chestnut-2013',
    origin: 'authored',
    facet: 't4-depth-expectation',
    reverse: false,
    rationale:
      '대화를 접는 이유가 시간·에너지 절약이 아니라 깊이 이해받으려는 기대이므로 5번이 아니라 4번을 잰다.',
    authoredBy: 'worker-items-b',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '깊이 지향을 대화 지속 곤란이라는 행동으로 기술했다.' },
  },
  {
    id: 'q4-08',
    typeId: 4,
    text: '평소에 대화할 때는 상대가 나를 어디까지 이해하는지에 먼저 눈이 간다.',
    sourceId: 'palmer-1988',
    origin: 'authored',
    facet: 't4-depth-expectation',
    reverse: false,
    rationale:
      '먼저 보이는 것이 상대의 정보 요구가 아니라 자기가 이해받는 정도이므로 5번이 아니라 4번을 잰다.',
    authoredBy: 'worker-items-b',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '이해받음의 정도를 대화 중 주의 표적으로 지정한 독자 문장이다.' },
  },
  {
    id: 'q4-09',
    typeId: 4,
    text: '지난 몇 년간 대체로 감정이 올라오면 사람들과 거리를 두고 혼자 삭이는 편이었다.',
    sourceId: 'naranjo-1994',
    origin: 'authored',
    facet: 't4-mood-swing',
    reverse: false,
    rationale:
      '물러나는 계기가 자원 보호가 아니라 감정의 진폭이므로 5번이 아니라 4번의 부하 반응을 잰다.',
    authoredBy: 'worker-items-b',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '감정 처리 시 철수 행동을 "혼자 삭이는"으로 표현한 자체 문장이다.' },
  },
  {
    id: 'q4-10',
    typeId: 4,
    text: '지난 몇 년간 대체로 하루 안에서도 마음의 진폭이 남들보다 큰 편이었다.',
    sourceId: 'riso-hudson-personality-types',
    origin: 'authored',
    facet: 't4-mood-swing',
    reverse: false,
    rationale:
      '묻는 것이 기준 위반에 따른 자책의 강도가 아니라 감정 진폭의 크기이므로 1번이 아니라 4번을 잰다.',
    authoredBy: 'worker-items-b',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '정서 진폭을 장기 시간 프레임과 상대 비교로 이중 고정해 상태 문항화를 피했다.' },
  },
];
