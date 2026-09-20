import type { Question } from '../schema';

/**
 * 유형 9 — 균형을 맞추는 사람. 5 facet × 2문항 = 10문항.
 *
 * 전량 `data/types.ts`의 구성개념 요약만 보고 새로 작성했다
 * (`docs/sources.md` §1 원문 격리 원칙).
 *
 * 9번은 사회적 바람직성에서 불리한 유형이므로 덕목·악덕 언어를 쓰지 않고
 * 전부 중립적 행동 기술로 썼다 — 특히 `t9-priority-blur`는 `docs/sources.md` §5가
 * 명시적으로 지목한 사례라 "게으르다" 류 자기 라벨 대신 시간 사용 행동으로만 기술했다.
 *
 * 변별 방어(3중 충돌): 2번(능동적 개입 vs 입장 유보),
 * 5번(자원 보존형 철수 vs 마찰 회피형 동조),
 * 7번(회피의 방향 — 위로 이동 vs 가라앉음). 각 문항 rationale이 셋 중 어느 쪽을
 * 방어하는지 명시한다.
 */
export const type9Questions: Question[] = [
  {
    id: 'q9-01',
    typeId: 9,
    text: '평소에 무엇을 할지 고를 때 마음이 덜 소란해지는 쪽을 택한다.',
    sourceId: 'riso-hudson-wisdom',
    origin: 'authored',
    facet: 't9-inner-calm',
    reverse: false,
    rationale:
      '5번과의 변별 — 5번이 소모될 자원을 아끼려 조용한 쪽을 택하는 것과 달리 9번은 내적 평온이 흔들리지 않는 쪽을 택한다.',
    authoredBy: 'worker-items-c',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '선택 기준을 "마음이 덜 소란해지는 쪽"으로 표현해 순응 형용사형과 문형을 달리했다.' },
  },
  {
    id: 'q9-02',
    typeId: 9,
    text: '평소에 잔잔한 쪽보다 변화가 큰 쪽을 먼저 고르는 편이다.',
    sourceId: 'riso-hudson-wisdom',
    origin: 'authored',
    facet: 't9-inner-calm',
    reverse: true,
    rationale:
      '7번과의 변별 — 새 자극 쪽으로 올라가는 7번식 이동을 반대 방향 긍정 진술로 두어, 가라앉는 쪽으로 안정을 찾는 9번 동기의 낮은 쪽 끝을 잰다.',
    authoredBy: 'worker-items-c',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '변화 선호를 긍정문 역채점으로 썼다.' },
  },
  {
    id: 'q9-03',
    typeId: 9,
    text: '지난 몇 년간 대체로 가까운 사람과 부딪치면 사이가 멀어질까 봐 걱정했다.',
    sourceId: 'riso-hudson-wisdom',
    origin: 'authored',
    facet: 't9-conflict-fear',
    reverse: false,
    rationale:
      '2번과의 변별 — 2번은 사랑받지 못할까 봐 먼저 다가가 필요를 채우는 반면 9번은 마찰 자체가 연결을 끊을까 봐 부딪침을 피한다.',
    authoredBy: 'worker-items-c',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '갈등 후 관계 단절 우려를 장기 시간 프레임 안에서 서술했다.' },
  },
  {
    id: 'q9-04',
    typeId: 9,
    text: '평소에 대화가 오갈 때는 분위기가 틀어질 낌새가 먼저 눈에 들어온다.',
    sourceId: 'palmer-1988',
    origin: 'authored',
    facet: 't9-conflict-fear',
    reverse: false,
    rationale:
      '5번과의 변별 — 5번은 같은 자리에서 빠져나갈 통로가 먼저 보이는 반면 9번은 마찰이 생길 지점이 먼저 보인다.',
    authoredBy: 'worker-items-c',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '대화 중 분위기 악화 징후에 주의가 가는 초점을 자체 표현으로 지정했다.' },
  },
  {
    id: 'q9-05',
    typeId: 9,
    text: '평소에 다툼을 들으면 양쪽 말이 각각 맞는 지점이 먼저 눈에 들어온다.',
    sourceId: 'palmer-1988',
    origin: 'authored',
    facet: 't9-others-view-attention',
    reverse: false,
    rationale:
      '2번과의 변별 — 2번은 누가 더 마음이 상했는지를 먼저 보고 개입하는 반면 9번은 여러 입장이 동시에 보여 자기 입장이 뒤로 밀린다.',
    authoredBy: 'worker-items-c',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '양측 타당성을 동시에 보는 초점을 구체 목적어로 썼다.' },
  },
  {
    id: 'q9-06',
    typeId: 9,
    text: '평소에 뭘 하고 싶냐는 말을 들으면 상대가 원하는 쪽이 먼저 떠오른다.',
    sourceId: 'palmer-1988',
    origin: 'authored',
    facet: 't9-others-view-attention',
    reverse: false,
    rationale:
      '7번과의 변별 — 7번은 같은 질문에서 해볼 만한 재미있는 것이 먼저 떠오르는 반면 9번은 상대 쪽 선호가 먼저 떠오르고 자기 선호는 뒤로 밀린다.',
    authoredBy: 'worker-items-c',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '선호를 묻는 질문에서 상대 쪽이 먼저 떠오르는 초점을 서술했다.' },
  },
  {
    id: 'q9-07',
    typeId: 9,
    text: '평소에 생각이 달라도 굳이 말하지 않고 상대 쪽에 맞추는 일이 잦다.',
    sourceId: 'chestnut-2013',
    origin: 'authored',
    facet: 't9-accommodation',
    reverse: false,
    rationale:
      '2번과의 변별 — 2번의 맞춤은 상대의 필요를 채우려는 능동적 개입인 반면 9번의 맞춤은 마찰을 피하려 자기 입장을 유보하는 것이다.',
    authoredBy: 'worker-items-c',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '입장 유보를 비행동으로 기술해 유형 2의 능동 개입과 구분했다.' },
  },
  {
    id: 'q9-08',
    typeId: 9,
    text: '평소에 의견이 갈리면 내 쪽을 분명히 말하는 편이다.',
    sourceId: 'chestnut-2013',
    origin: 'authored',
    facet: 't9-accommodation',
    reverse: true,
    rationale:
      '5번과의 변별 — 입장을 분명히 밝힌다는 반대 방향 긍정 진술로, 자원을 지키려 말을 아끼는 5번이 아니라 마찰 회피로 입장을 유보하는 9번 관계 행동의 낮은 쪽 끝을 잰다.',
    authoredBy: 'worker-items-c',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '입장 표명을 긍정문 역채점으로 썼다.' },
  },
  {
    id: 'q9-09',
    typeId: 9,
    text: '평소에 해야 할 일을 알면서도 손에 익은 덜 중요한 일로 시간을 보내는 편이다.',
    sourceId: 'naranjo-1994',
    origin: 'authored',
    facet: 't9-priority-blur',
    reverse: false,
    rationale:
      '7번과의 변별 — 이동의 목적지를 "손에 익은" 것으로 못 박았다. 7번의 미완은 새 자극 쪽으로 옮겨 가며 생기므로(q7-09) 익숙한 쪽으로 흘러간다는 진술에는 동의하지 않는다. 또 "~때가 있다"를 "~하는 편이다"로 바꿔 거의 모든 응답자가 동의하게 되는 묵종 편향도 함께 낮췄다.',
    authoredBy: 'worker-items-c+worker-merge',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '나태를 덕목·악덕 언어 없이 "손에 익은 덜 중요한 일"이라는 중립 행동 기술로 옮긴 문장이다.' },
  },
  {
    id: 'q9-10',
    typeId: 9,
    text: '지난 몇 년간 대체로 중요한 결정일수록 뒤로 미뤄 두는 편이었다.',
    sourceId: 'riso-hudson-personality-types',
    origin: 'authored',
    facet: 't9-priority-blur',
    reverse: false,
    rationale:
      '5번과의 변별 — 5번의 보류는 정보가 충분해질 때까지 자원을 아끼는 것인 반면 9번의 보류는 결정이 불러올 마찰을 미루는 것이다.',
    authoredBy: 'worker-items-c',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '중요 결정의 유예를 장기 시간 프레임 안에서 서술했다.' },
  },
];
