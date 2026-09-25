export const DISCLAIMER_LAST_LINE = '교육·자기이해 목적이며 임상적 진단이 아니에요.';

const PARAGRAPHS = [
  '이 검사는 에니어그램 이론에 근거해 자체 제작한 자기보고 도구예요. 상용 에니어그램 검사의 문항을 사용하지 않았으며, 표준화·타당화 절차를 거치지 않았어요.',
  '결과는 진단이 아니라, 아홉 가지 동기 패턴에 대해 당신이 스스로를 어떻게 보고했는지를 정리한 것이에요. 점수가 비슷한 유형이 여럿일 수 있고, 시기와 상황에 따라 결과가 달라질 수 있어요.',
  '에니어그램은 학술적 검증 근거가 제한적이며, 요인분석 연구들은 아홉 개의 독립된 차원을 일관되게 확인하지 못했어요 (Hook et al., 2021).',
  '채용·인사 평가·진로 결정·정신건강 판단의 근거로 사용하지 마세요.',
];

/** 랜딩 면책 고지. 문항 수를 선택 정보로 만들지 않되 검증 한계는 그대로 밝힌다. */
export default function Disclaimer() {
  return (
    <section
      aria-labelledby="disclaimer-heading"
      className="rounded-card bg-sub px-5 py-6 sm:px-7 sm:py-7"
    >
      <h2 id="disclaimer-heading" className="text-[0.9375rem] font-bold text-ink">
        읽어 주세요
      </h2>
      <div className="mt-3.5 space-y-3 text-[0.9375rem] leading-[1.7] text-ink-soft">
        {PARAGRAPHS.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <p className="mt-5 text-[0.9375rem] font-bold leading-[1.7] text-ink">
        {DISCLAIMER_LAST_LINE}
      </p>
    </section>
  );
}
