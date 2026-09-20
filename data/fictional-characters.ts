import type { TypeId } from './schema';

export type FictionalCharacter = {
  name: string;
  work: string;
  resemblance: string;
};

/**
 * 작품 속 행동을 에니어그램 언어로 읽은 예시다.
 * 제작사나 작가가 밝힌 공식 유형이 아니므로 단정형 문장을 쓰지 않는다.
 */
export const fictionalCharactersByType: Readonly<Record<TypeId, readonly FictionalCharacter[]>> = {
  1: [
    {
      name: '헤르미온느 그레인저',
      work: '해리 포터',
      resemblance: '옳다고 믿는 기준을 지키고, 잘못된 일을 바로잡으려는 책임감이 두드러져요.',
    },
    {
      name: '캡틴 아메리카',
      work: '마블',
      resemblance: '불리한 상황에서도 원칙과 정의를 포기하지 않는 모습이 닮았어요.',
    },
    {
      name: '미네르바 맥고나걸',
      work: '해리 포터',
      resemblance: '엄격한 기준 안에서도 공동체를 보호하고 공정하게 행동하려 해요.',
    },
  ],
  2: [
    {
      name: '샘와이즈 갬지',
      work: '반지의 제왕',
      resemblance: '소중한 사람이 지칠 때 곁을 지키며 필요한 도움을 먼저 건네요.',
    },
    {
      name: '몰리 위즐리',
      work: '해리 포터',
      resemblance: '돌봄과 환대를 통해 사람들에게 안전한 자리를 만들어 줘요.',
    },
    {
      name: '베이맥스',
      work: '빅 히어로',
      resemblance: '상대의 아픔을 알아차리고 회복을 돕는 일을 가장 중요하게 여겨요.',
    },
  ],
  3: [
    {
      name: '토니 스타크',
      work: '마블',
      resemblance: '뛰어난 성과와 능력을 통해 자신의 가치를 증명하려는 추진력이 강해요.',
    },
    {
      name: '티아나',
      work: '공주와 개구리',
      resemblance: '목표를 현실로 만들기 위해 쉬지 않고 계획하고 행동해요.',
    },
    {
      name: '라이트닝 맥퀸',
      work: '카',
      resemblance: '성공과 인정을 향해 빠르게 달리지만 관계의 가치도 배워 가요.',
    },
  ],
  4: [
    {
      name: '엘사',
      work: '겨울왕국',
      resemblance: '남들과 다른 내면을 깊이 의식하며 진짜 자기 모습으로 살고자 해요.',
    },
    {
      name: '조 마치',
      work: '작은 아씨들',
      resemblance: '자기만의 목소리와 삶의 방식을 지키려는 열망이 뚜렷해요.',
    },
    {
      name: '에드워드 시저핸즈',
      work: '가위손',
      resemblance: '타인과 다르다는 감각 속에서 섬세한 감정과 창조성을 드러내요.',
    },
  ],
  5: [
    {
      name: '셜록 홈즈',
      work: '셜록 홈즈',
      resemblance: '거리를 두고 관찰하며 충분한 지식과 분석으로 상황을 이해하려 해요.',
    },
    {
      name: '스팍',
      work: '스타 트렉',
      resemblance: '감정에 휩쓸리기보다 논리와 정확한 정보로 판단하려는 모습이 강해요.',
    },
    {
      name: '브루스 배너',
      work: '마블',
      resemblance: '복잡한 문제를 연구와 사고로 풀며 혼자 집중할 공간을 필요로 해요.',
    },
  ],
  6: [
    {
      name: '론 위즐리',
      work: '해리 포터',
      resemblance: '걱정과 의심을 느끼면서도 믿는 사람을 위해 끝내 자리를 지켜요.',
    },
    {
      name: '샘윌 타리',
      work: '왕좌의 게임',
      resemblance: '두려움 속에서도 준비와 충성심을 바탕으로 필요한 용기를 내요.',
    },
    {
      name: '마지 심슨',
      work: '심슨 가족',
      resemblance: '가족의 안전과 안정을 살피며 위기에서 책임감 있게 버팀목이 돼요.',
    },
  ],
  7: [
    {
      name: '피터 팬',
      work: '피터 팬',
      resemblance: '새로운 모험과 가능성을 좇으며 답답함과 제한에서 벗어나려 해요.',
    },
    {
      name: '지니',
      work: '알라딘',
      resemblance: '빠른 재치와 풍부한 아이디어로 상황을 즐겁게 바꾸는 힘이 있어요.',
    },
    {
      name: '라푼젤',
      work: '라푼젤',
      resemblance: '세상을 직접 경험하고 싶은 호기심과 낙관적인 에너지가 커요.',
    },
  ],
  8: [
    {
      name: '카트니스 에버딘',
      work: '헝거 게임',
      resemblance: '부당한 힘에 맞서며 자신과 소중한 사람을 직접 보호하려 해요.',
    },
    {
      name: '퍼리오사',
      work: '매드 맥스: 분노의 도로',
      resemblance: '강한 결단력으로 억압에 저항하고 약한 사람들을 행동으로 지켜요.',
    },
    {
      name: '프린세스 레아',
      work: '스타워즈',
      resemblance: '위기에서도 주도권을 잡고 권력 앞에서 쉽게 물러서지 않아요.',
    },
  ],
  9: [
    {
      name: '곰돌이 푸',
      work: '곰돌이 푸',
      resemblance: '서두르지 않고 주변 사람들과 편안하고 평화로운 관계를 이어 가요.',
    },
    {
      name: '월-E',
      work: '월-E',
      resemblance: '조용하고 꾸준한 애정으로 단절된 관계를 다시 연결해요.',
    },
    {
      name: '히컵',
      work: '드래곤 길들이기',
      resemblance: '대립하는 편 사이에서 공통점을 찾고 충돌을 화해로 바꾸려 해요.',
    },
  ],
};
