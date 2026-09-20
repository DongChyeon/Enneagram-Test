import type { Question } from '../schema';

/**
 * 유형 7 — 가능성을 좇는 사람. 5 facet × 2문항 = 10문항.
 *
 * 전량 `data/types.ts`의 구성개념 요약만 보고 한국어로 새로 작성했다
 * (`docs/sources.md` §1 원문 격리 원칙). 상용 검사 문항을 참조하지 않았다.
 *
 * 변별 방어: 9번과는 **회피의 방향**(7은 새 자극으로 이동, 9는 움직이지 않고
 * 현상 유지), 8번과는 **추구 대상**(7은 즐거움, 8은 힘)으로 가른다.
 */
export const type7Questions: Question[] = [
  {
    id: 'q7-01',
    typeId: 7,
    text: '평소에 하나로 정하기보다 괜찮은 선택지를 여러 개 남겨 둔다.',
    sourceId: 'riso-hudson-wisdom',
    origin: 'authored',
    facet: 't7-option-keeping',
    reverse: false,
    rationale:
      '선택지를 열어 두는 이유가 힘을 쥐기 위해서가 아니라 더 즐거운 가능성을 놓치지 않기 위해서라는 점에서 8번이 아니라 7번을 잰다.',
    authoredBy: 'worker-items-c',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review-5', note: '"괜찮은 선택지를 여러 개 남겨 둔다"는 행동 기술로 7번의 선택지 확보 성향을 자체 표현했다.' },
  },
  {
    id: 'q7-02',
    typeId: 7,
    text: '평소에 하나를 정하고 나면 나머지 선택지는 미련 없이 접는 편이다.',
    sourceId: 'riso-hudson-wisdom',
    origin: 'authored',
    facet: 't7-option-keeping',
    reverse: true,
    rationale:
      '선택지를 닫고도 아쉬움이 없다는 반대 방향 진술로, 결정을 미루는 9번의 무행동이 아니라 가능성 보존이라는 7번 동기의 낮은 쪽 끝을 잰다.',
    authoredBy: 'worker-items-c',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review-5', note: 'q7-01의 반대 방향 긍정 진술로 "미련 없이 접는"이라는 한국어 관용 표현을 사용했다.' },
  },
  {
    id: 'q7-03',
    typeId: 7,
    text: '지난 몇 년간 대체로 같은 일이 반복되는 자리에 오래 있으면 답답해졌다.',
    sourceId: 'riso-hudson-wisdom',
    origin: 'authored',
    facet: 't7-confinement-fear',
    reverse: false,
    rationale:
      '같은 상태가 이어질 때 9번은 오히려 편안해지는 반면 7번은 갇혔다고 느낀다는 점에서 두 유형을 가른다.',
    authoredBy: 'worker-items-c',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '반복 상황에서의 답답함을 장기 시간 프레임 안에서 서술했다.' },
  },
  {
    id: 'q7-04',
    typeId: 7,
    text: '평소에 새 일을 맡을 때는 얼마나 묶이게 될지에 먼저 눈이 간다.',
    sourceId: 'palmer-1988',
    origin: 'authored',
    facet: 't7-confinement-fear',
    reverse: false,
    rationale:
      '같은 상황에서 8번은 결정권이 누구에게 있는지를 먼저 보는 반면 7번은 자기 자유가 얼마나 줄어드는지를 먼저 본다.',
    authoredBy: 'worker-items-c',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '새 과업에서 구속 정도를 먼저 보는 주의 초점 문장이다.' },
  },
  {
    id: 'q7-05',
    typeId: 7,
    text: '평소에 새 계획을 들으면 재미있어 보이는 대목이 먼저 눈에 들어온다.',
    sourceId: 'palmer-1988',
    origin: 'authored',
    facet: 't7-possibility-attention',
    reverse: false,
    rationale:
      '주의가 즐거움 쪽으로 먼저 간다는 점에서, 같은 자리에서 허술한 지점과 주도권을 먼저 보는 8번과 갈린다.',
    authoredBy: 'worker-items-c',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '계획에서 흥미 지점에 주의가 가는 초점을 자체 표현으로 지정했다.' },
  },
  {
    id: 'q7-06',
    typeId: 7,
    text: '평소에 약속이 취소되면 그 시간에 새로 해볼 일이 먼저 떠오른다.',
    sourceId: 'palmer-1988',
    origin: 'authored',
    facet: 't7-possibility-attention',
    reverse: false,
    rationale:
      '빈 시간이 생겼을 때 9번은 그대로 머무르는 쪽이 먼저 보이는 반면 7번은 새 자극 쪽으로 주의가 이동한다.',
    authoredBy: 'worker-items-c',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review-5', note: '약속 취소라는 상실 장면에서 주의가 "새로 해볼 일"로 이동함을 지정한 자체 주의 초점 문형이다.' },
  },
  {
    id: 'q7-07',
    typeId: 7,
    text: '평소에 분위기가 무거워지면 다른 사람들보다 먼저 화제를 돌리는 편이다.',
    sourceId: 'naranjo-1994',
    origin: 'authored',
    facet: 't7-mood-lifting',
    reverse: false,
    rationale:
      '무거움을 다루는 방식이 화제를 옮겨 가볍게 만드는 능동적 전환이라는 점에서, 조용히 입장을 유보하며 마찰을 피하는 9번과 다르다.',
    authoredBy: 'worker-items-c',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '분위기 전환 행동을 상대 빈도 진술로 기술했다.' },
  },
  {
    id: 'q7-08',
    typeId: 7,
    text: '지난 몇 년간 대체로 일이 어그러져도 그중 괜찮은 면을 먼저 찾아 말해 왔다.',
    sourceId: 'naranjo-1994',
    origin: 'authored',
    facet: 't7-mood-lifting',
    reverse: false,
    rationale:
      '8번은 어그러진 국면을 그대로 정면에서 밀고 나가는 쪽이라면 7번은 같은 국면에서 밝은 대목을 먼저 집어내 무게를 덜어 낸다는 점에서 갈린다. q7-07의 화제 전환과 달리 이야기 주제는 그대로 둔 채 초점만 옮기는 행동이라, 같은 facet 안에서 두 문항이 서로 다른 정보를 준다.',
    authoredBy: 'worker-items-c',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review-5', note: '"지난 몇 년간 대체로"라는 장기 시간 프레임과 "괜찮은 면을 먼저 찾아 말해 왔다"는 발화 행동으로 재구성 방어를 기술했다.' },
  },
  {
    id: 'q7-09',
    typeId: 7,
    text: '평소에 일을 마무리할 때보다 시작할 때 집중이 더 잘 된다.',
    sourceId: 'chestnut-2013',
    origin: 'authored',
    facet: 't7-follow-through',
    reverse: false,
    rationale:
      '9번의 지연이 움직이지 않아 생기는 것과 달리 7번의 미완은 다음 자극 쪽으로 에너지가 옮겨 가 생긴다는 점을 잰다.',
    authoredBy: 'worker-items-c',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review-5', note: '시작 단계와 마무리 단계의 집중도를 대비한 자체 비교 프레임으로 7번의 지속성 문제를 중립 기술했다.' },
  },
  {
    id: 'q7-10',
    typeId: 7,
    text: '평소에 새 아이디어가 떠올라도 벌여 둔 일을 끝까지 마친 뒤에 새 일로 옮겨 간다.',
    sourceId: 'chestnut-2013',
    origin: 'authored',
    facet: 't7-follow-through',
    reverse: true,
    rationale:
      '새 자극이 와도 이동하지 않는다는 반대 방향 진술로, 이동의 방향으로 9번과 구분되는 7번 부하 반응의 낮은 쪽 끝을 잰다.',
    authoredBy: 'worker-items-c',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review-5', note: 'q7-09와 같은 구성개념의 반대 방향 진술로 "벌여 둔 일을 끝까지 마친 뒤에 옮긴다"를 자체 작성했다.' },
  },
];
