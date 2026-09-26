import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '개인정보 처리방침 · 에니어그램 유형 테스트',
  description: '에니어그램 유형 테스트가 수집하는 정보와 처리 방식을 안내해요.',
  alternates: { canonical: '/privacy' },
};

const EFFECTIVE_DATE = '2026년 9월 26일';
const CONTACT_URL = 'https://github.com/DongChyeon/Enneagram-Test/issues';

type Section = { title: string; body: ReactNode };

const SECTIONS: Section[] = [
  {
    title: '1. 수집하지 않는 정보',
    body: (
      <>
        <p>
          회원가입과 로그인이 없고 이름·이메일·전화번호를 받지 않아요. 검사 응답은 브라우저의
          sessionStorage에만 임시로 남고 서버로 보내지 않아요. 결과는 링크 주소 안에 담기며
          서버에 저장하지 않아요.
        </p>
      </>
    ),
  },
  {
    title: '2. 수집하는 정보와 목적',
    body: (
      <>
        <p>
          검사를 끝까지 마치는 비율과 어느 화면이 도움이 되는지 확인해 서비스를 개선하려고,
          아래의 익명 사용 통계만 수집해요.
        </p>
        <ul>
          <li>검사 시작·진행 구간(25/50/75/100%)·완료 여부와 대략의 소요 시간 구간</li>
          <li>결과 화면의 대표 유형 번호(1~9), 결과가 뚜렷한지 여부, 공유·이어하기 버튼 사용 여부</li>
          <li>화면 경로(쿼리와 결과 코드는 제외), 대략의 화면 크기 구분, 랜딩 화면의 클릭 위치</li>
          <li>탭마다 새로 만드는 임시 난수 식별자</li>
        </ul>
        <p>
          개별 답변, 점수, 결과 링크, 이전에 방문한 페이지 주소, 화면의 글자는 수집하지 않아요.
          사용자 프로필을 만들지 않고 여러 방문을 한 사람으로 연결하지 않아요.
        </p>
      </>
    ),
  },
  {
    title: '3. 쿠키와 브라우저 저장소',
    body: (
      <p>
        분석용 쿠키와 localStorage는 쓰지 않아요. 진행 상황 복원과 중복 집계 방지를 위해
        sessionStorage를 쓰며, 탭을 닫으면 사라져요. 브라우저의 광고·추적 차단 기능을 켜면
        사용 통계가 전송되지 않고 검사는 그대로 이용할 수 있어요.
      </p>
    ),
  },
  {
    title: '4. 처리 위탁과 국외 이전',
    body: (
      <>
        <p>서비스 운영을 위해 아래 업체를 이용해요. 사용 통계는 판매하거나 광고에 쓰지 않아요.</p>
        <ul>
          <li>
            <strong>PostHog Inc.</strong>(미국) — 익명 사용 통계 저장·분석. 이용하는 동안
            인터넷으로 전송되며, IP 주소는 저장하지 않도록 설정해요.
          </li>
          <li>
            <strong>Vercel Inc.</strong>(미국) — 웹사이트 호스팅. 접속 과정에서 IP 주소 등
            접속 기록이 업체 정책에 따라 처리될 수 있어요.
          </li>
          <li>
            <strong>주식회사 카카오</strong>(대한민국) — 카카오톡 공유 기능 제공. 공유 기능을
            쓸 때 카카오 SDK가 동작해요.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: '5. 보관 기간과 파기',
    body: (
      <p>
        사용 통계는 수집일로부터 최대 1년 동안 보관하고, 기간이 지나면 삭제해요. 개인을 식별할
        수 있는 정보를 받지 않으므로 특정 사용자의 기록만 따로 찾아 삭제하기는 어려워요.
      </p>
    ),
  },
  {
    title: '6. 문의',
    body: (
      <p>
        개인정보 처리에 관한 문의는{' '}
        <a href={CONTACT_URL} className="font-bold text-primary underline underline-offset-2">
          GitHub 이슈
        </a>
        로 남겨 주세요.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-[38rem] px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
      <Link href="/" className="text-[0.875rem] font-bold text-ink-faint hover:text-ink">
        ← 처음으로
      </Link>
      <h1 className="mt-6 text-[1.75rem] font-bold leading-[1.4] tracking-[-0.03em] text-ink">
        개인정보 처리방침
      </h1>
      <p className="mt-3 text-[0.875rem] text-ink-faint">시행일 {EFFECTIVE_DATE}</p>
      <div className="mt-10 space-y-10">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="text-[1.0625rem] font-bold text-ink">{section.title}</h2>
            <div className="mt-3 space-y-3 text-[0.9375rem] leading-[1.7] text-ink-soft [&_li]:relative [&_li]:pl-4 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.72em] [&_li]:before:h-1 [&_li]:before:w-1 [&_li]:before:rounded-full [&_li]:before:bg-ink-faint [&_ul]:space-y-2">
              {section.body}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
