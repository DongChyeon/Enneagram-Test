import type { Question } from '../schema';

/**
 * 유형 3 — 성과로 증명하는 사람. 10문항 = 5 facet × 2.
 *
 * 전부 `data/types.ts`의 구성개념 요약만 보고 새로 쓴 한국어 문장이다
 * (`docs/sources.md` §1 원문 격리). 유형 3은 동의하기 쉬운 서술이라
 * 상대·빈도 진술 비중을 가장 높였고, 모든 문항을 결과·가시성에 고정해
 * 유형 1의 "옳음" 축과 분리했다. 주의 초점 형식 3문항(q3-04·q3-05·q3-06),
 * 역채점 2문항(q3-08·q3-10)은 반대 방향 긍정 진술이다.
 */
export const type3Questions: Question[] = [
  {
    id: 'q3-01',
    typeId: 3,
    facet: 't3-achievement-drive',
    text: '평소에 하루를 마칠 때면 무엇을 해냈는지로 그날을 평가해요.',
    sourceId: 'riso-hudson-wisdom',
    origin: 'authored',
    reverse: false,
    rationale:
      '평가 기준이 산출된 결과의 양이라는 점에서, 결과와 무관하게 제대로 했는지를 따지는 유형 1의 기준이 아니라 유형 3의 성과 동기를 잰다.',
    authoredBy: 'worker-items-a',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review-5', note: '하루를 마감하는 시점의 자기평가 기준을 "무엇을 해냈는지"로 명시한 자체 문장으로, 성취 동기를 직접 선언하지 않는다.' },
  },
  {
    id: 'q3-02',
    typeId: 3,
    facet: 't3-achievement-drive',
    text: '지난 몇 년간 대체로 남들이 알아주는 일에 시간을 더 써 왔어요.',
    sourceId: 'riso-hudson-wisdom',
    origin: 'authored',
    reverse: false,
    rationale:
      '시간 배분의 기준을 "인정받는가"에 두므로, 아무도 보지 않아도 제대로 해두려는 유형 1과 정면으로 갈리는 유형 3의 가시성 동기를 잰다.',
    authoredBy: 'worker-items-a',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '가시성 높은 일에 대한 시간 배분을 재는 자체 문장이다.' },
  },
  {
    id: 'q3-03',
    typeId: 3,
    facet: 't3-failure-image-fear',
    text: '평소에 또래보다 뒤처져 보일까 봐 신경이 쓰일 때가 많아요.',
    sourceId: 'riso-hudson-wisdom',
    origin: 'authored',
    reverse: false,
    rationale:
      '불안의 축이 비교 우위와 유능해 보이는지에 있으므로, 자기에게 결여된 고유함을 비교하는 유형 4나 기준 위반을 걱정하는 유형 1과 구분되는 유형 3의 실패 이미지 두려움을 잰다.',
    authoredBy: 'worker-items-a',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review-5', note: '"또래보다 뒤처져 보일까 봐"라는 상대 비교 프레임과 "때가 많다"는 빈도 표현을 써 절대 자기규정을 피했어요.' },
  },
  {
    id: 'q3-04',
    typeId: 3,
    facet: 't3-failure-image-fear',
    text: '평소에 일이 잘 안 풀리면 남들 눈에 어떻게 비칠까 하는 생각이 먼저 들어요.',
    sourceId: 'palmer-1988',
    origin: 'authored',
    reverse: false,
    rationale:
      '실패 국면에서 주의가 외부의 시선으로 먼저 향한다는 점에서, 같은 상황에서 무엇이 잘못됐는지로 향하는 유형 1과 달리 유형 3의 이미지 불안을 잰다.',
    authoredBy: 'worker-items-a',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '실패 상황의 1차 인지를 타인 시선으로 지정한 주의 초점 문장이다.' },
  },
  {
    id: 'q3-05',
    typeId: 3,
    facet: 't3-efficiency-attention',
    text: '평소에 새 일을 맡으면 무엇을 성과로 쳐주는지에 먼저 눈이 가요.',
    sourceId: 'palmer-1988',
    origin: 'authored',
    reverse: false,
    rationale:
      '주의의 대상이 인정 기준이라는 점에서, 같은 상황에서 올바른 절차가 먼저 보이는 유형 1의 주의 초점과 명확히 갈리는 유형 3 문항이다.',
    authoredBy: 'worker-items-a',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review-5', note: '새 업무에서 "무엇을 성과로 쳐주는가"라는 평가 기준 탐색을 초점으로 지정한 독자적 주의 초점 문형이다.' },
  },
  {
    id: 'q3-06',
    typeId: 3,
    facet: 't3-efficiency-attention',
    text: '평소에 방법이 여럿이면 가장 빠른 길이 먼저 눈에 들어와요.',
    sourceId: 'palmer-1988',
    origin: 'authored',
    reverse: false,
    rationale:
      '선택 기준이 속도와 도달이라는 점에서, 어느 쪽이 옳은 방식인지를 먼저 보는 유형 1과 달리 결과 도달에 고정된 유형 3의 효율 초점을 잰다.',
    authoredBy: 'worker-items-a',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '효율 선호를 "가장 빠른 길"이라는 구체 목적어로 지정했어요.' },
  },
  {
    id: 'q3-07',
    typeId: 3,
    facet: 't3-impression-tuning',
    text: '평소에 자리가 달라지면 말투와 보여주는 모습도 그에 맞춰 바꿔요.',
    sourceId: 'naranjo-1994',
    origin: 'authored',
    reverse: false,
    rationale:
      '상대와 자리에 맞춰 자기 표현을 조정한다는 점에서, 어디서나 같은 기준을 적용하려는 유형 1과 달리 유형 3의 인상 조정을 잰다.',
    authoredBy: 'worker-items-a',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review-5', note: '"말투와 보여주는 모습"이라는 관찰 가능한 행동 단위로 상황별 이미지 조정을 기술해 기만 어휘를 배제했어요.' },
  },
  {
    id: 'q3-08',
    typeId: 3,
    facet: 't3-impression-tuning',
    text: '평소에 상대가 누구든 같은 말투와 태도로 대하는 편이에요.',
    sourceId: 'naranjo-1994',
    origin: 'authored',
    reverse: true,
    rationale:
      'q3-07과 같은 행동 차원(말투·태도를 청중에 따라 조정하는가)에서 반대 방향을 긍정문으로 쓴 역채점 문항이다. "자기답게 있는가"라는 유형 4의 진정성 진술이 아니라 "청중이 바뀔 때 자기 표현이 바뀌는가"만 묻도록 고쳐, 유형 3의 인상 조정 축에서 낮은 값만 가리킨다.',
    authoredBy: 'worker-items-a+worker-merge',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review-5', note: 'q3-07의 반대 방향 긍정 진술로, "상대가 누구든 같은 말투와 태도"라는 일관성 표현을 자체 작성했어요.' },
  },
  {
    id: 'q3-09',
    typeId: 3,
    facet: 't3-pause-difficulty',
    text: '평소에 쉬는 동안에도 밀리고 있다는 느낌에 오래 쉬지 못해요.',
    sourceId: 'riso-hudson-personality-types',
    origin: 'authored',
    reverse: false,
    rationale:
      '멈추기 어려운 이유가 진도와 성과의 손실이라는 점에서, 해야 할 일을 다 해두지 않아 불편한 유형 1의 긴장과 구분되는 유형 3의 부하 반응을 잰다.',
    authoredBy: 'worker-items-a',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '휴식 중 진도 손실감을 "밀리고 있다는 느낌"으로 표현한 독자 문장이다.' },
  },
  {
    id: 'q3-10',
    typeId: 3,
    facet: 't3-pause-difficulty',
    text: '평소에 일이 남아 있어도 쉴 때는 마음 편히 쉬는 편이에요.',
    sourceId: 'chestnut-2013',
    origin: 'authored',
    reverse: true,
    rationale:
      '성과 진도와 휴식을 분리할 수 있음을 긍정문으로 쓴 역채점 문항으로, 마찰 없는 평온을 좇는 유형 9의 이완이 아니라 유형 3의 정지 곤란 축에서 낮은 값을 가리킨다.',
    authoredBy: 'worker-items-a',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review-5', note: '미완의 업무와 휴식을 병치한 장면 설정으로 3번의 과잉활동 성향을 역방향에서 포착한 자체 문장이다.' },
  },
];
