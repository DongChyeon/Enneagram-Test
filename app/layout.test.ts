import { describe, expect, it } from 'vitest';

import { metadata } from './layout';

describe('landing metadata', () => {
  it('문항 수를 전면 홍보하지 않고 새 OG 이미지 URL을 쓴다', () => {
    const serialized = JSON.stringify(metadata);
    expect(serialized).not.toContain('27문항');
    expect(serialized).not.toContain('90문항');
    expect(serialized).toContain('/og/landing-light.png');
  });
});
