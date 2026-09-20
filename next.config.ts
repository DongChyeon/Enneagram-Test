import type { NextConfig } from 'next';

/**
 * 런타임 설정은 두지 않는다 — 이 사이트는 백엔드·DB·인증이 없고,
 * 절대 URL이 필요한 지점(`metadataBase`)은 `app/layout.tsx`의
 * 하드코딩 상수로 해소한다(AC-12: 환경변수 런타임 참조 0건).
 *
 * 공유 카드용 폰트 서브셋(`assets/fonts/**`)은 `outputFileTracingIncludes`로
 * 이미지 라우트 번들에 못 박는다(ADR Consequences).
 */
const nextConfig: NextConfig = {
  // 상위 디렉터리에 다른 lockfile이 있으면 Next가 워크스페이스 루트를 잘못 추론하고
  // 줄머리 `⚠ Warning:` 경고를 내보낸다 — AC-12의 경고 0건 단언에 그대로 걸린다.
  // 루트를 이 저장소로 고정해 추론 자체를 없앤다.
  outputFileTracingRoot: __dirname,

  // `components/cardFont.ts`가 `new URL(..., import.meta.url)`로 읽는 서브셋을
  // 배포 번들에 확실히 싣는다. 이중 안전장치이며, 효과는 로컬 `next dev`가 아니라
  // **Vercel 배포에서만** 드러난다(R13) — 로컬 통과가 이 항목을 증명하지 않는다.
  outputFileTracingIncludes: {
    'app/result/[code]/card/route': ['./assets/fonts/**'],
  },
};

export default nextConfig;
