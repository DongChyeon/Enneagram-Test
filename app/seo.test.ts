import { describe, expect, it } from 'vitest';

import { metadata as landing } from './page';
import { metadata as privacy } from './privacy/page';
import { generateMetadata as resultMetadata } from './result/[code]/page';
import robots from './robots';
import sitemap from './sitemap';
import { metadata as testPage } from './test/page';

const NOINDEX = { index: false, follow: true };

describe('search indexing', () => {
  it('allows crawling everything and points to the sitemap on the site domain', () => {
    const result = robots();
    expect(result.rules).toEqual({ userAgent: '*', allow: '/' });
    expect(result.sitemap).toBe('https://enneagram-test-one.vercel.app/sitemap.xml');
  });

  it('lists only indexable pages in the sitemap', () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toEqual([
      'https://enneagram-test-one.vercel.app/',
      'https://enneagram-test-one.vercel.app/privacy',
    ]);
  });

  it('declares canonical URLs for indexable pages', () => {
    expect(landing.alternates?.canonical).toBe('/');
    expect(privacy.alternates?.canonical).toBe('/privacy');
  });

  it('keeps the client-only test runner out of search results', () => {
    expect(testPage.robots).toEqual(NOINDEX);
  });

  it('keeps every result page out of search results, including invalid codes', async () => {
    const valid = await resultMetadata({ params: Promise.resolve({ code: '6w5-AwcJBggMDgoFCQ' }) });
    const invalid = await resultMetadata({ params: Promise.resolve({ code: 'not-a-code' }) });
    expect(valid.robots).toEqual(NOINDEX);
    expect(valid.openGraph?.images).toBeDefined();
    expect(invalid.robots).toEqual(NOINDEX);
  });
});
