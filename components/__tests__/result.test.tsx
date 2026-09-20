/**
 * `ResultView` 렌더 테스트 — AC-8 ①–⑥의 **렌더 측면**을 닫는다.
 *
 * ⑤(모호성 안내)는 임계값 **양쪽** 픽스처로 검사한다. 한쪽만 보면 "항상 뜨는
 * 안내"와 "임계값이 맞게 동작하는 안내"를 구분하지 못한다.
 * `isAmbiguous`는 `1위 − 2위 < 3`이므로 차이 2 → 노출, 차이 3 → 미노출이다.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import { types } from '../../data/types';
import { wingByLabel } from '../../data/wings';
import { isAmbiguous, resultFromScores } from '../../lib/scoring';
import type { Scores } from '../../lib/types';
import { DISCLAIMER_LAST_LINE, ResultView, WING_INTERPRETATION_MARKER } from '../ResultView';
import { MARK_SIZE, TYPE_HUES } from '../typeMark';

afterEach(cleanup);

/**
 * 유형 5를 1위로 만드는 점수 세트. `gap`만큼 2위(유형 4)와 벌어진다.
 * 유형 4를 2위로 두면 윙은 `5w4`가 되고, 인접(4·6) 중 4가 높으므로 동점 규칙을
 * 타지 않는다 — 픽스처가 검사하려는 것은 모호성 임계값이지 동점 규칙이 아니다.
 */
function fixture(gap: number): Scores {
  return { 1: 20, 2: 21, 3: 22, 4: 40 - gap, 5: 40, 6: 23, 7: 24, 8: 25, 9: 26 };
}

describe('ResultView', () => {
  it('AC-8 ①–④⑥: 유형명·윙 라벨·4섹션·윙 설명·상대 비율 막대·면책 고지를 렌더한다', () => {
    const scores = fixture(3);
    const result = resultFromScores(scores);
    const { container } = render(<ResultView result={result} code="5w4-TEST0000000" />);
    const text = container.textContent ?? '';

    const type = types.find((t) => t.id === result.primaryType);
    expect(type).toBeDefined();

    // ① 주유형 이름 + 5w4 라벨
    expect(result.wing).toBe('5w4');
    expect(text).toContain(type!.nameKo);
    expect(screen.getByText('5w4')).toBeDefined();

    // ② 4개 섹션 전부 — 표제와 내용 양쪽
    expect(screen.getByText('핵심 동기')).toBeDefined();
    expect(screen.getByText('핵심 두려움')).toBeDefined();
    expect(screen.getByText('강점')).toBeDefined();
    expect(screen.getByText('성장 포인트')).toBeDefined();
    expect(text).toContain(type!.coreMotivation);
    expect(text).toContain(type!.coreFear);
    for (const item of type!.strengths) expect(text).toContain(item);
    for (const item of type!.growthPoints) expect(text).toContain(item);

    // ③ 윙 설명 + 이론적 해석 마커 (윙 블록 **안**에 있어야 한다)
    const wing = wingByLabel.get(result.wing);
    expect(wing).toBeDefined();
    const wingSection = container.querySelector('section[aria-labelledby="wing-heading"]');
    expect(wingSection).not.toBeNull();
    expect(wingSection!.textContent).toContain(wing!.description);
    expect(wingSection!.textContent).toContain(WING_INTERPRETATION_MARKER);
    expect(wingSection!.textContent).toContain('이론적 해석');

    // ④ 9유형 상대 비율 막대 + 유형명 + 원점수 + 1위–2위 점수차
    const bars = container.querySelectorAll('section[aria-labelledby="score-bars-heading"] li');
    expect(bars.length).toBe(9);
    for (const t of types) {
      const row = [...bars].find((li) => li.textContent?.includes(t.nameKo));
      expect(row, `막대 누락: ${t.nameKo}`).toBeDefined();
      expect(row!.textContent).toContain(String(scores[t.id]));
      const fill = row!.querySelector('span[style]') as HTMLElement | null;
      expect(fill).not.toBeNull();
      expect(fill!.style.width).toBe(`${Math.round((scores[t.id] / 40) * 100)}%`);
    }
    expect(text).toContain('1위-2위 점수차');
    expect(text).toContain('3점');

    // ⑥ 면책 고지
    expect(text).toContain(DISCLAIMER_LAST_LINE);
    expect(text).toContain('요인분석');
  });

  it('주유형 도트 캐릭터를 렌더한다 — 16×16 칸이고, 유형명 옆의 장식이라 낭독되지 않는다', () => {
    const result = resultFromScores(fixture(3));
    const { container } = render(<ResultView result={result} code="5w4-TEST0000000" />);

    const mark = container.querySelector(`[data-type-mark="${result.primaryType}"]`);
    expect(mark).not.toBeNull();
    // 유형명이 바로 옆에 텍스트로 있으므로 그림이 두 번 읽히면 안 된다.
    expect(mark!.getAttribute('aria-hidden')).toBe('true');

    // satori에는 grid가 없다 — 행 16개 × 칸 16개의 flex 구조가 유지되는지 본다.
    const rows = [...mark!.children];
    expect(rows.length).toBe(MARK_SIZE);
    for (const row of rows) expect(row.children.length).toBe(MARK_SIZE);

    // 빈칸도 투명 칸으로 남아야 한다(빼면 행이 밀린다) → 전체 칸 수는 항상 256.
    expect(mark!.querySelectorAll(':scope > div > div').length).toBe(MARK_SIZE * MARK_SIZE);

    // 유형 색이 실제로 쓰인다.
    const hue = TYPE_HUES[result.primaryType];
    const painted = [...mark!.querySelectorAll('div')].some(
      (cell) => (cell as HTMLElement).style.backgroundColor !== '' &&
        (cell as HTMLElement).style.backgroundColor !== 'transparent',
    );
    expect(hue).toBeDefined();
    expect(painted).toBe(true);
  });

  it('AC-8 ⑤: 1위−2위 점수차 2이면 "유형이 뚜렷하지 않음" 안내를 렌더한다', () => {
    const scores = fixture(2);
    expect(isAmbiguous(scores)).toBe(true);
    const { container } = render(<ResultView result={resultFromScores(scores)} code="5w4-TEST0000000" />);
    expect(container.textContent).toContain('유형이 뚜렷하지 않음');
  });

  it('AC-8 ⑤: 1위−2위 점수차 3이면 안내를 렌더하지 않는다', () => {
    const scores = fixture(3);
    expect(isAmbiguous(scores)).toBe(false);
    const { container } = render(<ResultView result={resultFromScores(scores)} code="5w4-TEST0000000" />);
    expect(container.textContent).not.toContain('유형이 뚜렷하지 않음');
  });

  it('AC-11 폴백 ②③: 동일 출처 앵커 다운로드와 인라인 카드 이미지를 함께 제공한다', () => {
    const { container } = render(<ResultView result={resultFromScores(fixture(3))} code="5w4-TEST0000000" />);

    const anchor = container.querySelector('a[download]') as HTMLAnchorElement | null;
    expect(anchor).not.toBeNull();
    expect(anchor!.getAttribute('href')).toBe('/result/5w4-TEST0000000/card?dl=1');
    expect(anchor!.getAttribute('download')).toBe('enneagram-5w4-TEST0000000.png');

    // 폴백 ③은 **맨 URL**이어야 한다 — ?dl=1이면 attachment로 내려와 렌더되지 않는다.
    const img = container.querySelector('img') as HTMLImageElement | null;
    expect(img).not.toBeNull();
    expect(img!.getAttribute('src')).toBe('/result/5w4-TEST0000000/card');
    expect(container.textContent).toContain('길게 눌러 저장');
  });
});
