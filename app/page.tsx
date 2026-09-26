import type { Metadata } from 'next';
import Link from 'next/link';
import { LandingAnalytics } from '../components/ProductAnalytics';

import Disclaimer from '../components/Disclaimer';
import { PrivacyLink } from '../components/PrivacyLink';
import ResumeNotice from '../components/ResumeNotice';
import { questionSetSignature } from '../components/progress';
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
/**
 * 이어하기 안내가 쓸 문항 세트 서명. 서버에서 한 번 만들어 문자열로 내려보낸다 —
 * 클라이언트 컴포넌트가 직접 `data/questions`를 import 하면 90문항 텍스트가
 * 통째로 랜딩 번들에 실린다.
 */
const QUESTION_SET_SIGNATURE = questionSetSignature(TOTAL, questions[0].id, questions[TOTAL - 1].id);

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

const DOES: { title: string; body: string }[] = [
  {
    title: '아홉 유형의 점수를 계산해요',
    body: '각 답변을 아홉 유형의 점수로 정리해요. 가장 점수가 높은 유형과, 그 유형의 양옆 번호 중 점수가 높은 날개 유형을 함께 보여줘요.',
  },
  {
    title: '문항은 전부 새로 썼어요',
    body: '에니어그램 이론 문헌의 구성개념만 참고해 한국어로 직접 작성했고, RHETI·WEPSS 같은 상용 검사의 문항은 번역·의역을 포함해 한 문장도 쓰지 않았어요. 문항별 출처와 저작권 검수 기록은 저장소의 docs/sources.md · docs/item-review.md에 있어요.',
  },
  {
    title: '응답은 서버로 가지 않아요',
    body: '검사 중 응답은 브라우저의 sessionStorage에만 임시로 남아 새로고침해도 이어서 답할 수 있고, 탭을 닫으면 사라져요. 결과는 링크 주소 안에 담기므로 데이터베이스도 로그인도 없어요. 서비스 개선을 위해 대표 유형 번호 같은 익명 사용 통계만 수집해요.',
  },
];

const DOES_NOT = [
  '표준화·타당화 절차를 거치지 않았어요. 규준 집단도, 공개된 신뢰도·타당도 계수도 없으며 자세히 살펴본다고 검증된 검사가 되지는 않아요.',
  '당신의 유형을 확정해 주지 않아요. 점수가 촘촘하면 결과 화면이 그 사실을 먼저 알려 줘요.',
  '날개는 측정한 값이 아니라 이론에 따른 해석이에요. 결과 화면도 그렇게 표시해요.',
];

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-[38rem] px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
      <LandingAnalytics />
      <header className="animate-rise-in">
        <h1 className="text-[1.75rem] font-bold leading-[1.4] tracking-[-0.03em] text-ink sm:text-[2.375rem] sm:leading-[1.32]">
          아홉 가지 동기 패턴 중<br />
          어디에 기대고 있는지 적어 봐요
        </h1>
        <p className="mt-5 text-[1.0625rem] leading-[1.65] text-ink-soft">
          문장을 읽고 요즘의 자신에게 얼마나 들어맞는지 고르면 돼요. 맞히는 시험이 아니라,
          스스로를 어떻게 보고 있는지를 정리하는 기록에 가까워요.
        </p>
        <p className="mt-4 text-[0.9375rem] leading-[1.7] text-ink-soft">
          한 화면에 한 문장씩 나오고, 답을 고르면 다음 문장으로 저절로 넘어가요. 먼저
          가볍게 결과를 확인한 뒤, 더 자세히 알고 싶을 때만 이어서 살펴볼 수 있어요.
        </p>
      </header>

      <section aria-labelledby="start-heading" className="mt-9 rounded-card bg-sub p-5 sm:p-7">
        <p className="text-[0.8125rem] font-bold text-primary">가볍게 알아보기</p>
        <h2 id="start-heading" className="mt-2 text-[1.25rem] font-bold tracking-[-0.02em] text-ink">
          지금의 나와 가까운 유형을 살펴봐요
        </h2>
        <p className="mt-3 text-[0.9375rem] leading-[1.7] text-ink-soft">
          약 3–5분이면 결과를 볼 수 있어요. 한 번에 끝내지 않아도 같은 탭에서는 멈춘
          자리에서 이어지고, 답변은 브라우저 밖으로 전송되지 않아요.
        </p>
        <Link
          href="/test"
          className="press mt-5 flex min-h-[3.5rem] w-full items-center justify-center rounded-control bg-primary px-6 text-center text-[1.0625rem] font-bold tracking-[-0.01em] text-white hover:bg-primary-press"
        >
          가볍게 시작하기
        </Link>
        <p className="mt-3 text-center text-[0.8125rem] leading-[1.6] text-ink-faint">
          결과를 본 뒤 원할 때만 더 자세히 이어갈 수 있어요.
        </p>
      </section>

      <ResumeNotice total={TOTAL} signature={QUESTION_SET_SIGNATURE} />

      <section aria-labelledby="does-heading" className="mt-16">
        <h2 id="does-heading" className="text-[1.25rem] font-bold text-ink">
          이 검사가 하는 일
        </h2>
        <ul className="mt-6 space-y-7">
          {DOES.map((item, order) => (
            <li key={item.title} className="flex gap-3.5">
              <span
                aria-hidden="true"
                className="tnum mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sub text-[0.75rem] font-bold text-ink-faint"
              >
                {order + 1}
              </span>
              <div className="min-w-0">
                <h3 className="text-[1rem] font-bold leading-[1.5] tracking-[-0.01em] text-ink">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-[0.9375rem] leading-[1.7] text-ink-soft">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="does-not-heading" className="mt-14">
        <h2 id="does-not-heading" className="text-[1.25rem] font-bold text-ink">
          이 검사가 하지 않는 일
        </h2>
        <ul className="mt-6 space-y-4">
          {DOES_NOT.map((item) => (
            <li
              key={item}
              className="relative pl-4 text-[0.9375rem] leading-[1.7] text-ink-soft before:absolute before:left-0 before:top-[0.72em] before:h-1 before:w-1 before:rounded-full before:bg-ink-faint"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-14">
        <Disclaimer />
      </div>
      <PrivacyLink />
    </main>
  );
}
