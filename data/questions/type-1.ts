import type { Question } from '../schema';

/**
 * 유형 1 — 기준을 지키는 사람. 10문항 = 5 facet × 2.
 *
 * 전부 `data/types.ts`의 구성개념 요약만 보고 새로 쓴 한국어 문장이다
 * (`docs/sources.md` §1 원문 격리). 시간 프레임 고정, 상대·빈도 진술,
 * 주의 초점 형식 3문항(q1-03·q1-05·q1-06), 역채점 2문항(q1-02·q1-08)은
 * 부정문이 아니라 반대 방향 긍정 진술이다.
 */
export const type1Questions: Question[] = [
  {
    id: 'q1-01',
    typeId: 1,
    facet: 't1-standards',
    text: '평소에 아무도 안 보는 부분까지 제대로 해두어야 마음이 놓인다.',
    sourceId: 'riso-hudson-wisdom',
    origin: 'authored',
    reverse: false,
    rationale:
      '"아무도 안 보는 부분"이라는 조건이 인정·성과 동기를 배제하므로, 결과가 인정받는지를 기준으로 삼는 유형 3이 아니라 인정과 무관한 내적 기준을 재는 유형 1 문항이다.',
    authoredBy: 'worker-items-a',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '인정과 무관한 내적 기준을 "아무도 안 보는 부분"이라는 자체 조건절로 표현했고, 형용사 나열형 상용 문항과 문형이 겹치지 않는다.' },
  },
  {
    id: 'q1-02',
    typeId: 1,
    facet: 't1-standards',
    text: '평소에 웬만한 일은 대충 넘어가도 괜찮다고 여긴다.',
    sourceId: 'riso-hudson-wisdom',
    origin: 'authored',
    reverse: true,
    rationale:
      '내적 기준의 반대 방향을 긍정문으로 진술한 역채점 문항으로, 성과 부진을 견디는지를 묻는 유형 3 축이 아니라 "제대로 된 상태"의 허용 폭을 묻는 유형 1 축을 잰다.',
    authoredBy: 'worker-items-a',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review-5', note: '역채점 문항으로, 1번의 완벽주의를 "대충 넘어가도 괜찮다고 여긴다"는 한국어 구어 표현의 반대 방향 긍정 진술로 옮긴 자체 문장이다.' },
  },
  {
    id: 'q1-03',
    typeId: 1,
    facet: 't1-flaw-fear',
    text: '평소에 지적을 들으면 허술해 보였겠다는 생각이 먼저 든다.',
    sourceId: 'palmer-1988',
    origin: 'authored',
    reverse: false,
    rationale:
      '두려움의 내용이 "남보다 부족함"이 아니라 "책임을 제대로 못 한 사람으로 드러남"이므로, 결여·비교에서 출발하는 유형 4의 자기비판이 아니라 기준 위반에서 출발하는 유형 1의 자기비판을 잰다.',
    authoredBy: 'worker-items-a',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review-5', note: '지적받는 장면에서 "허술해 보였겠다"는 자기 귀인 내용을 구체화한 주의 초점 문형으로, 비판 민감성을 직접 선언하지 않는다.' },
  },
  {
    id: 'q1-04',
    typeId: 1,
    facet: 't1-flaw-fear',
    text: '평소에 내 몫을 제대로 못 했다는 생각이 들면 오래 마음에 남는다.',
    sourceId: 'riso-hudson-wisdom',
    origin: 'authored',
    reverse: false,
    rationale:
      '이미 벌어진 자기 책임의 미흡함에 걸리는 반응이어서, 앞으로 잘못될 가능성에 대비하려는 유형 6의 불안과 구분되고 유형 1의 결함 노출 두려움에 해당한다.',
    authoredBy: 'worker-items-a',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '"내 몫"이라는 역할 수행 어휘로 유형 4의 결여감과 구분되게 자체 작성했다.' },
  },
  {
    id: 'q1-05',
    typeId: 1,
    facet: 't1-error-attention',
    text: '평소에 문서를 펼치면 틀린 표기나 어긋난 줄이 먼저 눈에 들어온다.',
    sourceId: 'palmer-1988',
    origin: 'authored',
    reverse: false,
    rationale:
      '주의가 향하는 대상이 "지금 이미 어긋나 있는 것"이라는 점에서, 앞으로 생길 위험을 먼저 보는 유형 6의 risk-attention이 아니라 유형 1의 error-attention을 잰다.',
    authoredBy: 'worker-items-a',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review-5', note: '"틀린 표기나 어긋난 줄"이라는 문서 교정 장면의 구체적 사물 묘사로 1번의 주의 초점을 표현한 자체 문장이다.' },
  },
  {
    id: 'q1-06',
    typeId: 1,
    facet: 't1-error-attention',
    text: '평소에 방에 들어서면 정리되지 않은 곳이 먼저 눈에 들어온다.',
    sourceId: 'palmer-1988',
    origin: 'authored',
    reverse: false,
    rationale:
      '현재 상태와 제자리 사이의 어긋남이 먼저 보인다는 진술이므로, 빠른 길·성과 여부를 먼저 보는 유형 3의 효율 초점과 달리 유형 1의 교정 지점 초점을 잰다.',
    authoredBy: 'worker-items-a',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '오류 지각을 방 정리 상태로 예시화했으나 특정 검사의 삽화 문장을 옮기지 않은 독자 표현이다.' },
  },
  {
    id: 'q1-07',
    typeId: 1,
    facet: 't1-correction-voice',
    text: '평소에 남이 일하는 방식이 어긋나 보이면 그냥 넘기지 않고 짚곤 한다.',
    sourceId: 'naranjo-1994',
    origin: 'authored',
    reverse: false,
    rationale:
      '짚는 근거가 결과의 성패가 아니라 방식의 옳고 그름이라는 점에서, 성과를 위해 개입하는 유형 3과 구분되는 유형 1의 교정 발화를 잰다.',
    authoredBy: 'worker-items-a',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review-5', note: '타인의 작업 방식을 "그냥 넘기지 않고 짚곤 한다"는 행동 수준으로 기술해 덕목·악덕 어휘를 배제했다.' },
  },
  {
    id: 'q1-08',
    typeId: 1,
    facet: 't1-correction-voice',
    text: '평소에 남이 나와 다른 방식으로 해도 그 방식대로 두고 본다.',
    sourceId: 'naranjo-1994',
    origin: 'authored',
    reverse: true,
    rationale:
      '교정 발화의 반대 방향을 긍정문으로 진술한 역채점 문항으로, 마찰을 피하려 입장을 유보하는 유형 9와 달리 "기준 위반을 짚느냐"라는 유형 1 축 위에서 낮은 쪽을 가리킨다.',
    authoredBy: 'worker-items-a',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review-5', note: 'q1-07의 반대 방향 긍정 진술이며, "그 방식대로 두고 본다"는 한국어 관용 표현으로 부정문 역문항을 피했다.' },
  },
  {
    id: 'q1-09',
    typeId: 1,
    facet: 't1-restraint-pressure',
    text: '지난 몇 년간 대체로 감정을 드러내면 절제가 부족하다고 여겨 감정을 눌러 왔다.',
    sourceId: 'riso-hudson-personality-types',
    origin: 'authored',
    reverse: false,
    rationale:
      '억제의 근거를 "절제가 부족한 일"이라는 자기 적용 기준으로 문항 텍스트 안에 명시했다. 유형 9의 억제는 분위기·관계가 상할까 봐 일어나고 유형 8의 q8-08은 부딪침 자체를 피하는 축이므로, 응답자가 읽는 문장만으로 유형 1의 자기 규율에 의한 긴장 축적과 갈린다.',
    authoredBy: 'worker-items-a+worker-merge',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '감정 억제를 "절제가 부족한 일이라 여겨"라는 자기 적용 기준으로 풀어 쓴 자체 문장이다.' },
  },
  {
    id: 'q1-10',
    typeId: 1,
    facet: 't1-restraint-pressure',
    text: '평소에 하고 싶은 것을 미뤄 두다 속이 답답해질 때가 자주 있다.',
    sourceId: 'chestnut-2013',
    origin: 'authored',
    reverse: false,
    rationale:
      '해야 할 일을 먼저 두느라 욕구를 미루는 구조여서, 선택지를 넓히려 미루는 유형 7이나 성과를 위해 쉬지 못하는 유형 3과 달리 유형 1의 억제 압력을 잰다.',
    authoredBy: 'worker-items-a',
    copyrightReview: { verdict: 'clear', reviewedBy: 'worker-review', note: '욕구 유예의 답답함을 중립적 신체 감각 어휘로 서술해 악덕 언어를 피했다.' },
  },
];
