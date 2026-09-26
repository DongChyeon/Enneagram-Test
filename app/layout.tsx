import type { Metadata, Viewport } from 'next';
import { AnalyticsProvider } from '../components/AnalyticsProvider';
import { KakaoSdk } from '../components/KakaoSdk';
import { SITE_URL } from '../lib/site';

import './globals.css';

const LANDING_OG_ALT = '애니어그램 유형 테스트 — 가볍게 시작하는 나의 동기 패턴';

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: '애니어그램 유형 테스트',
  description:
    '가볍게 시작해 나와 가까운 동기 패턴을 살펴보는 한국어 애니어그램 테스트. 교육·자기이해 목적이며 임상적 진단이 아니에요.',
  openGraph: {
    type: 'website',
    title: '애니어그램 유형 테스트',
    description: '가볍게 시작해 나와 가까운 유형과 날개 유형을 살펴보세요.',
    images: [{ url: '/og/landing-light.png', width: 1200, height: 630, alt: LANDING_OG_ALT }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '애니어그램 유형 테스트',
    description: '가볍게 시작해 나와 가까운 유형과 날개 유형을 살펴보세요.',
    images: ['/og/landing-light.png'],
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
      <body className="bg-paper font-sans text-ink antialiased">
        {children}
        <KakaoSdk />
        <AnalyticsProvider />
      </body>
    </html>
  );
}
