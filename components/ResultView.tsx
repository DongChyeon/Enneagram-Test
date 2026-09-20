/**
 * 결과 화면의 **순수 프레젠테이션 컴포넌트** (AC-8 ①–⑥).
 *
 * props-in이고, async가 아니며, 데이터 조회를 하지 않는다. 이유는 설계가 아니라
 * 검증 가능성이다 — `app/result/[code]/page.tsx`는 async 서버 컴포넌트라
 * `@testing-library/react`로 그대로 마운트할 수 없다. AC-8의 **렌더 측면**을
 * 닫으려면 테스트가 붙잡을 수 있는 동기·순수 컴포넌트가 하나 필요하고,
 * 그것이 이 파일이다(`components/__tests__/result.test.tsx`).
 *
 * 표현은 "당신의 유형은 X입니다"가 아니라 **"가장 높게 나온 유형은 X입니다"** 다.
 * 요인분석이 아홉 개의 독립된 차원을 일관되게 확인하지 못했다는 면책 고지와
 * 짝을 이루는 서술이다(Hook et al., 2021).
 *
 * ## 색
 * 이 화면은 세 체계가 한 면에서 만나는 유일한 곳이라 역할을 갈라 둔다.
 *   - 파랑(`primary`)은 **누를 수 있는 것**에만. 이 페이지에서는 공유 구역뿐이다.
 *   - 아홉 유형의 고유색은 **도트 캐릭터 한 곳**에만. 화면에서 유일하게 채도가
 *     있는 요소이므로 주변에 다른 색을 더하지 않는다.
 *   - 그 밖의 전부 — 윙 블록, 모호성 안내, 점수 막대, 면책 고지 — 는 흰 바탕
 *     위의 회색 면(`bg-sub`)과 여백으로만 구분한다. 읽을 것에 색을 칠하면
 *     읽는 사람이 누를 곳을 잘못 찾는다.
 */

import { typeById } from '../data/types';
import { wingByLabel } from '../data/wings';
import { fictionalCharactersByType } from '../data/fictional-characters';
import type { Result } from '../lib/types';
import { ScoreBars } from './ScoreBars';
import { ShareActions } from './ShareActions';
import { ResultNextStep } from './ResultNextStep';
import { TypeMark } from './TypeMarkView';

/**
 * 윙 블록에 **시각적으로 결합되는** 이론적 해석 마커(확정 문구).
 * 페이지 하단 각주로 분리하면 AC-8 ③을 만족하지 못한다 — 윙이 측정된 발견으로
 * 읽히지 않게 하는 것이 목적이므로 마커는 윙과 같은 덩어리 안에 있어야 한다.
 */
export const WING_INTERPRETATION_MARKER = '윙은 이론적 해석이며 검증된 측정 결과가 아닙니다.';

/** 면책 고지 확정 문구. 랜딩·결과·카드 3면이 같은 내용을 쓴다(카드는 마지막 줄만). */
export const DISCLAIMER_PARAGRAPHS: readonly string[] = [
  '이 검사는 에니어그램 이론에 근거해 자체 제작한 90문항 자기보고 도구입니다. 상용 에니어그램 검사의 문항을 사용하지 않았으며, 표준화·타당화 절차를 거치지 않았습니다.',
  '결과는 진단이 아니라, 아홉 가지 동기 패턴에 대해 당신이 스스로를 어떻게 보고했는지를 정리한 것입니다. 점수가 비슷한 유형이 여럿일 수 있고, 시기와 상황에 따라 결과가 달라질 수 있습니다.',
  '에니어그램은 학술적 검증 근거가 제한적이며, 요인분석 연구들은 아홉 개의 독립된 차원을 일관되게 확인하지 못했습니다 (Hook et al., 2021).',
  '채용·인사 평가·진로 결정·정신건강 판단의 근거로 사용하지 마십시오.',
];

/** 면책 고지의 마지막 한 줄. 카드(`ShareCardArt`)가 싣는 것과 같은 문자열이다. */
export const DISCLAIMER_LAST_LINE = '교육·자기이해 목적이며 임상적 진단이 아닙니다.';

/**
 * 45문항 결과의 **신뢰도 한계 고지** 확정 문구.
 *
 * 이 블록은 면책 고지를 대체하지 않는다 — 면책 고지는 그대로 아래에 있고, 이것이
 * 하나 더 얹힌다. 표준화·타당화를 거치지 않았다는 한계는 45와 90에 **똑같이**
 * 해당하므로 그 말은 여기 옮겨 적지 않는다. 여기 적는 것은 45문항에만 해당하는
 * 것, 곧 **척도당 문항 수가 절반이라는 사실과 그 결과**뿐이다.
 *
 * .54는 Spearman-Brown 예언 공식으로 환산한 값이다 — 10문항 척도의 내적 일관성을
 * .70으로 잡아도 문항을 5/10으로 줄이면
 * `(0.5 × .70) / (1 + (0.5 − 1) × .70) ≈ .54`가 된다. 통상 쓰는 최소선 .70에는
 * 미치지 못한다. 숫자를 적는 이유는 "조금 덜 정확하다"가 얼마나 덜인지를 읽는
 * 사람이 스스로 판단할 수 있게 하기 위해서다.
 *
 * 말투는 **깎아내리지 않는다.** 45문항은 잠정치가 아니라 이 검사의 한 경로이고,
 * 90문항은 같은 것을 두 번 물어 흔들림을 줄이는 다른 경로다.
 */
export const BASE_LIMIT_HEADING = '45문항으로 나온 결과입니다';

export const BASE_LIMIT_PARAGRAPHS: readonly string[] = [
  '아홉 유형의 다섯 개념을 한 번씩, 유형당 5문항으로 물었습니다. 유형 점수는 5~25점 범위이고, 문항 하나가 그 점수의 5분의 1을 쥐고 있습니다.',
  '그래서 1위와 2위가 가깝게 나왔다면 문항 한두 개로 순서가 뒤집힐 수 있습니다. 5문항 척도의 내적 일관성은 전체 90문항을 .70으로 놓고 Spearman-Brown 공식으로 환산하면 약 .54로, 통상 쓰는 최소 기준 .70에는 미치지 못합니다.',
  '나머지 45문항은 같은 개념을 다른 문장으로 한 번 더 묻습니다. 한 문항을 잘못 읽었거나 그날 기분에 끌려 답했더라도 짝이 되는 문항이 상쇄하므로, 다 답하면 결과가 지금과 달라질 수 있습니다.',
];

/** 이어하기 버튼 문구. `/test?continue`는 이미 답한 45문항을 다시 묻지 않는다. */
export const CONTINUE_CTA = '45문항 더 답하고 정확도 높이기';

export type ResultViewProps = {
  result: Result;
  /** 공유 링크·카드 URL의 코드. */
  code: string;
};

/** 유형 상세 네 항목. 문단 하나짜리와 목록짜리를 한 자리에서 정의한다. */
type DetailBlock = { title: string; body: string | readonly string[] };

export function ResultView({ result, code }: ResultViewProps) {
  const base = result.kind === 'base';
  const type = typeById.get(result.primaryType);
  const wing = wingByLabel.get(result.wing);

  if (type === undefined || wing === undefined) {
    // 디코드가 통과한 코드라면 도달할 수 없다 — 도달하면 데이터 누락 버그다.
    throw new Error(`유형·윙 데이터 누락: ${result.primaryType} / ${result.wing}`);
  }

  const details: DetailBlock[] = [
    { title: '핵심 동기', body: type.coreMotivation },
    { title: '핵심 두려움', body: type.coreFear },
    { title: '강점', body: type.strengths },
    { title: '성장 포인트', body: type.growthPoints },
  ];

  return (
    <main className="mx-auto w-full max-w-[38rem] px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
      {/* ① 주유형 이름 + 윙 라벨 */}
      <header className="animate-rise-in">
        {/* 도트 캐릭터는 유형명 **옆**에 둔다. 화면에서 유일하게 채도가 있는 요소이므로
            주변에 다른 색을 더하지 않는다.
            `aria-hidden`은 `TypeMark`가 갖고 있다(유형명이 바로 옆에 텍스트로 있다). */}
        <div className="flex items-center gap-5">
          <TypeMark typeId={result.primaryType} dot={6} />
          <div className="min-w-0">
            <p className="text-[0.875rem] font-medium text-ink-faint">
              {base ? '45문항에서 가장 높게 나온 유형' : '90문항에서 가장 높게 나온 유형'}
            </p>
            <h1 className="mt-1.5 text-[1.625rem] font-bold leading-[1.35] tracking-[-0.03em] text-ink sm:text-[2rem]">
              {result.primaryType}유형 · {type.nameKo}
            </h1>
            <p className="tnum mt-2 text-[1.0625rem] font-bold tracking-[-0.01em] text-ink-soft">
              {result.wing}
            </p>
          </div>
        </div>
        <p className="mt-6 text-[1.0625rem] leading-[1.65] text-ink-soft">{type.summary}</p>
      </header>

      {/* ⑤ 모호성 안내 — isAmbiguous(1위−2위 < 3)일 때만.
          경고가 아니라 **읽을 것**이므로 노랑도 파랑도 쓰지 않는다. 회색 면 위에
          잉크 한 점만 찍어 눈이 먼저 걸리게 한다. */}
      {base ? (
        <aside
          aria-labelledby="base-limit-heading"
          className="animate-rise-in mt-8 rounded-card bg-sub p-5 sm:p-7"
        >
          <h2 id="base-limit-heading" className="text-[1.0625rem] font-bold leading-[1.5] text-ink">
            {BASE_LIMIT_HEADING}
          </h2>
          <div className="mt-3 space-y-3 text-[0.9375rem] leading-[1.7] text-ink-soft">
            {BASE_LIMIT_PARAGRAPHS.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </aside>
      ) : null}

      {result.ambiguous ? (
        <aside role="note" className="animate-rise-in mt-8 flex gap-3.5 rounded-card bg-sub p-5">
          <span
            aria-hidden="true"
            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-[0.75rem] font-bold text-white"
          >
            !
          </span>
          <div className="min-w-0">
            <p className="text-[1rem] font-bold leading-[1.5] text-ink">유형이 뚜렷하지 않음</p>
            <p className="mt-1.5 text-[0.9375rem] leading-[1.7] text-ink-soft">
              1위와 2위의 점수차가 3점 미만입니다. 한 유형으로 좁히기보다 상위 두세 유형의 설명을
              함께 읽어 보세요.
            </p>
          </div>
        </aside>
      ) : null}

      {/* ② 핵심 동기 / 핵심 두려움 / 강점 / 성장 포인트 */}
      <section aria-labelledby="detail-heading" className="mt-14">
        <h2 id="detail-heading" className="text-[1.25rem] font-bold text-ink">
          유형 상세
        </h2>

        <div className="mt-6 space-y-7">
          {details.map((block) => (
            <div key={block.title}>
              <h3 className="text-[1rem] font-bold leading-[1.5] tracking-[-0.01em] text-ink">
                {block.title}
              </h3>
              {typeof block.body === 'string' ? (
                <p className="mt-1.5 text-[0.9375rem] leading-[1.7] text-ink-soft">{block.body}</p>
              ) : (
                <ul className="mt-2.5 space-y-2">
                  {block.body.map((item) => (
                    <li
                      key={item}
                      className="relative pl-4 text-[0.9375rem] leading-[1.7] text-ink-soft before:absolute before:left-0 before:top-[0.72em] before:h-1 before:w-1 before:rounded-full before:bg-ink-faint"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ③ 윙 설명 + 이론적 해석 마커 (같은 블록 안).
          마커를 페이지 각주로 내리지 않는 것이 이 블록의 존재 이유다 — 윙과
          마커가 같은 회색 면 안에 있어야 "이건 해석"이라는 말이 윙에 붙는다. */}
      <section aria-labelledby="wing-heading" className="mt-14 rounded-card bg-sub p-5 sm:p-7">
        <h2 id="wing-heading" className="text-[1.125rem] font-bold tracking-[-0.01em] text-ink">
          윙 {wing.label}
        </h2>
        <p className="mt-3 text-[0.9375rem] leading-[1.7] text-ink-soft">{wing.description}</p>
        <p className="mt-5 border-t border-line pt-4 text-[0.8125rem] leading-[1.7] text-ink-faint">
          <strong className="font-bold text-ink-soft">{WING_INTERPRETATION_MARKER}</strong> 윙과
          통합·분열 화살표는 실증 근거가 거의 확인되지 않았습니다 (Hook et al., 2021).
        </p>
      </section>

      {/* ④ 상대 비율 막대 + 원점수 + 1위–2위 점수차 */}
      {/*
        두 경로 모두 분포를 보여준다. 이 화면이 "당신의 유형은 X입니다"라고 단정하지
        않고 9유형 프로파일을 제시하는 것은 요인 구조가 아홉으로 재현되지 않는다는
        연구(hook-2021, newgent-2004)에 대한 대응이다 — 45문항 경로에서 분포가 빠지면
        그 정직성 설계가 절반만 작동한다. 각주의 원점수 범위는 `ScoreBars`가 인자로 받는다.
      */}
      <ScoreBars
        scores={result.scores}
        primaryType={result.primaryType}
        scoreRange={base ? [5, 25] : [10, 50]}
      />

      <section aria-labelledby="character-heading" className="mt-14">
        <h2 id="character-heading" className="text-[1.25rem] font-bold text-ink">
          작품 속에서 찾아보기
        </h2>
        <p className="mt-3 text-[0.875rem] leading-[1.7] text-ink-faint">
          공식 유형 설정이 아니라, 작품 속 행동을 {result.primaryType}유형의 특징으로 읽어 본 예시입니다.
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {fictionalCharactersByType[result.primaryType].map((character) => (
            <li key={`${character.work}-${character.name}`} className="rounded-card bg-sub p-5">
              <p className="text-[1rem] font-bold leading-[1.45] text-ink">{character.name}</p>
              <p className="mt-1 text-[0.8125rem] font-medium text-ink-faint">{character.work}</p>
              <p className="mt-3 text-[0.875rem] leading-[1.7] text-ink-soft">{character.resemblance}</p>
            </li>
          ))}
        </ul>
      </section>

      <ShareActions code={code} />

      {base ? <ResultNextStep code={code} /> : null}

      {/* ⑥ 면책 고지 */}
      <section
        aria-labelledby="disclaimer-heading"
        className="mt-14 rounded-card bg-sub px-5 py-6 sm:px-7 sm:py-7"
      >
        <h2 id="disclaimer-heading" className="text-[0.9375rem] font-bold text-ink">
          검사 해석 시 주의
        </h2>
        <div className="mt-3.5 space-y-3 text-[0.9375rem] leading-[1.7] text-ink-soft">
          {DISCLAIMER_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <p className="mt-5 text-[0.9375rem] font-bold leading-[1.7] text-ink">
          {DISCLAIMER_LAST_LINE}
        </p>
      </section>
    </main>
  );
}
