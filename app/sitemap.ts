import type { MetadataRoute } from 'next';

import { SITE_URL } from '../lib/site';

/** 검색에 노출하는 페이지만 싣는다. 결과·검사 페이지는 `noindex`라 넣지 않는다. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: new URL('/', SITE_URL).toString(), changeFrequency: 'weekly', priority: 1 },
    { url: new URL('/privacy', SITE_URL).toString(), changeFrequency: 'yearly', priority: 0.2 },
  ];
}
