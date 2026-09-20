import type { Source } from './schema';

/**
 * 이론 출처 7건.
 *
 * **id 집합은 `docs/sources.md` §2의 `##` 표제와 정확히 일치한다.**
 * AC-3의 표제 대조 테스트가 양방향으로 단언하므로, 출처를 추가하려면
 * 문서에 정준 라벨 5종(명칭 / 저자·기관 / 라이선스 / 접근 URL 또는 서지정보 /
 * 사용 방식)을 갖춘 `##` 섹션을 **먼저** 만들어야 한다.
 *
 * 어느 출처도 문항 텍스트의 공급원이 아니다 — 전부 저작권 보호 대상이
 * 아닌 이론 구성개념만 참조했다(`docs/sources.md` §1,
 * *Arica Institute, Inc. v. Palmer*, 970 F.2d 1067 (2d Cir. 1992)).
 */
export const sources: Source[] = [
  {
    id: 'riso-hudson-personality-types',
    name: 'Personality Types: Using the Enneagram for Self-Discovery (Revised ed.)',
    author: 'Don Richard Riso & Russ Hudson / Houghton Mifflin, 1996',
    license:
      '상용 출판물, All rights reserved. 문장을 복제하지 않으며 저작권 보호 대상이 아닌 이론적 구성개념만 참조한다.',
    citation: 'ISBN 978-0-395-79867-6',
    usage:
      '9유형의 핵심 동기·핵심 두려움 구조와 발달 수준(Levels of Development) 개념을 참조했다. 문항과 유형 서술은 평균 수준(Levels 4–6)에 맞춰 작성한다 — 불건강 수준을 문항화하면 대부분이 부정 응답해 변별력이 사라진다.',
  },
  {
    id: 'riso-hudson-wisdom',
    name: 'The Wisdom of the Enneagram',
    author: 'Don Richard Riso & Russ Hudson / Bantam, 1999',
    license: '상용 출판물, All rights reserved. 구성개념만 참조.',
    citation: 'ISBN 978-0-553-37820-4',
    usage:
      'core fear / core desire 정식화를 참조해 data/types.ts의 핵심 동기·핵심 두려움 서술 골격을 구성했다. 이 책 부록의 약식 검사 문항은 참조 금지 대상이며 열람하지 않았다.',
  },
  {
    id: 'palmer-1988',
    name: 'The Enneagram: Understanding Yourself and the Others in Your Life',
    author: 'Helen Palmer / HarperOne, 1988',
    license: '상용 출판물, All rights reserved. 구성개념만 참조.',
    citation: 'ISBN 978-0-06-250683-8',
    usage:
      '주의 초점(focus of attention) 개념을 참조했다. 동기 진술 문항은 사회적 바람직성에 취약한 반면 주의 초점 문항은 훨씬 덜 취약하므로, 유형당 최소 3문항을 이 형식으로 작성한다.',
  },
  {
    id: 'naranjo-1994',
    name: 'Character and Neurosis: An Integrative View',
    author: 'Claudio Naranjo / Gateways·IDHHB, 1994',
    license: '상용 출판물, All rights reserved. 구성개념만 참조.',
    citation: 'ISBN 978-0-89556-066-9',
    usage:
      '유형별 방어기제와 열정/고착 쌍을 심리학 용어로 옮기는 데 참조했다. 기술이 병리 편향적이므로 열정 용어를 그대로 문항화하지 않고 덕목·악덕 언어가 아닌 중립적 행동 기술로 번역한다.',
  },
  {
    id: 'chestnut-2013',
    name: 'The Complete Enneagram: 27 Paths to Greater Self-Knowledge',
    author: 'Beatrice Chestnut / She Writes Press, 2013',
    license: '상용 출판물, All rights reserved. 구성개념만 참조.',
    citation: 'ISBN 978-1-938314-54-8',
    usage:
      '같은 유형 안에서도 하위유형에 따라 행동 표현이 달라진다는 관찰을 facet 설계에 참조했다. 유형당 10문항을 5 facet에 분산해 특정 하위유형만 포착하는 편향을 줄인다. 본능 변형 자체는 Non-Goal이며 설계 참조용이다.',
  },
  {
    id: 'hook-2021',
    name: 'The Enneagram: A systematic review of the literature and directions for future research',
    author:
      'Hook, J. N., Hall, T. W., Davis, D. E., Van Tongeren, D. R., & Conner, M. / Journal of Clinical Psychology, 77(4), 865–883, 2021',
    license: '출판사 저작물(Wiley). 연구 결론을 사실로서 인용할 뿐 본문을 복제하지 않는다.',
    url: 'https://onlinelibrary.wiley.com/doi/abs/10.1002/jclp.23097',
    citation: 'DOI 10.1002/jclp.23097',
    usage:
      '면책 고지의 1차 근거이자 윙 `이론적 해석` 라벨링의 근거. 104개 독립 표본 문헌고찰은 ① 요인분석이 일관되게 9개보다 적은 요인을 산출하고 ② 윙과 통합/분열 화살표의 실증 근거가 거의 없다고 결론지었다.',
  },
  {
    id: 'newgent-2004',
    name: 'The Riso-Hudson Enneagram Type Indicator: Estimates of reliability and validity',
    author:
      'Newgent, R. A., Parr, P. E., Newman, I., & Higgins, K. K. / Measurement and Evaluation in Counseling and Development, 36(4), 226–237, 2004',
    license: '출판사 저작물(Taylor & Francis). 연구 결론만 인용.',
    citation: 'DOI 10.1080/07481756.2004.11909744 — ERIC EJ699124',
    usage:
      '기대된 9요인 구조가 재현되지 않았다는 결과. 결과 화면을 "당신의 유형은 X"가 아니라 "가장 높게 나온 유형은 X"로 표현하는 설계 근거이며, 1·2위 점수차가 작을 때 "유형이 뚜렷하지 않음" 안내를 띄우는 근거다.',
  },
];

/** 참조 무결성 검사용 id 집합. */
export const sourceIds: ReadonlySet<string> = new Set(sources.map((s) => s.id));
