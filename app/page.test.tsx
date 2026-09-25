import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import HomePage from './page';

// 랜딩은 문항 수를 선택하게 하지 않고 하나의 가벼운 시작 행동만 제공한다.
describe('HomePage', () => {
  afterEach(cleanup);

  it('문항 수 선택 없이 기본 검사로 가는 단일 CTA를 보여준다', () => {
    render(<HomePage />);

    const start = screen.getByRole('link', { name: '가볍게 시작하기' });
    expect(start.getAttribute('href')).toBe('/test');
    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(document.body.textContent).not.toContain('27문항');
    expect(document.body.textContent).not.toContain('90문항');
    expect(screen.queryByRole('link', { name: /전체|자세히|90/ })).toBeNull();
  });
});
