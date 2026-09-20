import type { NextConfig } from 'next';

/**
 * 런타임 설정은 두지 않는다 — 이 사이트는 백엔드·DB·인증이 없고,
 * 절대 URL이 필요한 지점(`metadataBase`)은 `app/layout.tsx`의
 * 하드코딩 상수로 해소한다(AC-12: 환경변수 런타임 참조 0건).
 *
 * Step 5에서 공유 카드용 폰트 서브셋(`assets/fonts/**`)이 추가되면
 * `outputFileTracingIncludes`로 이미지 라우트 번들에 포함시킨다(ADR Consequences).
 */
const nextConfig: NextConfig = {
  // 상위 디렉터리에 다른 lockfile이 있으면 Next가 워크스페이스 루트를 잘못 추론하고
  // 줄머리 `⚠ Warning:` 경고를 내보낸다 — AC-12의 경고 0건 단언에 그대로 걸린다.
  // 루트를 이 저장소로 고정해 추론 자체를 없앤다.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
