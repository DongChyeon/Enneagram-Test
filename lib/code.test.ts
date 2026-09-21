import { describe, expect, it } from 'vitest';

import type { TypeId } from '../data/schema';
import { decodeResult, encodeResult } from './code';
import { TYPE_IDS, resultFromScores } from './scoring';
import type { ResultKind, Scores } from './types';

function makeScores(values: number[]): Scores {
  return Object.fromEntries(TYPE_IDS.map((t, i) => [t, values[i]])) as Scores;
}

/** 재현 가능한 의사난수(xorshift32) — 시드 고정이라 실패가 재현된다. */
function makeRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 0x1_0000_0000;
  };
}

function roundTrip(scores: Scores, kind: ResultKind = 'full'): void {
  const original = resultFromScores(scores, kind);
  const code = encodeResult(original);

  expect(code.length).toBeLessThanOrEqual(20);
  expect(code).toMatch(/^[1-9]w[1-9]-[A-Za-z0-9_-]{14}$/);

  const decoded = decodeResult(code);
  expect(decoded).not.toBeNull();
  expect(decoded).toEqual(original);
  expect(decoded?.kind).toBe(kind);
}

describe('encodeResult / decodeResult — 라운드트립 (AC-9)', () => {
  it('무작위 1,000 조합이 무손실이다', () => {
    const random = makeRandom(20260920);
    for (let i = 0; i < 1000; i += 1) {
      const values = TYPE_IDS.map(() => 10 + Math.floor(random() * 41));
      roundTrip(makeScores(values));
    }
  });

  it('경계 조합이 무손실이다', () => {
    const boundaries: number[][] = [
      [10, 10, 10, 10, 10, 10, 10, 10, 10], // 전부 최소
      [50, 50, 50, 50, 50, 50, 50, 50, 50], // 전부 최대 (9유형 전부 동점)
      [50, 10, 50, 10, 50, 10, 50, 10, 50], // 극단 혼합
      [10, 50, 10, 50, 10, 50, 10, 50, 10], // 극단 혼합 (반전)
      [33, 33, 33, 33, 33, 33, 33, 33, 33], // 9유형 전부 동점 (중간값)
      [50, 49, 10, 10, 10, 10, 10, 10, 10], // 1위-2위 차 1 (모호)
    ];
    for (const values of boundaries) {
      roundTrip(makeScores(values));
    }
  });

  it('기본 45문항 무작위 1,000 조합이 무손실이고 kind가 보존된다', () => {
    const random = makeRandom(20260921);
    for (let i = 0; i < 1000; i += 1) {
      const values = TYPE_IDS.map(() => 5 + Math.floor(random() * 21));
      roundTrip(makeScores(values), 'legacy-base');
    }
  });

  it('기본 45문항 경계 조합이 무손실이다', () => {
    const boundaries: number[][] = [
      [5, 5, 5, 5, 5, 5, 5, 5, 5],
      [25, 25, 25, 25, 25, 25, 25, 25, 25],
      [25, 5, 25, 5, 25, 5, 25, 5, 25],
      [5, 25, 5, 25, 5, 25, 5, 25, 5],
      [25, 24, 5, 5, 5, 5, 5, 5, 5],
    ];
    for (const values of boundaries) {
      roundTrip(makeScores(values), 'legacy-base');
    }
  });

  it('45문항 코드도 20자 이하다', () => {
    const code = encodeResult(
      resultFromScores(makeScores([25, 25, 25, 25, 25, 25, 25, 25, 25]), 'legacy-base'),
    );
    expect(code.length).toBe(18);
    expect(code.length).toBeLessThanOrEqual(20);
  });

  it('27문항 v3 점수 조합과 경계값을 무손실로 보존한다', () => {
    const random = makeRandom(20260922);
    for (let i = 0; i < 1000; i += 1) {
      roundTrip(makeScores(TYPE_IDS.map(() => 3 + Math.floor(random() * 13))), 'base');
    }
    for (const value of [3, 15]) roundTrip(makeScores(TYPE_IDS.map(() => value)), 'base');
    const code = encodeResult(resultFromScores(makeScores(TYPE_IDS.map(() => 9)), 'base'));
    expect(atob(code.slice(4).replace(/-/g, '+').replace(/_/g, '/') + '==').charCodeAt(0)).toBe(3);
  });

  it('기존 운영 45문항 링크는 재채점 없이 같은 점수와 유형으로 읽는다', () => {
    const result = decodeResult('3w4-AhUNFxMWFg0QEQ');
    expect(result?.kind).toBe('legacy-base');
    expect(result?.wing).toBe('3w4');
    expect(result?.scores).toEqual(makeScores([21, 13, 23, 19, 22, 22, 13, 16, 17]));
    expect(encodeResult(result!)).toBe('3w4-AhUNFxMWFg0QEQ');
  });

  it('코드 길이는 항상 20자 이하다', () => {
    const code = encodeResult(resultFromScores(makeScores([50, 50, 50, 50, 50, 50, 50, 50, 50])));
    expect(code.length).toBe(18);
    expect(code.length).toBeLessThanOrEqual(20);
  });
});

describe('decodeResult — 거부 조건 (AC-9)', () => {
  const valid = encodeResult(
    resultFromScores(makeScores([50, 30, 20, 20, 20, 20, 20, 20, 30])),
  );

  it('형식이 어긋나면 null', () => {
    const malformed = [
      '',
      'abc',
      '5w4',
      '5w4-',
      '-XXXXXXXXXXXXXX',
      '5w4XXXXXXXXXXXXXX',
      `${valid}X`, // 페이로드가 15자
      valid.slice(0, -1), // 페이로드가 13자
      '0w4-AQoUHigyPEZQTA', // 주유형 0
      '5w0-AQoUHigyPEZQTA', // 윙 0
      '5w4-AQoUHigyPEZQT!', // base64url 아닌 문자
    ];
    for (const code of malformed) {
      expect(decodeResult(code)).toBeNull();
    }
  });

  it('모르는 버전 바이트는 null', () => {
    for (const version of [0, 4, 9, 255]) {
      const bytes = new Uint8Array([version, 50, 30, 20, 20, 20, 20, 20, 20, 30]);
      expect(decodeResult(`1w9-${toBase64Url(bytes)}`)).toBeNull();
    }
  });

  /**
   * 45문항 결과와 90문항 결과는 **다른 것**이다. 버전 바이트가 문항 세트를
   * 가리키고 점수 범위 검증이 그 세트의 범위로 이뤄지므로, 한쪽 점수를 다른
   * 쪽 버전으로 읽히게 만드는 코드는 디코드 단계에서 막힌다.
   */
  it('세트가 어긋난 코드는 null — 90문항 점수에 45문항 버전, 그 반대도', () => {
    const fullScoresBaseVersion = new Uint8Array([2, 50, 30, 20, 20, 20, 20, 20, 20, 30]);
    expect(decodeResult(`1w9-${toBase64Url(fullScoresBaseVersion)}`)).toBeNull();

    const baseScoresFullVersion = new Uint8Array([1, 25, 15, 9, 9, 9, 9, 9, 9, 15]);
    expect(decodeResult(`1w9-${toBase64Url(baseScoresFullVersion)}`)).toBeNull();
  });

  it('기본 45문항 점수가 5~25 범위를 벗어나면 null', () => {
    const tooLow = new Uint8Array([2, 4, 15, 9, 9, 9, 9, 9, 9, 15]);
    const tooHigh = new Uint8Array([2, 26, 15, 9, 9, 9, 9, 9, 9, 15]);
    const inRange = new Uint8Array([2, 25, 15, 9, 9, 9, 9, 9, 9, 15]);
    expect(decodeResult(`1w9-${toBase64Url(tooLow)}`)).toBeNull();
    expect(decodeResult(`1w9-${toBase64Url(tooHigh)}`)).toBeNull();
    expect(decodeResult(`1w9-${toBase64Url(inRange)}`)?.kind).toBe('legacy-base');
  });

  it('27문항 v3은 3~15 범위만 허용한다', () => {
    for (const value of [2, 16]) {
      const bytes = new Uint8Array([3, value, 9, 9, 9, 9, 9, 9, 9, 9]);
      expect(decodeResult(`1w9-${toBase64Url(bytes)}`)).toBeNull();
    }
  });

  it('점수가 10~50 범위를 벗어나면 null', () => {
    const tooLow = new Uint8Array([1, 9, 30, 20, 20, 20, 20, 20, 20, 30]);
    const tooHigh = new Uint8Array([1, 51, 30, 20, 20, 20, 20, 20, 20, 30]);
    expect(decodeResult(`1w9-${toBase64Url(tooLow)}`)).toBeNull();
    expect(decodeResult(`1w9-${toBase64Url(tooHigh)}`)).toBeNull();
  });

  it('접두사가 페이로드와 불일치하면 null', () => {
    // 페이로드는 1w9를 만들지만 접두사는 7w6이다.
    const bytes = new Uint8Array([1, 50, 30, 20, 20, 20, 20, 20, 20, 30]);
    expect(decodeResult(`7w6-${toBase64Url(bytes)}`)).toBeNull();
    expect(decodeResult(`1w2-${toBase64Url(bytes)}`)).toBeNull();
    expect(decodeResult(`1w9-${toBase64Url(bytes)}`)).not.toBeNull();
  });

  it('무작위 14자 문자열은 거의 전부 거부된다', () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    const random = makeRandom(7);
    let accepted = 0;
    for (let i = 0; i < 2000; i += 1) {
      let payload = '';
      for (let j = 0; j < 14; j += 1) {
        payload += alphabet[Math.floor(random() * alphabet.length)];
      }
      const primary = (1 + Math.floor(random() * 9)) as TypeId;
      const wing = 1 + Math.floor(random() * 9);
      if (decodeResult(`${primary}w${wing}-${payload}`) !== null) accepted += 1;
    }
    expect(accepted).toBe(0);
  });
});

/** 테스트 픽스처용 base64url 인코더 (구현과 독립적으로 작성). */
function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
