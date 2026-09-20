import { describe, expect, it } from 'vitest';

import type { TypeId } from './schema';
import { typeRelationships } from './type-relationships';

const TYPE_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

describe('typeRelationships', () => {
  it('아홉 유형 모두 관계 안내가 있고 자기 자신을 추천하지 않는다', () => {
    expect(Object.keys(typeRelationships)).toHaveLength(9);

    for (const typeId of TYPE_IDS) {
      const guide = typeRelationships[typeId];
      expect(TYPE_IDS).toContain(guide.good.typeId);
      expect(TYPE_IDS).toContain(guide.difficult.typeId);
      expect(guide.good.typeId).not.toBe(typeId as TypeId);
      expect(guide.difficult.typeId).not.toBe(typeId as TypeId);
    }
  });

  it('모든 이유가 자연스러운 해요체 문장으로 끝난다', () => {
    for (const guide of Object.values(typeRelationships)) {
      expect(guide.good.reason).toMatch(/요\.$/);
      expect(guide.difficult.reason).toMatch(/요\.$/);
    }
  });
});
