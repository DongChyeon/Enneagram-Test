import { describe, expect, it } from 'vitest';

import { questions } from '../data/questions';
import type { TypeId } from '../data/schema';
import {
  TYPE_IDS,
  adjacentSum,
  buildResult,
  isAmbiguous,
  resolvePrimary,
  resolveWing,
  scoreAnswers,
} from './scoring';
import type { Answer, Likert, Scores } from './types';

/* ------------------------------------------------------------------ */
/* 합성 응답 헬퍼                                                       */
/* ------------------------------------------------------------------ */

/**
 * 유형별 목표 점수(10~50)를 정확히 내도록 90문항 응답을 합성한다.
 *
 * 한 문항의 "기여"는 정채점이면 응답값 그대로, 역채점이면 `6 - 응답값`이다.
 * 따라서 기여 `c`를 원하면 응답값은 `reverse ? 6 - c : c`가 된다 —
 * 역채점이 있어도 문항당 기여는 1~5, 유형 합계는 10~50으로 동일하다.
 */
function answersForScores(targets: Record<TypeId, number>): Answer[] {
  const answers: Answer[] = [];
  for (const typeId of TYPE_IDS) {
    const target = targets[typeId];
    if (!Number.isInteger(target) || target < 10 || target > 50) {
      throw new Error(`목표 점수는 10~50 정수여야 한다: ${typeId} → ${target}`);
    }
    const base = Math.floor(target / 10);
    const extra = target - base * 10; // 이 개수만큼만 base + 1을 기여한다
    const items = questions.filter((q) => q.typeId === typeId);
    items.forEach((q, index) => {
      const contribution = index < extra ? base + 1 : base;
      const value = (q.reverse ? 6 - contribution : contribution) as Likert;
      answers.push({ questionId: q.id, value });
    });
  }
  return answers;
}

/** 모든 문항에 같은 리커트 값을 준 응답. */
function uniformAnswers(value: Likert): Answer[] {
  return questions.map((q) => ({ questionId: q.id, value }));
}

function scoresOf(targets: Record<TypeId, number>): Scores {
  return scoreAnswers(answersForScores(targets));
}

/** 유형별 역채점 문항 수. 데이터에서 직접 센다(스키마상 유형당 2개). */
const reverseCountByType = Object.fromEntries(
  TYPE_IDS.map((t) => [t, questions.filter((q) => q.typeId === t && q.reverse).length]),
) as Record<TypeId, number>;

/* ------------------------------------------------------------------ */
/* ①~⑨ 유형 1~9 합성 응답                                              */
/* ------------------------------------------------------------------ */

describe('resolvePrimary — 유형 1~9 합성 응답 (AC-7 ①)', () => {
  for (const typeId of TYPE_IDS) {
    it(`유형 ${typeId}이 최고점이면 주유형은 ${typeId}이다`, () => {
      const targets = Object.fromEntries(
        TYPE_IDS.map((t) => [t, t === typeId ? 50 : 30]),
      ) as Record<TypeId, number>;
      const result = buildResult(answersForScores(targets));

      expect(result.scores[typeId]).toBe(50);
      expect(result.primaryType).toBe(typeId);
      expect(result.wing).toMatch(/^[1-9]w[1-9]$/);
      expect(result.wing.startsWith(String(typeId))).toBe(true);
      expect(result.ambiguous).toBe(false);
    });
  }
});

/* ------------------------------------------------------------------ */
/* ⑩⑪ 주유형 동점                                                      */
/* ------------------------------------------------------------------ */

describe('resolvePrimary — 주유형 동점 (AC-7 ②③)', () => {
  it('⑩ 비경계 동점(4↔5)은 인접합이 높은 쪽으로 결정된다', () => {
    // 4와 5가 45로 동점. 인접합(자기 점수 불포함):
    //   adj(4) = s3 + s5 = 40 + 45 = 85
    //   adj(5) = s4 + s6 = 45 + 20 = 65  → 주유형 4
    const scores = scoresOf({ 1: 15, 2: 15, 3: 40, 4: 45, 5: 45, 6: 20, 7: 15, 8: 15, 9: 15 });

    expect(adjacentSum(scores, 4)).toBe(85);
    expect(adjacentSum(scores, 5)).toBe(65);
    expect(resolvePrimary(scores)).toBe(4);
    expect(resolveWing(scores, 4)).toBe('4w5');
  });

  it('⑪ 순환 경계 동점(1↔9)은 인접합도 같으면 min(typeId)로 결정된다', () => {
    // 1과 9가 45로 동점. 인접합이 순환하므로:
    //   adj(1) = s9 + s2 = 45 + 20 = 65
    //   adj(9) = s8 + s1 = 20 + 45 = 65  → 동점 → min(typeId) = 1
    const scores = scoresOf({ 1: 45, 2: 20, 3: 15, 4: 15, 5: 15, 6: 15, 7: 15, 8: 20, 9: 45 });

    expect(adjacentSum(scores, 1)).toBe(65);
    expect(adjacentSum(scores, 9)).toBe(65);
    expect(resolvePrimary(scores)).toBe(1);
    expect(resolveWing(scores, 1)).toBe('1w9');
  });
});

/* ------------------------------------------------------------------ */
/* ⑫⑬ 윙 동점                                                          */
/* ------------------------------------------------------------------ */

describe('resolveWing — 윙 동점은 순환 n-1 쪽 (AC-6, AC-7 ④⑤)', () => {
  it('⑫ 비경계: 주유형 5 · 4와 6 동점 → 5w4', () => {
    const scores = scoresOf({ 1: 15, 2: 15, 3: 15, 4: 30, 5: 50, 6: 30, 7: 15, 8: 15, 9: 15 });

    expect(resolvePrimary(scores)).toBe(5);
    expect(resolveWing(scores, 5)).toBe('5w4');
  });

  it('⑬ 경계: 주유형 1 · 9와 2 동점 → 1w9', () => {
    const scores = scoresOf({ 1: 50, 2: 30, 3: 15, 4: 15, 5: 15, 6: 15, 7: 15, 8: 15, 9: 30 });

    expect(resolvePrimary(scores)).toBe(1);
    expect(resolveWing(scores, 1)).toBe('1w9');
  });

  it('경계 대칭: 주유형 9 · 8과 1 동점 → 9w8', () => {
    const scores = scoresOf({ 1: 30, 2: 15, 3: 15, 4: 15, 5: 15, 6: 15, 7: 15, 8: 30, 9: 50 });

    expect(resolvePrimary(scores)).toBe(9);
    expect(resolveWing(scores, 9)).toBe('9w8');
  });

  it('윙은 언제나 주유형의 인접 유형이다', () => {
    for (const typeId of TYPE_IDS) {
      const targets = Object.fromEntries(
        TYPE_IDS.map((t) => [t, t === typeId ? 50 : 20 + t]),
      ) as Record<TypeId, number>;
      const scores = scoreAnswers(answersForScores(targets));
      const wing = resolveWing(scores, typeId);
      const prev = ((typeId + 7) % 9) + 1;
      const next = (typeId % 9) + 1;

      expect(wing).toMatch(/^[1-9]w[1-9]$/);
      expect([`${typeId}w${prev}`, `${typeId}w${next}`]).toContain(wing);
    }
  });
});

/* ------------------------------------------------------------------ */
/* ⑭⑮ 역채점                                                           */
/* ------------------------------------------------------------------ */

describe('scoreAnswers — 역채점 (AC-5, AC-7 ⑥⑦)', () => {
  it('⑭ 전부 1 응답이면 유형 점수는 10이 아니라 10 + 4 × 역채점 문항 수다', () => {
    const scores = scoreAnswers(uniformAnswers(1));

    for (const typeId of TYPE_IDS) {
      const expected = 10 + 4 * reverseCountByType[typeId];
      // 정채점 8문항 × 1 = 8, 역채점 2문항 × (6 - 1) = 10 → 18
      expect(reverseCountByType[typeId]).toBe(2);
      expect(scores[typeId]).toBe(expected);
      expect(scores[typeId]).toBe(18);
    }
  });

  it('⑮ 정채점 5 · 역채점 1 조합은 만점 50이다', () => {
    const answers: Answer[] = questions.map((q) => ({
      questionId: q.id,
      value: (q.reverse ? 1 : 5) as Likert,
    }));
    const scores = scoreAnswers(answers);

    for (const typeId of TYPE_IDS) {
      expect(scores[typeId]).toBe(50);
    }
  });

  it('전부 5 응답이면 역채점 문항이 깎여 50 미만이다', () => {
    const scores = scoreAnswers(uniformAnswers(5));

    for (const typeId of TYPE_IDS) {
      expect(scores[typeId]).toBe(50 - 4 * reverseCountByType[typeId]);
    }
  });

  it('모든 응답 조합에서 유형 점수는 10~50 범위를 벗어나지 않는다', () => {
    for (const value of [1, 2, 3, 4, 5] as Likert[]) {
      const scores = scoreAnswers(uniformAnswers(value));
      for (const typeId of TYPE_IDS) {
        expect(scores[typeId]).toBeGreaterThanOrEqual(10);
        expect(scores[typeId]).toBeLessThanOrEqual(50);
      }
    }
  });

  it('응답이 누락되면 예외를 던진다', () => {
    const answers = uniformAnswers(3).slice(0, 89);
    expect(() => scoreAnswers(answers)).toThrow();
  });
});

/* ------------------------------------------------------------------ */
/* isAmbiguous                                                         */
/* ------------------------------------------------------------------ */

describe('isAmbiguous — 1위 − 2위 < 3 (AC-8 ⑤)', () => {
  it('차이 2면 true', () => {
    const scores = scoresOf({ 1: 40, 2: 38, 3: 20, 4: 20, 5: 20, 6: 20, 7: 20, 8: 20, 9: 20 });
    expect(scores[1] - scores[2]).toBe(2);
    expect(isAmbiguous(scores)).toBe(true);
  });

  it('차이 3이면 false', () => {
    const scores = scoresOf({ 1: 40, 2: 37, 3: 20, 4: 20, 5: 20, 6: 20, 7: 20, 8: 20, 9: 20 });
    expect(scores[1] - scores[2]).toBe(3);
    expect(isAmbiguous(scores)).toBe(false);
  });

  it('9유형 전부 동점이면 true', () => {
    const scores = scoreAnswers(uniformAnswers(3));
    expect(isAmbiguous(scores)).toBe(true);
  });
});
