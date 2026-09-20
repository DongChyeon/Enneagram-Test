/**
 * 면책 고지 (R3 완화 ①의 세 표면 중 랜딩·결과가 쓰는 전문판).
 *
 * 문구는 `.omc/plans/open-questions.md`에서 확정된 **축자 고정 텍스트**다.
 * 문장을 고치지 말 것 — 줄바꿈만 화면 폭에 맞춰 문단으로 나눴다.
 * 공유 카드는 공간 제약 때문에 마지막 한 줄만 쓴다(AC-11).
 */
export const DISCLAIMER_LAST_LINE = '교육·자기이해 목적이며 임상적 진단이 아닙니다.';

const PARAGRAPHS = [
  '이 검사는 에니어그램 이론에 근거해 자체 제작한 90문항 자기보고 도구입니다. 상용 에니어그램 검사의 문항을 사용하지 않았으며, 표준화·타당화 절차를 거치지 않았습니다.',
  '결과는 진단이 아니라, 아홉 가지 동기 패턴에 대해 당신이 스스로를 어떻게 보고했는지를 정리한 것입니다. 점수가 비슷한 유형이 여럿일 수 있고, 시기와 상황에 따라 결과가 달라질 수 있습니다.',
  '에니어그램은 학술적 검증 근거가 제한적이며, 요인분석 연구들은 아홉 개의 독립된 차원을 일관되게 확인하지 못했습니다 (Hook et al., 2021).',
  '채용·인사 평가·진로 결정·정신건강 판단의 근거로 사용하지 마십시오.',
];

export default function Disclaimer() {
  return (
    <section
      aria-labelledby="disclaimer-heading"
      className="rounded-lg border border-line bg-surface px-5 py-6 sm:px-7 sm:py-7"
    >
      <h2
        id="disclaimer-heading"
        className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ink-faint"
      >
        Disclaimer
      </h2>
      <div className="mt-4 space-y-3 text-[0.9375rem] leading-[1.75] text-ink-soft">
        {PARAGRAPHS.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <p className="mt-5 border-t border-line pt-4 text-[0.9375rem] font-semibold leading-[1.7] text-ink">
        {DISCLAIMER_LAST_LINE}
      </p>
    </section>
  );
}
