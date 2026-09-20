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
    text: '평소에 하나로 정하기보다 괜찮은 선택지를 여러 개 남겨 두는 편이다.',
    sourceId: 'riso-hudson-wisdom',
    origin: 'authored',
    facet: 't7-option-keeping',
    reverse: false,
    rationale:
      '선택지를 열어 두는 이유가 힘을 쥐기 위해서가 아니라 더 즐거운 가능성을 놓치지 않기 위해서라는 점에서 8번이 아니라 7번을 잰다.',
    authoredBy: 'worker-items-c',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '선택지 보존 행동을 기술했고 낙천성 형용사형 상용 7번 문항과 다르다.' },
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
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '선택지 정리를 긍정문 역채점으로 썼다.' },
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
    text: '평소에 새 일을 맡을 때 먼저 눈에 들어오는 것은 얼마나 묶이게 될지다.',
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
    text: '평소에 새 계획을 들을 때 먼저 눈에 들어오는 것은 재미있어 보이는 대목이다.',
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
    text: '평소에 약속이 취소되면 먼저 눈에 들어오는 것은 그 시간에 새로 해볼 일이다.',
    sourceId: 'palmer-1988',
    origin: 'authored',
    facet: 't7-possibility-attention',
    reverse: false,
    rationale:
      '빈 시간이 생겼을 때 9번은 그대로 머무르는 쪽이 먼저 보이는 반면 7번은 새 자극 쪽으로 주의가 이동한다.',
    authoredBy: 'worker-items-c',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '일정 취소를 기회로 재해석하는 주의 초점을 구체 장면으로 썼다.' },
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
    text: '지난 몇 년간 대체로 심각한 이야기가 길어지면 화제를 가벼운 쪽으로 돌리곤 했다.',
    sourceId: 'naranjo-1994',
    origin: 'authored',
    facet: 't7-mood-lifting',
    reverse: false,
    rationale:
      '8번은 심각한 이야기를 그대로 밀고 나가는 쪽이라면 7번은 화제 자체를 옮겨 무게를 덜어 낸다는 점에서 갈린다.',
    authoredBy: 'worker-items-c',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '같은 전환 행동을 장기 시간 프레임으로 서술한 자체 문장이다.' },
  },
  {
    id: 'q7-09',
    typeId: 7,
    text: '평소에 일의 마무리 단계보다 시작 단계에서 집중이 더 잘 되는 편이다.',
    sourceId: 'chestnut-2013',
    origin: 'authored',
    facet: 't7-follow-through',
    reverse: false,
    rationale:
      '9번의 지연이 움직이지 않아 생기는 것과 달리 7번의 미완은 다음 자극 쪽으로 에너지가 옮겨 가 생긴다는 점을 잰다.',
    authoredBy: 'worker-items-c',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '집중이 잘 되는 단계를 시작과 마무리로 대비시킨 독자 표현이다.' },
  },
  {
    id: 'q7-10',
    typeId: 7,
    text: '평소에 벌여 둔 일은 새 아이디어가 떠올라도 끝까지 마친 뒤에 옮기는 편이다.',
    sourceId: 'chestnut-2013',
    origin: 'authored',
    facet: 't7-follow-through',
    reverse: true,
    rationale:
      '새 자극이 와도 이동하지 않는다는 반대 방향 진술로, 이동의 방향으로 9번과 구분되는 7번 부하 반응의 낮은 쪽 끝을 잰다.',
    authoredBy: 'worker-items-c',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '완수 후 이동을 긍정문 역채점으로 썼다.' },
  },
];
