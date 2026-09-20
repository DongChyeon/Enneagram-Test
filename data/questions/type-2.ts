import type { Question } from '../schema';

/**
 * 유형 2 — 마음을 살피는 사람. 10문항 = 5 facet × 2.
 *
 * 전부 `data/types.ts`의 구성개념 요약만 보고 새로 쓴 한국어 문장이다
 * (`docs/sources.md` §1 원문 격리). 유형 2는 사회적으로 승인받기 쉬운
 * 서술이라 상대·빈도 진술을 우선했다. 주의 초점 형식 3문항
 * (q2-03·q2-05·q2-06), 역채점 2문항(q2-08·q2-10)은 반대 방향 긍정 진술이다.
 */
export const type2Questions: Question[] = [
  {
    id: 'q2-01',
    typeId: 2,
    facet: 't2-being-needed',
    text: '평소에 가까운 사람이 나를 필요로 할 때 내 자리가 분명해진다.',
    sourceId: 'riso-hudson-wisdom',
    origin: 'authored',
    reverse: false,
    rationale:
      '자리 감각의 근거가 성과가 아니라 관계 안의 필요라는 점에서 유형 3과 갈리고, 마찰을 줄여 자리를 지키는 유형 9와 달리 필요를 채워 자리를 얻는 유형 2의 동기를 잰다.',
    authoredBy: 'worker-items-a',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '필요받음의 보상을 "내 자리가 분명해진다"로 표현했고 "나는 필요로 여겨져야 한다"류의 직역이 아니다.' },
  },
  {
    id: 'q2-02',
    typeId: 2,
    facet: 't2-being-needed',
    text: '지난 몇 년간 대체로 누가 나를 찾아 부탁해 올 때 반가운 마음이 먼저 들었다.',
    sourceId: 'riso-hudson-wisdom',
    origin: 'authored',
    reverse: false,
    rationale:
      '재는 대상을 "부탁하기의 불편함"에서 "찾아와 준 것에 대한 반가움"으로 옮겼다. 앞의 형태는 부탁을 꺼리는 유형 5의 경계 유지(q5-04·q5-10)와 구분되지 않았지만, 유형 5는 같은 상황에서 소모될 시간·기운을 먼저 떠올려 부인하므로 이 형태는 유형 2의 필요받음 동기만 잰다.',
    authoredBy: 'worker-items-a+worker-merge',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '부탁받는 상황의 정서 반응을 재는 자체 문장으로 기존 척도 표현과 겹치지 않는다.' },
  },
  {
    id: 'q2-03',
    typeId: 2,
    facet: 't2-rejection-fear',
    text: '평소에 연락이 뜸해지면 내가 필요 없어졌나 하는 생각이 먼저 든다.',
    sourceId: 'palmer-1988',
    origin: 'authored',
    reverse: false,
    rationale:
      '불안의 내용이 갈등이나 버려짐 일반이 아니라 "줄 것이 없어 밀려남"이라는 점에서, 마찰로 관계가 끊길까 걱정하는 유형 9가 아니라 유형 2의 거절 불안을 잰다.',
    authoredBy: 'worker-items-a',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '연락 빈도라는 구체 단서에서 출발하는 주의 초점 문장이다.' },
  },
  {
    id: 'q2-04',
    typeId: 2,
    facet: 't2-rejection-fear',
    text: '평소에 해줄 것이 없는 자리에서는 내 몫이 줄어든 느낌이 든다.',
    sourceId: 'riso-hudson-wisdom',
    origin: 'authored',
    reverse: false,
    rationale:
      '자기 가치의 조건을 "베풂의 유무"로 묶으므로, 조건을 성과의 유무로 묶는 유형 3과 달리 유형 2의 핵심 두려움 구조를 잰다.',
    authoredBy: 'worker-items-a',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review-5', note: '"해줄 것이 없는 자리"와 "내 몫이 줄어든 느낌"이라는 자체 비유로 2번의 필요받음 욕구를 간접 표현했다.' },
  },
  {
    id: 'q2-05',
    typeId: 2,
    facet: 't2-need-radar',
    text: '평소에 모임에 들어서면 표정이 어두운 사람이 먼저 눈에 들어온다.',
    sourceId: 'palmer-1988',
    origin: 'authored',
    reverse: false,
    rationale:
      '주의가 개인의 정서 상태로 향한다는 점에서, 여러 사람의 입장이 동시에 보이는 유형 9의 주의 초점이나 누가 결정권을 쥐었는지를 보는 유형 8과 구분되는 유형 2의 필요 탐지를 잰다.',
    authoredBy: 'worker-items-a',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review-5', note: '모임 장면에서 "표정이 어두운 사람"을 초점 대상으로 특정한 주의 초점 문형으로, 일반적 공감 진술과 표현이 다르다.' },
  },
  {
    id: 'q2-06',
    typeId: 2,
    facet: 't2-need-radar',
    text: '평소에 대화할 때는 상대가 말하지 않은 기분에 먼저 눈이 간다.',
    sourceId: 'palmer-1988',
    origin: 'authored',
    reverse: false,
    rationale:
      '말하지 않은 필요를 능동적으로 읽어 내는 초점이므로, 충돌 신호를 살피며 자기 입장을 유보하는 유형 9의 눈치와 달리 유형 2의 필요 레이더를 잰다.',
    authoredBy: 'worker-items-a',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '비언어 정서 읽기를 "말하지 않은 기분"으로 표현해 공감 자기평가형 문항과 문형을 달리했다.' },
  },
  {
    id: 'q2-07',
    typeId: 2,
    facet: 't2-self-sacrifice',
    text: '평소에 내 일정이 빠듯해도 남의 부탁부터 먼저 처리하곤 한다.',
    sourceId: 'naranjo-1994',
    origin: 'authored',
    reverse: false,
    rationale:
      '자기 사정을 뒤로 미루고 먼저 움직이는 능동적 개입이라, 마찰을 피하려 입장을 미루는 유형 9의 유보와 달리 유형 2의 자기희생 행동을 잰다.',
    authoredBy: 'worker-items-a',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review-5', note: '자기 일정과 타인 부탁의 처리 순서라는 행동 선택으로 표현해 "남을 돕는 것을 좋아한다"류 진술을 피했다.' },
  },
  {
    id: 'q2-08',
    typeId: 2,
    facet: 't2-self-sacrifice',
    text: '평소에 여유가 없을 때는 남의 사정보다 내 사정을 먼저 챙긴다.',
    sourceId: 'naranjo-1994',
    origin: 'authored',
    reverse: true,
    rationale:
      '자기희생의 반대 방향을 긍정문으로 쓴 역채점 문항으로, 대신 나서서 싸워 주는 유형 8의 보호와는 다른 축인 "자기 사정과 상대 사정의 선후"라는 유형 2 축을 잰다.',
    authoredBy: 'worker-items-a',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '자기 사정 우선을 반대 방향 긍정문으로 쓴 역채점 문장이다.' },
  },
  {
    id: 'q2-09',
    typeId: 2,
    facet: 't2-unreturned-resentment',
    text: '평소에 내가 챙긴 만큼 돌아오지 않으면 서운함이 오래간다.',
    sourceId: 'riso-hudson-personality-types',
    origin: 'authored',
    reverse: false,
    rationale:
      '서운함의 발생 지점이 "준 것에 대한 회수 실패"라는 점에서, 기준 위반에 대한 분함인 유형 1이나 통제당함에 대한 반발인 유형 8과 구분되는 유형 2의 부하 반응을 잰다.',
    authoredBy: 'worker-items-a',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review-5', note: '"챙긴 만큼 돌아오지 않으면 서운함이 오래간다"는 한국어 정서 관용 표현으로 보답 기대의 좌절을 기술했다.' },
  },
  {
    id: 'q2-10',
    typeId: 2,
    facet: 't2-unreturned-resentment',
    text: '지난 몇 년간 대체로 도움을 준 뒤에는 돌아오는 것을 잊고 지냈다.',
    sourceId: 'chestnut-2013',
    origin: 'authored',
    reverse: true,
    rationale:
      '되돌아오는 것에 대한 기대가 낮은 쪽을 긍정문으로 쓴 역채점 문항으로, 갈등 자체를 덮고 지나가는 유형 9의 무마가 아니라 유형 2의 미회수 서운함 축에서 낮은 값을 가리킨다.',
    authoredBy: 'worker-items-a',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '보답 기대 없음을 긍정문 역채점으로 표현했으며 기존 척도와 무관하다.' },
  },
];
