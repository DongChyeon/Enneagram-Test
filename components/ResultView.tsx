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
 */

import { typeById } from '../data/types';
import { wingByLabel } from '../data/wings';
import type { Result } from '../lib/types';
import { ScoreBars } from './ScoreBars';
import { ShareActions } from './ShareActions';
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

export type ResultViewProps = {
  result: Result;
  /** 공유 링크·카드 URL의 코드. */
  code: string;
};

export function ResultView({ result, code }: ResultViewProps) {
  const type = typeById.get(result.primaryType);
  const wing = wingByLabel.get(result.wing);

  if (type === undefined || wing === undefined) {
    // 디코드가 통과한 코드라면 도달할 수 없다 — 도달하면 데이터 누락 버그다.
    throw new Error(`유형·윙 데이터 누락: ${result.primaryType} / ${result.wing}`);
  }

  return (
    <main className="mx-auto max-w-2xl px-5 py-8">
      {/* ① 주유형 이름 + 윙 라벨 */}
      <header>
        {/* 도트 캐릭터는 유형명 **옆**에 둔다. 화면에서 유일하게 채도가 있는 요소이므로
            주변에 다른 색을 더하지 않는다 — 기존의 절제된 톤을 그대로 둔다.
            `aria-hidden`은 `TypeMark`가 갖고 있다(유형명이 바로 옆에 텍스트로 있다). */}
        <div className="flex items-center gap-4">
          <TypeMark typeId={result.primaryType} dot={6} />
          <div className="min-w-0">
            <p className="text-sm text-neutral-600">가장 높게 나온 유형</p>
            <h1 className="mt-1 text-2xl font-bold leading-snug">
              {result.primaryType}유형 · {type.nameKo}
            </h1>
            <p className="mt-1 text-lg font-bold text-emerald-800">{result.wing}</p>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-neutral-700">{type.summary}</p>
      </header>

      {/* ⑤ 모호성 안내 — isAmbiguous(1위−2위 < 3)일 때만 */}
      {result.ambiguous ? (
        <aside
          role="note"
          className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900"
        >
          <strong className="font-bold">유형이 뚜렷하지 않음</strong>
          <p className="mt-1">
            1위와 2위의 점수차가 3점 미만입니다. 한 유형으로 좁히기보다 상위 두세 유형의 설명을 함께
            읽어 보세요.
          </p>
        </aside>
      ) : null}

      {/* ② 핵심 동기 / 핵심 두려움 / 강점 / 성장 포인트 */}
      <section aria-labelledby="detail-heading" className="mt-8">
        <h2 id="detail-heading" className="text-base font-bold">
          유형 상세
        </h2>

        <div className="mt-3">
          <h3 className="text-sm font-bold">핵심 동기</h3>
          <p className="mt-1 text-sm leading-relaxed text-neutral-700">{type.coreMotivation}</p>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-bold">핵심 두려움</h3>
          <p className="mt-1 text-sm leading-relaxed text-neutral-700">{type.coreFear}</p>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-bold">강점</h3>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-neutral-700">
            {type.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-bold">성장 포인트</h3>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-neutral-700">
            {type.growthPoints.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ③ 윙 설명 + 이론적 해석 마커 (같은 블록 안) */}
      <section
        aria-labelledby="wing-heading"
        className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4"
      >
        <h2 id="wing-heading" className="text-base font-bold">
          윙 {wing.label}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-700">{wing.description}</p>
        <p className="mt-3 border-t border-emerald-200 pt-3 text-xs leading-relaxed text-emerald-900">
          {WING_INTERPRETATION_MARKER} 윙과 통합·분열 화살표는 실증 근거가 거의 확인되지 않았습니다
          (Hook et al., 2021).
        </p>
      </section>

      {/* ④ 상대 비율 막대 + 원점수 + 1위–2위 점수차 */}
      <ScoreBars scores={result.scores} primaryType={result.primaryType} />

      <ShareActions code={code} />

      {/* ⑥ 면책 고지 */}
      <section
        aria-labelledby="disclaimer-heading"
        className="mt-10 border-t border-neutral-200 pt-6 text-xs leading-relaxed text-neutral-600"
      >
        <h2 id="disclaimer-heading" className="text-sm font-bold text-neutral-800">
          검사 해석 시 주의
        </h2>
        {DISCLAIMER_PARAGRAPHS.map((paragraph) => (
          <p key={paragraph} className="mt-2">
            {paragraph}
          </p>
        ))}
        <p className="mt-3 font-bold text-neutral-800">{DISCLAIMER_LAST_LINE}</p>
      </section>
    </main>
  );
}
