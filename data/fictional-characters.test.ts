import { describe, expect, it } from 'vitest';

import { TYPE_IDS } from '../lib/scoring';
import { fictionalCharactersByType } from './fictional-characters';

describe('fictionalCharactersByType', () => {
  it('아홉 유형마다 중복 없는 가상 인물 세 명과 설명을 제공한다', () => {
    for (const typeId of TYPE_IDS) {
      const characters = fictionalCharactersByType[typeId];
      expect(characters).toHaveLength(3);
      expect(new Set(characters.map(({ name }) => name)).size).toBe(3);
      for (const character of characters) {
        expect(character.name.length).toBeGreaterThan(0);
        expect(character.work.length).toBeGreaterThan(0);
        expect(character.resemblance.length).toBeGreaterThan(20);
      }
    }
  });
});
