import type { Question } from '../schema';

/**
 * 유형 5 문항 10개 = 5 facet × 2.
 *
 * 전부 `data/types.ts`의 구성개념 요약만 보고 새로 쓴 한국어 문장이다
 * (`docs/sources.md` §1 원문 격리).
 *
 * **5–9 철수 충돌 방어**: 5번의 물러남은 자원·정보를 지키려는 보존이고
 * 9번의 물러남은 마찰을 피하려는 안정 유지다. 따라서 모든 문항이 앎·준비·
 * 시간·기운·경계 중 하나를 명시적으로 지목하며, 어느 문항도 조화나 갈등
 * 회피를 측정 대상으로 삼지 않는다.
 */
export const type5Questions: Question[] = [
  {
    id: 'q5-01',
    typeId: 5,
    text: '평소에 무슨 일이든 충분히 알아본 뒤에야 움직이기 시작한다.',
    sourceId: 'riso-hudson-wisdom',
    origin: 'authored',
    facet: 't5-competence-reserve',
    reverse: false,
    rationale:
      '지체의 이유가 마찰 회피가 아니라 준비된 상태 확보이므로 9번이 아니라 5번의 동기를 잰다.',
    authoredBy: 'worker-items-b',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '선행 탐색 후 착수라는 행동 순서를 기술했고 지적 호기심 형용사형과 다르다.' },
  },
  {
    id: 'q5-02',
    typeId: 5,
    text: '평소에 잘 모르는 일이라도 일단 뛰어들어 부딪히며 익히는 편이다.',
    sourceId: 'riso-hudson-wisdom',
    origin: 'authored',
    facet: 't5-competence-reserve',
    reverse: true,
    rationale:
      '준비 후 행동 동기의 반대 방향 긍정 진술로, 평온 유지가 아니라 앎의 충분함을 재므로 9번이 아니라 5번을 잰다.',
    authoredBy: 'worker-items-b',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '즉시 착수를 긍정문 역채점으로 썼다.' },
  },
  {
    id: 'q5-03',
    typeId: 5,
    text: '평소에 약속이 연달아 잡히면 남은 기운이 모자랄까 먼저 걱정된다.',
    sourceId: 'riso-hudson-wisdom',
    origin: 'authored',
    facet: 't5-depletion-fear',
    reverse: false,
    rationale:
      '걱정의 대상이 관계의 불편함이 아니라 소모될 자원이므로 9번이 아니라 5번의 두려움을 잰다.',
    authoredBy: 'worker-items-b',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '연속 약속에 대한 기운 고갈 예상을 자체 표현으로 서술했다.' },
  },
  {
    id: 'q5-04',
    typeId: 5,
    text: '평소에 가진 것이 바닥나 남에게 기대야 하는 상황을 가장 피하고 싶다.',
    sourceId: 'riso-hudson-wisdom',
    origin: 'authored',
    facet: 't5-depletion-fear',
    reverse: false,
    rationale:
      '피하려는 것이 갈등으로 자리를 잃는 일이 아니라 자원 고갈로 무력해지는 일이므로 9번이 아니라 5번을 잰다.',
    authoredBy: 'worker-items-b',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '의존 회피라는 핵심 두려움을 "가진 것이 바닥나"라는 자원 은유로 새로 썼다.' },
  },
  {
    id: 'q5-05',
    typeId: 5,
    text: '평소에 새 모임에서는 어떤 규칙으로 모임이 돌아가는지에 먼저 눈이 간다.',
    sourceId: 'palmer-1988',
    origin: 'authored',
    facet: 't5-observation-attention',
    reverse: false,
    rationale:
      '먼저 보이는 것이 사람들 사이의 분위기가 아니라 작동 구조이므로 9번이 아니라 5번의 주의 초점을 잰다.',
    authoredBy: 'worker-items-b',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '새 집단에서 규칙 구조에 주의가 가는 초점을 자체 표현으로 지정했다.' },
  },
  {
    id: 'q5-06',
    typeId: 5,
    text: '평소에 일을 맡으면 전체가 움직이는 원리가 먼저 눈에 들어온다.',
    sourceId: 'palmer-1988',
    origin: 'authored',
    facet: 't5-observation-attention',
    reverse: false,
    rationale:
      '먼저 보이는 것이 누구에게 맞춰야 하는가가 아니라 구조의 원리이므로 9번이 아니라 5번을 잰다.',
    authoredBy: 'worker-items-b',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '과업의 작동 원리를 먼저 보는 주의 초점 문장이다.' },
  },
  {
    id: 'q5-07',
    typeId: 5,
    text: '평소에 내 일정과 사생활을 어디까지 알릴지 스스로 정해 두는 편이다.',
    sourceId: 'chestnut-2013',
    origin: 'authored',
    facet: 't5-boundary-keeping',
    reverse: false,
    rationale:
      '상대에게 맞추는 조정이 아니라 정보·사생활 경계를 스스로 정하는 행동이므로 9번이 아니라 5번을 잰다.',
    authoredBy: 'worker-items-b',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '사생활 공개 범위의 자기 결정을 경계 설정 행동으로 기술해 "나는 사적인 사람이다"류의 번역을 피했다.' },
  },
  {
    id: 'q5-08',
    typeId: 5,
    text: '평소에 부탁을 받으면 범위를 따지지 않고 그때그때 받아들이곤 한다.',
    sourceId: 'chestnut-2013',
    origin: 'authored',
    facet: 't5-boundary-keeping',
    reverse: true,
    rationale:
      '관여 범위 자기 결정의 반대 방향 긍정 진술로, 조화 유지가 아니라 경계 관리를 재므로 9번이 아니라 5번을 잰다.',
    authoredBy: 'worker-items-b',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '범위 설정 없는 수용을 긍정문 역채점으로 썼다.' },
  },
  {
    id: 'q5-09',
    typeId: 5,
    text: '평소에 요구가 몰린 날이면 혼자 있는 시간을 만들어 기운을 되찾는다.',
    sourceId: 'naranjo-1994',
    origin: 'authored',
    facet: 't5-withdrawal',
    reverse: false,
    rationale:
      '혼자가 되는 목적이 마찰 회피가 아니라 소모된 자원의 회복이므로 9번이 아니라 5번의 부하 반응을 잰다.',
    authoredBy: 'worker-items-b',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '재충전 행동을 혼자 있는 시간 확보로 구체화했다.' },
  },
  {
    id: 'q5-10',
    typeId: 5,
    text: '평소에 연락이 몰리면 답하는 데 들 시간과 기운이 먼저 떠오른다.',
    sourceId: 'palmer-1988',
    origin: 'authored',
    facet: 't5-withdrawal',
    reverse: false,
    rationale:
      '먼저 보이는 것이 관계가 껄끄러워질 가능성이 아니라 소모될 자원이므로 9번이 아니라 5번을 잰다.',
    authoredBy: 'worker-items-b',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '연락 처리 비용을 시간·기운으로 지정한 주의 초점 문장이다.' },
  },
];
