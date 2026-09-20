import type { EnneagramType, FacetDef, TypeId } from './schema';

/**
 * 9유형 서술.
 *
 * **유형 명칭은 본 프로젝트가 자체적으로 정한 한국어 명칭이다.**
 * `docs/sources.md` §6에 따라 특정 출판물의 명칭 체계를 옮기지 않는다.
 *
 * 서술은 riso-hudson-wisdom / riso-hudson-personality-types의 core fear·core
 * desire **구성개념**과 palmer-1988의 주의 초점 개념에 근거해 한국어로 새로
 * 작성했다. 어떤 문장도 번역이나 의역이 아니다(`docs/sources.md` §1).
 *
 * 서술 수준은 **평균 발달 수준**이다 — 보통 사람이 자기 일상에서 알아볼 수
 * 있는 표현으로 쓰고, 병리적 극단은 쓰지 않는다. 문항 작성자는 책이 아니라
 * 이 파일을 보고 문항을 쓴다.
 */
export const types: EnneagramType[] = [
  {
    id: 1,
    nameKo: '기준을 지키는 사람',
    nameEn: 'Standard Keeper',
    summary:
      '무엇이 옳고 제대로 된 상태인지에 대한 내적 기준이 뚜렷하고, 그 기준에 자기 자신을 먼저 맞춘다. 대충 넘어가는 것을 불편해하며 고칠 수 있는 것은 고쳐 두려 한다.',
    coreMotivation:
      '옳은 방식으로 살고, 자기 몫을 제대로 해내고, 주변의 어긋난 것을 바로잡아 떳떳해지고 싶다.',
    coreFear:
      '자신이 결함이 있거나 무책임한 사람이라는 것이 드러나는 것. 기준을 놓으면 자기가 흐트러질 것 같은 감각.',
    strengths: [
      '맡은 일을 끝까지 정확하게 마무리한다',
      '원칙과 약속을 지켜 주변이 그를 믿고 맡길 수 있다',
      '무엇이 잘못됐는지 빠르게 알아보고 개선안을 낸다',
      '자기에게 먼저 엄격해 말과 행동이 어긋나지 않는다',
    ],
    growthPoints: [
      '"충분히 괜찮다"의 선을 스스로 정해 보고 그 선에서 멈춰 보기',
      '판단을 내리기 전에 상대의 사정을 한 번 더 듣기',
      '억눌러 둔 불만을 쌓아두지 말고 그때그때 말로 꺼내기',
      '실수한 자신에게도 다른 사람에게 하듯 여지를 주기',
    ],
  },
  {
    id: 2,
    nameKo: '마음을 살피는 사람',
    nameEn: 'Attuned Giver',
    summary:
      '주변 사람의 기분과 필요를 빠르게 알아채고 먼저 움직인다. 관계 안에서 도움이 되는 존재일 때 자기 자리를 확인한다.',
    coreMotivation:
      '가까운 사람에게 필요한 존재가 되고, 그 관계 안에서 사랑받고 있다는 것을 확인하고 싶다.',
    coreFear:
      '자기가 아무에게도 필요하지 않아 관계 밖으로 밀려나는 것. 줄 것이 없으면 그대로는 환영받지 못할 것 같은 감각.',
    strengths: [
      '상대가 말하지 않은 필요까지 알아챈다',
      '먼저 다가가 관계의 물꼬를 튼다',
      '따뜻하고 구체적인 방식으로 사람을 돕는다',
      '집단 안에서 소외된 사람을 잘 챙긴다',
    ],
    growthPoints: [
      '도움을 주기 전에 상대가 정말 원하는지 물어보기',
      '자기 필요를 부탁의 형태로 직접 말하기',
      '거절해도 관계가 끊기지 않는다는 것을 작은 일에서 실험해 보기',
      '서운함이 쌓이기 전에 말로 표현하기',
    ],
  },
  {
    id: 3,
    nameKo: '성과로 증명하는 사람',
    nameEn: 'Result Prover',
    summary:
      '목표를 세우고 결과를 만들어 내는 데 에너지가 집중된다. 상황에서 무엇이 성과로 인정받는지를 빠르게 읽고 거기에 자기를 맞춘다.',
    coreMotivation:
      '눈에 보이는 성과를 내고 유능한 사람으로 인정받아 자기 가치를 확인하고 싶다.',
    coreFear:
      '실패하거나 뒤처져 별 볼 일 없는 사람으로 보이는 것. 성과를 빼면 남는 것이 없을 것 같은 감각.',
    strengths: [
      '목표를 현실적인 단계로 쪼개 실제로 굴러가게 만든다',
      '에너지가 높고 회복이 빨라 중간에 멈추지 않는다',
      '상황에 필요한 역할을 빠르게 파악해 적응한다',
      '팀에 추진력과 방향 감각을 준다',
    ],
    growthPoints: [
      '성과와 무관한 시간을 일정에 먼저 넣어 두기',
      '잘 보이려는 조정을 멈추고 실제로 느끼는 것을 말해 보기',
      '진행 중인 실패를 감추지 말고 일찍 공유하기',
      '"무엇을 이뤘나"와 별개로 "무엇을 원하나"를 확인하기',
    ],
  },
  {
    id: 4,
    nameKo: '고유함을 찾는 사람',
    nameEn: 'Depth Seeker',
    summary:
      '자기 감정의 결과 자기만의 고유함에 민감하고, 표면적인 것으로는 만족하지 못한다. 남과 자기를 비교하며 무엇이 다른지를 자주 의식한다.',
    coreMotivation:
      '자기다운 것을 잃지 않고, 자기 감정과 경험에 솔직하게 살면서 있는 그대로 이해받고 싶다.',
    coreFear:
      '다른 사람에게는 있는 무언가가 자기에게는 빠져 있어서, 결국 평범하게 묻히거나 끝내 이해받지 못하는 것.',
    strengths: [
      '자기 감정과 남의 감정의 미묘한 결을 알아본다',
      '남들이 피하는 무겁고 어려운 이야기를 함께 있어 준다',
      '표현·취향·관점에 자기만의 색이 있다',
      '겉치레를 걷어낸 진짜 대화를 만든다',
    ],
    growthPoints: [
      '비교가 시작될 때 알아차리고 지금 하던 일로 돌아오기',
      '기분이 정리되기를 기다리지 말고 일단 시작해 보기',
      '가진 것과 이미 된 것을 구체적으로 적어 보기',
      '평범한 일상의 반복에서 오는 안정감을 인정하기',
    ],
  },
  {
    id: 5,
    nameKo: '혼자 탐색하는 사람',
    nameEn: 'Quiet Observer',
    summary:
      '한발 떨어져 관찰하고 이해한 뒤에 움직인다. 시간·에너지·사적인 공간을 소모하는 요구에 민감하고, 혼자 있는 시간으로 충전한다.',
    coreMotivation:
      '충분히 알고 준비된 상태에서, 자기 힘으로 감당할 수 있는 만큼만 관여하며 살고 싶다.',
    coreFear:
      '가진 것이 바닥나 요구에 휩쓸리고, 결국 무능하고 무력한 상태로 남겨지는 것.',
    strengths: [
      '감정에 휩쓸리지 않고 상황을 침착하게 본다',
      '관심 있는 주제를 깊이 파고들어 남다른 이해에 이른다',
      '군더더기 없이 필요한 만큼만 말하고 쓴다',
      '자기 힘으로 문제를 해결하는 독립성이 있다',
    ],
    growthPoints: [
      '준비가 덜 됐다고 느껴도 일단 자리에 참여해 보기',
      '생각한 것을 머릿속에만 두지 말고 밖으로 꺼내 보기',
      '요청을 거절하는 대신 범위를 정해 수락해 보기',
      '몸과 감정에서 지금 일어나는 일에 주의를 돌리기',
    ],
  },
  {
    id: 6,
    nameKo: '위험을 미리 살피는 사람',
    nameEn: 'Risk Scanner',
    summary:
      '잘못될 수 있는 지점이 먼저 보이고, 그것에 대비해 두어야 마음이 놓인다. 믿을 만한 사람과 기반을 확보하는 데 에너지를 쓴다.',
    coreMotivation:
      '기댈 수 있는 기반과 신뢰할 수 있는 관계를 확보해, 무슨 일이 생겨도 감당할 수 있는 상태가 되고 싶다.',
    coreFear:
      '의지할 데 없이 혼자 남아 감당 못 할 상황을 맞는 것. 믿었던 것이 실은 안전하지 않았던 것으로 드러나는 것.',
    strengths: [
      '남들이 못 본 위험과 허점을 미리 짚어낸다',
      '한번 믿은 사람과 약속에 오래 성실하다',
      '최악의 경우까지 계산해 현실적인 대비책을 만든다',
      '집단 안에서 책임을 회피하지 않는다',
    ],
    growthPoints: [
      '확인을 몇 번까지 할지 미리 정해 두고 거기서 멈추기',
      '최악의 시나리오 옆에 "그럴 확률"도 같이 적어 보기',
      '결정한 뒤에는 되짚기를 멈추고 실행에 시간을 쓰기',
      '자기 판단만으로 내린 결정을 작은 일부터 늘려 보기',
    ],
  },
  {
    id: 7,
    nameKo: '가능성을 좇는 사람',
    nameEn: 'Possibility Chaser',
    summary:
      '재미있어 보이는 것과 해볼 만한 것이 먼저 눈에 들어온다. 선택지를 넓게 열어 두고, 분위기가 무거워지면 가볍게 만드는 쪽으로 움직인다.',
    coreMotivation:
      '좋은 경험과 가능성을 놓치지 않고, 답답함에 갇히지 않은 채 자유롭게 움직이고 싶다.',
    coreFear:
      '지루하고 답답한 상태에 갇혀, 하고 싶은 것도 기대할 것도 없이 결핍된 채로 있는 것.',
    strengths: [
      '막힌 상황에서 새로운 선택지를 잘 떠올린다',
      '회복이 빠르고 주변 분위기를 밝게 만든다',
      '여러 분야를 빠르게 배우고 연결한다',
      '시작하는 일을 두려워하지 않는다',
    ],
    growthPoints: [
      '벌여 둔 일 하나를 끝까지 마무리하고 다음으로 넘어가기',
      '불편한 감정이 올라올 때 화제를 바꾸지 말고 머물러 보기',
      '선택지를 줄이는 것이 손해가 아님을 경험해 보기',
      '남의 이야기를 끝까지 듣고 나서 말하기',
    ],
  },
  {
    id: 8,
    nameKo: '주도권을 잡는 사람',
    nameEn: 'Initiative Taker',
    summary:
      '상황을 남에게 맡겨두기보다 자기가 쥐고 가려 한다. 할 말을 직접 하고, 자기 사람이라고 여기는 쪽을 앞에서 막아선다.',
    coreMotivation:
      '자기 삶과 상황의 결정권을 스스로 쥐고, 자기 사람을 지킬 수 있는 힘을 갖고 싶다.',
    coreFear:
      '남에게 휘둘리거나 약점을 잡혀 통제당하는 것. 힘을 놓으면 당하는 쪽이 될 것 같은 감각.',
    strengths: [
      '아무도 나서지 않을 때 먼저 결정하고 책임진다',
      '불편한 말을 돌리지 않고 분명하게 전한다',
      '부당한 일에 눈감지 않고 약한 쪽을 막아선다',
      '에너지가 크고 압박 속에서도 흔들리지 않는다',
    ],
    growthPoints: [
      '결정하기 전에 다른 사람의 의견을 먼저 끝까지 듣기',
      '자기 말의 세기가 상대에게 어떻게 닿는지 확인하기',
      '약한 모습을 드러내도 괜찮은 관계를 한둘 만들기',
      '모든 일을 직접 쥐는 대신 맡기고 기다려 보기',
    ],
  },
  {
    id: 9,
    nameKo: '균형을 맞추는 사람',
    nameEn: 'Balance Keeper',
    summary:
      '여러 사람의 입장이 동시에 보이고, 마찰이 생기는 쪽으로는 잘 가지 않는다. 편안한 상태가 유지되는 것이 중요해 자기 주장은 뒤로 미루기 쉽다.',
    coreMotivation:
      '주변과 자기 안이 모두 평온한 상태를 유지하고, 관계가 흔들리지 않게 지키고 싶다.',
    coreFear:
      '갈등으로 관계가 끊어지고 자기 자리가 사라지는 것. 자기 의견을 내세우면 균형이 깨질 것 같은 감각.',
    strengths: [
      '서로 다른 입장을 동시에 이해하고 중재한다',
      '함께 있는 사람을 편안하게 만든다',
      '급한 상황에서도 쉽게 흥분하지 않는다',
      '판단을 앞세우지 않고 있는 그대로 들어준다',
    ],
    growthPoints: [
      '중요한 일을 하루의 맨 앞에 배치하기',
      '동의하지 않을 때 그 자리에서 짧게라도 말하기',
      '"아무거나 괜찮다" 대신 자기 선호를 하나 고르기',
      '미뤄둔 일 하나를 정해 오늘 시작하기',
    ],
  },
];

/** 유형 번호로 조회. */
export const typeById = new Map<TypeId, EnneagramType>(
  types.map((t) => [t.id, t]),
);

/**
 * facet 정의 45개 (9유형 × 5).
 *
 * 유형당 10문항 = 5 facet × 2문항이므로, 한 유형 안에서 각 facet은 정확히
 * 2회 등장한다. `kind`는 다섯 축(동기 / 두려움 / 주의 초점 / 관계 / 부하)을
 * 고정해 특정 하위유형 표현만 포착하는 편향을 줄인다(chestnut-2013).
 *
 * `attention` 축은 palmer-1988의 주의 초점 형식이며, 사회적 바람직성에 가장
 * 덜 취약하다. 규칙 5-b의 "유형당 최소 3문항을 주의 초점 형식으로"는 이
 * 축 2문항 + 다른 축 1문항 이상으로 충족한다.
 */
export const facets: FacetDef[] = [
  // 유형 1
  { id: 't1-standards', typeId: 1, kind: 'motivation', description: '제대로 해두려는 내적 기준과 자기 규율 — 결과의 인정 여부와 무관하게 작동한다.' },
  { id: 't1-flaw-fear', typeId: 1, kind: 'fear', description: '자기가 허술하거나 무책임한 사람으로 드러날 것에 대한 불안.' },
  { id: 't1-error-attention', typeId: 1, kind: 'attention', description: '지금 어긋나 있는 것·고쳐야 할 것이 먼저 눈에 들어오는 주의 초점.' },
  { id: 't1-correction-voice', typeId: 1, kind: 'interpersonal', description: '상대의 방식이 기준에 어긋날 때 참지 않고 짚어 말하는 경향.' },
  { id: 't1-restraint-pressure', typeId: 1, kind: 'stress', description: '불만과 충동을 눌러 두다 긴장이 쌓이는 방식.' },

  // 유형 2
  { id: 't2-being-needed', typeId: 2, kind: 'motivation', description: '가까운 사람에게 필요한 존재가 되려는 동기.' },
  { id: 't2-rejection-fear', typeId: 2, kind: 'fear', description: '줄 것이 없으면 관계 밖으로 밀려날 것 같은 불안.' },
  { id: 't2-need-radar', typeId: 2, kind: 'attention', description: '상대의 기분과 아직 말하지 않은 필요가 먼저 눈에 들어오는 주의 초점.' },
  { id: 't2-self-sacrifice', typeId: 2, kind: 'interpersonal', description: '자기 사정보다 상대의 사정을 앞세워 먼저 움직이는 행동.' },
  { id: 't2-unreturned-resentment', typeId: 2, kind: 'stress', description: '준 만큼 돌아오지 않는다고 느낄 때 서운함이 쌓이는 방식.' },

  // 유형 3
  { id: 't3-achievement-drive', typeId: 3, kind: 'motivation', description: '눈에 보이는 성과로 자기 가치를 확인하려는 동기.' },
  { id: 't3-failure-image-fear', typeId: 3, kind: 'fear', description: '뒤처지거나 무능한 사람으로 보이는 것에 대한 불안.' },
  { id: 't3-efficiency-attention', typeId: 3, kind: 'attention', description: '무엇이 성과로 쳐주는지, 어느 길이 빠른지가 먼저 눈에 들어오는 주의 초점.' },
  { id: 't3-impression-tuning', typeId: 3, kind: 'interpersonal', description: '상대와 자리에 맞춰 자기 모습과 말투를 조정하는 행동.' },
  { id: 't3-pause-difficulty', typeId: 3, kind: 'stress', description: '쉬면 밀린다는 느낌에 멈추기 어려워지는 방식.' },

  // 유형 4
  { id: 't4-authenticity', typeId: 4, kind: 'motivation', description: '자기만의 고유함과 진짜 감정에 충실하려는 동기.' },
  { id: 't4-lack-fear', typeId: 4, kind: 'fear', description: '남에게는 있는 무언가가 자기에게는 빠져 있다는 결여감.' },
  { id: 't4-comparison-attention', typeId: 4, kind: 'attention', description: '남과 자기의 차이, 특히 자기에게 없는 것이 먼저 눈에 들어오는 주의 초점.' },
  { id: 't4-depth-expectation', typeId: 4, kind: 'interpersonal', description: '피상적 교류를 견디기 어려워하고 깊이 이해받기를 기대하는 관계 방식.' },
  { id: 't4-mood-swing', typeId: 4, kind: 'stress', description: '감정의 진폭이 커지고 자기 안으로 물러나는 방식.' },

  // 유형 5
  { id: 't5-competence-reserve', typeId: 5, kind: 'motivation', description: '충분히 알고 준비된 상태에서 움직이려는 동기.' },
  { id: 't5-depletion-fear', typeId: 5, kind: 'fear', description: '시간·에너지가 바닥나 요구에 휩쓸릴 것에 대한 불안.' },
  { id: 't5-observation-attention', typeId: 5, kind: 'attention', description: '참여하기 전에 구조와 원리를 먼저 관찰·분석하게 되는 주의 초점.' },
  { id: 't5-boundary-keeping', typeId: 5, kind: 'interpersonal', description: '시간·정보·사생활의 경계를 지키며 관여 범위를 스스로 정하는 행동.' },
  { id: 't5-withdrawal', typeId: 5, kind: 'stress', description: '요구가 몰릴 때 혼자 있는 시간으로 물러나 충전하는 방식.' },

  // 유형 6
  { id: 't6-security-seeking', typeId: 6, kind: 'motivation', description: '기댈 만한 기반과 확실함을 확보하려는 동기.' },
  { id: 't6-unsupported-fear', typeId: 6, kind: 'fear', description: '의지할 데 없이 혼자 감당하게 될 것에 대한 불안.' },
  { id: 't6-risk-attention', typeId: 6, kind: 'attention', description: '앞으로 잘못될 수 있는 지점이 먼저 눈에 들어오는 주의 초점.' },
  { id: 't6-trust-testing', typeId: 6, kind: 'interpersonal', description: '상대의 의도와 신뢰성을 확인한 뒤에 마음을 여는 관계 방식.' },
  { id: 't6-doubt-loop', typeId: 6, kind: 'stress', description: '정한 뒤에도 되짚으며 확신과 의심을 오가는 방식.' },

  // 유형 7
  { id: 't7-option-keeping', typeId: 7, kind: 'motivation', description: '좋은 가능성과 선택지를 넓게 열어 두려는 동기.' },
  { id: 't7-confinement-fear', typeId: 7, kind: 'fear', description: '지루하고 답답한 상태에 갇히는 것, 기대할 것이 없어지는 것에 대한 불안.' },
  { id: 't7-possibility-attention', typeId: 7, kind: 'attention', description: '다음에 해볼 만한 것·재미있어 보이는 것이 먼저 눈에 들어오는 주의 초점.' },
  { id: 't7-mood-lifting', typeId: 7, kind: 'interpersonal', description: '무거워진 분위기를 농담이나 화제 전환으로 가볍게 돌리는 행동.' },
  { id: 't7-follow-through', typeId: 7, kind: 'stress', description: '마무리 국면에서 집중이 흩어지고 새 자극으로 옮겨가는 방식.' },

  // 유형 8
  { id: 't8-self-agency', typeId: 8, kind: 'motivation', description: '자기 삶과 상황의 결정권을 스스로 쥐려는 동기.' },
  { id: 't8-vulnerability-fear', typeId: 8, kind: 'fear', description: '휘둘리거나 약점을 잡혀 통제당하는 것에 대한 경계.' },
  { id: 't8-power-attention', typeId: 8, kind: 'attention', description: '누가 실제로 결정권을 쥐었는지, 어디가 허술한지가 먼저 눈에 들어오는 주의 초점.' },
  { id: 't8-direct-confrontation', typeId: 8, kind: 'interpersonal', description: '할 말을 돌리지 않고 하며 갈등을 피하지 않는 행동.' },
  { id: 't8-intensity-overrun', typeId: 8, kind: 'stress', description: '밀어붙이는 세기가 과해져 주변이 부담을 느끼게 되는 방식.' },

  // 유형 9
  { id: 't9-inner-calm', typeId: 9, kind: 'motivation', description: '마찰 없는 안정과 내적 평온을 유지하려는 동기.' },
  { id: 't9-conflict-fear', typeId: 9, kind: 'fear', description: '갈등으로 관계가 끊기고 자기 자리가 사라지는 것에 대한 불안.' },
  { id: 't9-others-view-attention', typeId: 9, kind: 'attention', description: '여러 사람의 입장이 동시에 보이고 자기 입장은 뒤로 밀리는 주의 초점.' },
  { id: 't9-accommodation', typeId: 9, kind: 'interpersonal', description: '이견을 덜 드러내고 상대 쪽에 맞춰 주는 행동.' },
  { id: 't9-priority-blur', typeId: 9, kind: 'stress', description: '중요한 일을 미루고 덜 중요한 일로 시간을 보내는 방식.' },
];

/** 유형 번호 → 그 유형의 facet 5개. */
export const facetsByType = new Map<TypeId, FacetDef[]>(
  types.map((t) => [t.id, facets.filter((f) => f.typeId === t.id)]),
);
