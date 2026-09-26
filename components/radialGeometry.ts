/**
 * 9유형 방사형 프로필의 좌표 계산. 결과 화면(`RadialScoreProfile`)과 공유 카드
 * (`ShareCardArt`)가 **같은 도형**을 그리도록 한 곳에 둔다.
 *
 * 기준 판형은 결과 화면의 320×320 viewBox다. 카드는 같은 비율을 픽셀 크기로
 * 늘려 쓴다 — 반지름을 따로 정하면 두 그림이 조금씩 달라진다.
 */

import type { TypeId } from '../data/schema';

/** 12시 방향에서 시계 방향으로 도는 애니어그램 원 순서. */
export const RADIAL_ORDER: readonly TypeId[] = [9, 1, 2, 3, 4, 5, 6, 7, 8];

export const RADIAL_SIZE = 320;
const RADIUS_RATIO = 105 / RADIAL_SIZE;
const LABEL_RADIUS_RATIO = 133 / RADIAL_SIZE;

export function radialGeometry(size: number) {
  const center = size / 2;
  const radius = size * RADIUS_RATIO;
  const labelRadius = size * LABEL_RADIUS_RATIO;

  const point = (index: number, r: number): [number, number] => {
    const angle = (-90 + index * 40) * (Math.PI / 180);
    return [center + Math.cos(angle) * r, center + Math.sin(angle) * r];
  };
  const polygon = (radiusFor: (typeId: TypeId) => number): string =>
    RADIAL_ORDER.map((typeId, index) => point(index, radiusFor(typeId)).join(',')).join(' ');

  return { center, radius, labelRadius, point, polygon };
}

/** 점수를 척도 범위 안에서 0~1로 바꾼다. 범위를 벗어난 값은 잘라 낸다. */
export function normalizeScore(score: number, [min, max]: readonly [number, number]): number {
  return Math.max(0, Math.min(1, (score - min) / (max - min)));
}
