import type { Metadata, Viewport } from 'next';

import './globals.css';

/**
 * 공유 미리보기(OG)의 절대 URL 기준점.
 *
 * **하드코딩 상수이며 환경변수를 읽지 않는다** — AC-12는 환경변수 런타임 참조
 * 0건을 요구하고(그 grep에 걸리지 않도록 이 주석도 변수명을 적지 않는다),
 * `metadataBase`가 없으면 상대 경로 `og:image`가 빌드 경고를 내 같은 AC의
 * 줄머리 경고 grep에 걸린다. 두 요구의 유일한 교집합이 환경변수 없는 상수다.
 *
 * 값은 **반드시 파싱 가능한 실제 URL**이어야 한다. `'https://<production-domain>'`
 * 같은 플레이스홀더는 금지다 — `<`·`>`는 WHATWG URL 파서의 금지 호스트 코드
 * 포인트라 `new URL()`이 모듈 평가 시점에 `TypeError`를 던지고, 첫 빌드가
 * 통째로 실패해 OG PNG가 하나도 생성되지 않는다.
 *
 * 아래 값은 실제 배포 도메인이다(2026-09-20 배포로 확정). 도메인이 바뀌면
 * 이 상수만 고치는 것으로는 부족하다 — OG 이미지 18장을 재생성해야 한다.
 * 그러지 않으면 미리보기 카드가 옛 주소를 가리킨다. `docs/deploy.md` 참조.
 */
const SITE_URL = new URL('https://enneagram-test-one.vercel.app');
const LANDING_OG_ALT = '애니어그램 유형 테스트 — 나를 이해하는 45문항 또는 90문항 검사';

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: '애니어그램 유형 테스트',
  description:
    '90문항으로 애니어그램 주유형과 날개 유형을 확인하는 한국어 검사. 교육·자기이해 목적이며 임상적 진단이 아니에요.',
  openGraph: {
    type: 'website',
    title: '애니어그램 유형 테스트',
    description: '45문항 또는 90문항으로 주유형과 날개 유형을 확인해 보세요.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: LANDING_OG_ALT }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '애니어그램 유형 테스트',
    description: '45문항 또는 90문항으로 주유형과 날개 유형을 확인해 보세요.',
    images: ['/opengraph-image'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // 모바일 브라우저 크롬까지 흰 바탕으로 맞춘다 — 상단 바와 sticky 헤더가
  // 다른 색이면 스크롤할 때 없던 경계선이 하나 생긴 것처럼 보인다.
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-paper font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
