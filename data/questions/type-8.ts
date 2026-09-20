import type { Question } from '../schema';

/**
 * 유형 8 — 주도권을 잡는 사람. 5 facet × 2문항 = 10문항.
 *
 * 전량 `data/types.ts`의 구성개념 요약만 보고 새로 작성했다
 * (`docs/sources.md` §1 원문 격리 원칙).
 *
 * 8번 서술은 사회적으로 승인받기 쉬워("강하다", "솔직하다") 묵종 편향이 크므로,
 * 자기 라벨 대신 **상대·빈도 진술**("다른 사람들보다 ~한 편이다")과 구체 행동 기술로만 썼다.
 *
 * 변별 방어: 2번과는 **보호의 방식**(8은 힘으로 대신 막아섬, 2는 정서적 필요 충족),
 * 1번과는 **통제의 대상**(8은 자기 영역, 1은 기준)으로 가른다.
 */
export const type8Questions: Question[] = [
  {
    id: 'q8-01',
    typeId: 8,
    text: '평소에 내 일에 관한 결정은 다른 사람들보다 직접 내리려는 편이다.',
    sourceId: 'riso-hudson-wisdom',
    origin: 'authored',
    facet: 't8-self-agency',
    reverse: false,
    rationale:
      '통제의 대상이 옳은 기준이 아니라 자기 영역의 결정권이라는 점에서 1번이 아니라 8번을 잰다.',
    authoredBy: 'worker-items-c',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '결정권 보유를 상대 빈도 진술로 기술해 "나는 주도하는 사람이다"류의 직역을 피했다.' },
  },
  {
    id: 'q8-02',
    typeId: 8,
    text: '평소에 일의 방향은 남이 정해 주는 대로 따라가는 쪽이 편하다.',
    sourceId: 'riso-hudson-wisdom',
    origin: 'authored',
    facet: 't8-self-agency',
    reverse: true,
    rationale:
      '결정권을 남에게 넘겨도 편안하다는 반대 방향 진술로, 옳은 기준을 지키려는 1번의 순응이 아니라 자기 결정권 자체의 낮은 쪽 끝을 잰다.',
    authoredBy: 'worker-items-c',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review-5', note: '8번의 자기결정 욕구를 "남이 정해 주는 대로 따라가는 쪽이 편하다"는 반대 방향 긍정 진술로 옮겼다.' },
  },
  {
    id: 'q8-03',
    typeId: 8,
    text: '평소에 약점을 내보이면 그만큼 상대에게 끌려다니게 된다고 여긴다.',
    sourceId: 'riso-hudson-wisdom',
    origin: 'authored',
    facet: 't8-vulnerability-fear',
    reverse: false,
    rationale:
      '약점을 통제의 지렛대로 본다는 점에서 8번의 통제 경계 축이다. 이전 판("상대가 그걸 어떻게 쓸지 따져 본다")은 상대를 믿어도 되는가를 물어 6번의 신뢰 검증 축이었고, q6-07과 같은 행동을 재고 있었다. 6번은 지지 부재를 두려워하지 주도권 상실을 두려워하지 않는다.',
    authoredBy: 'worker-items-c+worker-merge',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review-6', note: '약점 노출을 상대에게 통제당하는 지렛대로 규정하는 인과 구도(약점을 내보이면 끌려다니게 된다)로 표현한 독자적 문장이며, 상용 검사의 의도-검증형 신뢰 문항이나 상투적 표현을 차용하지 않았다.' },
  },
  {
    id: 'q8-04',
    typeId: 8,
    text: '평소에 부탁을 받으면 내가 휘둘릴 여지가 있는지에 먼저 눈이 간다.',
    sourceId: 'palmer-1988',
    origin: 'authored',
    facet: 't8-vulnerability-fear',
    reverse: false,
    rationale:
      '같은 부탁에서 2번은 상대의 필요가 먼저 보이는 반면 8번은 자기 통제권이 줄어들 지점이 먼저 보인다.',
    authoredBy: 'worker-items-c',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '부탁 상황에서 통제 상실 여지를 먼저 보는 주의 초점 문장이다.' },
  },
  {
    id: 'q8-05',
    typeId: 8,
    text: '평소에 낯선 자리에서는 누가 결정권을 쥐었는지에 먼저 눈이 간다.',
    sourceId: 'palmer-1988',
    origin: 'authored',
    facet: 't8-power-attention',
    reverse: false,
    rationale:
      '같은 자리에서 2번은 누가 마음이 불편한지를 먼저 보는 반면 8번은 힘이 어디에 있는지를 먼저 본다.',
    authoredBy: 'worker-items-c',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '낯선 자리에서 결정권 소재를 보는 초점을 자체 표현으로 지정했다.' },
  },
  {
    id: 'q8-06',
    typeId: 8,
    text: '평소에 의견이 맞서면 상대가 물러설 지점이 먼저 눈에 들어온다.',
    sourceId: 'palmer-1988',
    origin: 'authored',
    facet: 't8-power-attention',
    reverse: false,
    rationale:
      'facet 정의의 두 축 중 q8-05가 다루지 않는 "어디가 허술한지"를 맡되, 결함 탐지가 아니라 밀고 들어갈 지렛대로 프레이밍했다. 6번은 같은 국면에서 위험을, 1번은 누가 틀렸는지를 보지만 8번은 어디를 누르면 상대가 물러서는지를 본다. 폐기한 세 판은 각각 결함 탐지(q6-05와 동축), 사후 책임 귀속(1번 영역), q8-05의 바꿔 쓰기였다.',
    authoredBy: 'worker-items-c+worker-merge',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review-4', note: 'Palmer의 주의초점 형식을 계승하되, 의견 대립 시 상대의 양보 지점을 포착한다는 8번 고유의 권력·우위 축으로 새로 구성한 문장이며 q8-05의 결정권자 파악 축과는 트리거와 대상이 모두 달라 파생물이 아니다.' },
  },
  {
    id: 'q8-07',
    typeId: 8,
    text: '평소에 불만이 생기면 다른 사람들보다 그 자리에서 바로 말하는 편이다.',
    sourceId: 'naranjo-1994',
    origin: 'authored',
    facet: 't8-direct-confrontation',
    reverse: false,
    rationale:
      '2번은 관계가 상할까 봐 말을 삼키는 반면 8번은 갈등을 감수하고 그 자리에서 꺼낸다는 점에서 갈린다.',
    authoredBy: 'worker-items-c',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '불만의 즉시 표명을 상대 빈도 진술로 기술했다.' },
  },
  {
    id: 'q8-08',
    typeId: 8,
    text: '평소에 의견이 갈리면 부딪치기 전에 한발 물러서는 편이다.',
    sourceId: 'naranjo-1994',
    origin: 'authored',
    facet: 't8-direct-confrontation',
    reverse: true,
    rationale:
      '갈등 앞에서 물러선다는 반대 방향 진술로, 기준을 내세워 정정하는 1번의 개입이 아니라 정면 대면이라는 8번 관계 행동의 낮은 쪽 끝을 잰다.',
    authoredBy: 'worker-items-c',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review-5', note: '의견 충돌 장면에서 "한발 물러서는"이라는 한국어 관용 표현을 쓴 반대 방향 긍정 진술이다.' },
  },
  {
    id: 'q8-09',
    typeId: 8,
    text: '지난 몇 년간 대체로 세게 밀어붙인다는 말을 들은 적이 있다.',
    sourceId: 'chestnut-2013',
    origin: 'authored',
    facet: 't8-intensity-overrun',
    reverse: false,
    rationale:
      '부담을 주는 지점이 돌봄의 과잉인 2번과 달리 힘의 과잉이라는 점에서 8번의 부하 반응을 잰다.',
    authoredBy: 'worker-items-c',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '강도에 대한 타인 피드백을 보고 형식으로 서술해 악덕 라벨을 피했다.' },
  },
  {
    id: 'q8-10',
    typeId: 8,
    text: '평소에 일이 더디게 가면 다른 사람들보다 목소리가 먼저 커지는 편이다.',
    sourceId: 'riso-hudson-personality-types',
    origin: 'authored',
    facet: 't8-intensity-overrun',
    reverse: false,
    rationale:
      '1번은 같은 상황에서 불만을 눌러 두는 쪽인 반면 8번은 세기를 올려 상황을 다시 쥔다는 점에서 갈린다.',
    authoredBy: 'worker-items-c',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '지연 상황의 반응을 "목소리가 먼저 커지는"이라는 관찰 가능 행동으로 기술했다.' },
  },
];
