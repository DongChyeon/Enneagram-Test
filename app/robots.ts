import type { MetadataRoute } from 'next';

import { SITE_URL } from '../lib/site';

/**
 * 모든 경로의 수집을 허용한다. 결과·검사 페이지는 여기서 막지 않고 페이지의
 * `noindex`로 검색 결과에서만 뺀다 — `Disallow`로 막으면 검색엔진이 그 `noindex`를
 * 읽지 못하고, 결과 링크의 공유 미리보기 수집기도 막힐 수 있다.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: new URL('/sitemap.xml', SITE_URL).toString(),
  };
}
