import Link from 'next/link';

import Disclaimer from '../components/Disclaimer';
import ResumeNotice from '../components/ResumeNotice';
import { SECTION_SIZE, questionSetSignature, sectionCount } from '../components/progress';
import { BASE_PLAN, questions } from '../data/questions';

/**
 * 랜딩 (Step 4.2).
 *
 * 카피 원칙: 이 도구는 표준화·타당화를 거치지 않았으므로 "정확한 분석"·"과학적
 * 검증" 류의 주장을 쓰지 않는다(`docs/sources.md` §5). 대신 무엇을 하고 무엇을
 * 하지 않는지를 먼저 적는다. 면책 고지는 이 페이지의 필수 구성요소다
 * (R3 완화 ①의 세 표면 중 하나 — 계획 Step 4 Done-when).
 */

const TOTAL = questions.length;
const BASE_TOTAL = BASE_PLAN.length;
const SECTION_COUNT = sectionCount(TOTAL);
const BASE_SECTION_COUNT = sectionCount(BASE_TOTAL);
/**
 * 이어하기 안내가 쓸 문항 세트 서명. 서버에서 한 번 만들어 문자열로 내려보낸다 —
 * 클라이언트 컴포넌트가 직접 `data/questions`를 import 하면 90문항 텍스트가
 * 통째로 랜딩 번들에 실린다.
 */
const QUESTION_SET_SIGNATURE = questionSetSignature(TOTAL, questions[0].id, questions[TOTAL - 1].id);

/**
 * 두 경로.
 *
 * **45가 90의 열화판이 아니고, 90이 45의 유료판도 아니다.** 둘 다 같은 아홉
 * 축을 재고, 다른 것은 축당 문항 수뿐이다. 그래서 카드를 위아래가 아니라 나란히
 * 놓고, 버튼도 둘 다 같은 무게(파랑 = 행동)로 둔다.
 *
 * 차이 설명에 "더 정확해요" 같은 말을 쓰지 않는다 — 무엇이 어떻게 달라지는지를
 * 적어야 고르는 사람이 판단할 수 있다. 문항 수가 배가 되면 유형 점수에서 **문항
 * 하나가 차지하는 몫**이 1/5에서 1/10으로 줄고, 같은 개념을 다른 문장으로 두 번
 * 묻게 된다 — 그게 정확도 차이의 전부이자 정확한 서술이다.
 *
 * 소요 시간은 한 문항에 6~9초(읽기 + 선택 + 100ms 자동 넘김)를 잡은 값이다.
 */
type Route = {
  href: string;
  total: number;
  sections: number;
  minutes: string;
  perType: string;
  accuracy: string;
  cta: string;
};

const ROUTES: Route[] = [
  {
    href: '/test',
    total: BASE_TOTAL,
    sections: BASE_SECTION_COUNT,
    minutes: '약 5–8분',
    perType: '유형당 5문항',
    accuracy:
      '아홉 유형의 다섯 개념(동기·두려움·주의 초점·관계·부하)을 한 번씩 물어요. 문항 하나가 그 유형 점수의 5분의 1을 쥐고 있어서, 1위와 2위가 가깝게 나오면 문항 한두 개에 순서가 뒤집힐 수 있어요.',
    cta: `${BASE_TOTAL}문항으로 시작하기`,
  },
  {
    href: '/test?full',
    total: TOTAL,
    sections: SECTION_COUNT,
    minutes: '약 10–15분',
    perType: '유형당 10문항',
    accuracy:
      '같은 다섯 개념을 서로 다른 문장으로 두 번씩 물어요. 한 문항을 잘못 읽었거나 그날 기분에 끌려 답했더라도 짝이 되는 다른 문항이 상쇄하므로, 점수가 문항 하나에 덜 흔들려요.',
    cta: `${TOTAL}문항으로 시작하기`,
  },
];

const DOES: { title: string; body: string }[] = [
  {
    title: '아홉 유형의 원점수를 계산해요',
    body: '5점 척도 응답을 유형별로 합산해 원점수를 내요(45문항은 유형당 5문항 → 5~25점, 90문항은 유형당 10문항 → 10~50점). 가장 높은 유형을 주유형으로, 원 위에서 인접한 두 유형 중 높은 쪽을 윙으로 함께 보여줘요.',
  },
  {
    title: '문항은 전부 새로 썼어요',
    body: '에니어그램 이론 문헌의 구성개념만 참고해 한국어로 직접 작성했고, RHETI·WEPSS 같은 상용 검사의 문항은 번역·의역을 포함해 한 문장도 쓰지 않았어요. 문항별 출처와 저작권 검수 기록은 저장소의 docs/sources.md · docs/item-review.md에 있어요.',
  },
  {
    title: '응답은 서버로 가지 않아요',
    body: '검사 중 응답은 브라우저의 sessionStorage에만 임시로 남아 새로고침해도 이어서 답할 수 있고, 탭을 닫으면 사라져요. 결과는 링크 주소 안에 담기므로 데이터베이스도 로그인도 없어요.',
  },
];

const DOES_NOT = [
  '표준화·타당화 절차를 거치지 않았어요. 규준 집단도, 공개된 신뢰도·타당도 계수도 없어요. 이것은 45문항과 90문항에 똑같이 해당해요 — 90문항을 고른다고 검증된 검사가 되지는 않아요.',
  '당신의 유형을 확정해 주지 않아요. 점수가 촘촘하면 결과 화면이 그 사실을 먼저 알려 줘요.',
  '윙은 측정한 값이 아니라 이론에 따른 해석이에요. 결과 화면도 그렇게 표시해요.',
];

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-[38rem] px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
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
          한 화면에 한 문장씩 나오고, 고르면 다음 문장으로 저절로 넘어가요. {SECTION_SIZE}문항씩
          묶어 보여 주므로 지금 어디쯤인지 늘 보여요. 길이는 아래에서 고르세요 — 둘 다 같은 아홉
          유형을 살펴보고, 다른 것은 유형마다 묻는 횟수뿐이에요.
        </p>
      </header>

      {/* 네 가지 사실. 칸을 선으로 나누지 않고 가라앉은 한 면 안에 여백으로 나눈다. */}
      <div className="mt-9 space-y-4">
        {ROUTES.map((route) => (
          <section
            key={route.href}
            aria-labelledby={`route-${route.total}`}
            className="rounded-card bg-sub p-5 sm:p-7"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2
                id={`route-${route.total}`}
                className="tnum text-[1.25rem] font-bold tracking-[-0.02em] text-ink"
              >
                {route.total}문항
              </h2>
              <p className="tnum text-[0.875rem] font-medium text-ink-faint">
                {route.perType} · {route.minutes}
              </p>
            </div>
            <p className="mt-3 text-[0.9375rem] leading-[1.7] text-ink-soft">{route.accuracy}</p>
            <Link
              href={route.href}
              className="press mt-5 flex min-h-[3.5rem] w-full items-center justify-center rounded-control bg-primary px-6 text-center text-[1.0625rem] font-bold tracking-[-0.01em] text-white hover:bg-primary-press"
            >
              {route.cta}
            </Link>
          </section>
        ))}
      </div>

      <p className="mt-5 text-[0.875rem] leading-[1.7] text-ink-faint">
        {BASE_TOTAL}문항으로 시작해도 결과 화면에서 나머지 {TOTAL - BASE_TOTAL}문항을 이어서 답할
        수 있고, <strong className="font-bold text-ink-soft">이미 답한 문항은 다시 묻지
        않아요.</strong> 어느 쪽이든 한 번에 다 하지 않아도 돼요 — 중간에 나가도, 새로고침해도
        같은 탭에서는 멈춘 자리에서 이어져요. 응답은 브라우저 안에만 머물러요.
      </p>

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
    </main>
  );
}
