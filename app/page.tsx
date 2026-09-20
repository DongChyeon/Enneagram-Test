import Link from 'next/link';

import Disclaimer from '../components/Disclaimer';
import { questions } from '../data/questions';

/**
 * 랜딩 (Step 4.2).
 *
 * 카피 원칙: 이 도구는 표준화·타당화를 거치지 않았으므로 "정확한 분석"·"과학적
 * 검증" 류의 주장을 쓰지 않는다(`docs/sources.md` §5). 대신 무엇을 하고 무엇을
 * 하지 않는지를 먼저 적는다. 면책 고지는 이 페이지의 필수 구성요소다
 * (R3 완화 ①의 세 표면 중 하나 — 계획 Step 4 Done-when).
 */

const TOTAL = questions.length;

const FACTS: { label: string; value: string }[] = [
  { label: '문항', value: `${TOTAL}문항` },
  { label: '소요 시간', value: '약 10–15분' },
  { label: '계정', value: '필요 없음' },
  { label: '응답 저장', value: '브라우저 안에만' },
];

const DOES: { title: string; body: string }[] = [
  {
    title: '아홉 유형의 원점수를 계산합니다',
    body: '유형마다 10문항씩, 5점 척도 응답을 합산해 10~50점의 원점수를 냅니다. 가장 높은 유형을 주유형으로, 원 위에서 인접한 두 유형 중 높은 쪽을 윙으로 함께 보여줍니다.',
  },
  {
    title: '문항은 전부 새로 썼습니다',
    body: '에니어그램 이론 문헌의 구성개념만 참고해 한국어로 직접 작성했고, RHETI·WEPSS 같은 상용 검사의 문항은 번역·의역을 포함해 한 문장도 쓰지 않았습니다. 문항별 출처와 저작권 검수 기록은 저장소의 docs/sources.md · docs/item-review.md에 있습니다.',
  },
  {
    title: '응답은 서버로 가지 않습니다',
    body: '검사 중 응답은 브라우저의 sessionStorage에만 임시로 남아 새로고침해도 이어서 답할 수 있고, 탭을 닫으면 사라집니다. 결과는 링크 주소 안에 담기므로 데이터베이스도 로그인도 없습니다.',
  },
];

const DOES_NOT = [
  '표준화·타당화 절차를 거치지 않았습니다. 규준 집단도, 공개된 신뢰도·타당도 계수도 없습니다.',
  '당신의 유형을 확정해 주지 않습니다. 점수가 촘촘하면 결과 화면이 그 사실을 먼저 알려 줍니다.',
  '윙은 측정한 값이 아니라 이론에 따른 해석입니다. 결과 화면도 그렇게 표시합니다.',
];

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-[38rem] px-5 pb-20 pt-14 sm:px-8 sm:pt-20">
      <header className="animate-rise-in">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-accent">
          Enneagram · Self-report
        </p>
        <h1 className="mt-4 text-[1.625rem] font-bold leading-[1.4] tracking-[-0.02em] text-ink sm:text-[2.25rem] sm:leading-[1.35]">
          아홉 가지 동기 패턴 중<br />
          어디에 기대고 있는지 적어 봅니다
        </h1>
        <p className="mt-5 text-[1.0625rem] leading-[1.75] text-ink-soft">
          {TOTAL}개의 문장을 읽고 요즘의 자신에게 얼마나 들어맞는지 고르면 됩니다.
          맞히는 시험이 아니라, 스스로를 어떻게 보고 있는지를 정리하는 기록에 가깝습니다.
        </p>
      </header>

      <dl className="mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line">
        {FACTS.map((fact) => (
          <div key={fact.label} className="bg-surface px-4 py-3.5">
            <dt className="text-[0.75rem] tracking-[0.02em] text-ink-faint">{fact.label}</dt>
            <dd className="mt-1 text-[0.9375rem] font-semibold text-ink">{fact.value}</dd>
          </div>
        ))}
      </dl>

      <Link
        href="/test"
        className="mt-7 flex min-h-[3.5rem] w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 text-[1.0625rem] font-semibold text-white transition-colors duration-150 hover:bg-accent-strong active:bg-accent-strong"
      >
        검사 시작하기
        <span aria-hidden="true">→</span>
      </Link>
      <p className="mt-3 text-center text-[0.8125rem] text-ink-faint">
        중간에 나가도 같은 탭에서는 이어서 답할 수 있습니다.
      </p>

      <section aria-labelledby="does-heading" className="mt-14">
        <h2 id="does-heading" className="text-[1.125rem] font-bold tracking-[-0.01em] text-ink">
          이 검사가 하는 일
        </h2>
        <ul className="mt-5 space-y-6">
          {DOES.map((item) => (
            <li key={item.title} className="border-l-2 border-accent-wash pl-4">
              <h3 className="text-[0.9375rem] font-semibold leading-[1.6] text-ink">{item.title}</h3>
              <p className="mt-1.5 text-[0.9375rem] leading-[1.75] text-ink-soft">{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="does-not-heading" className="mt-12">
        <h2 id="does-not-heading" className="text-[1.125rem] font-bold tracking-[-0.01em] text-ink">
          이 검사가 하지 않는 일
        </h2>
        <ul className="mt-5 space-y-3.5">
          {DOES_NOT.map((item) => (
            <li
              key={item}
              className="relative pl-5 text-[0.9375rem] leading-[1.75] text-ink-soft before:absolute before:left-0 before:top-[0.8em] before:h-px before:w-3 before:bg-line-strong"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12">
        <Disclaimer />
      </div>
    </main>
  );
}
