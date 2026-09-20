/**
 * 폰트 서브셋 회귀 검사 (ADR Consequences).
 *
 * `assets/fonts/*.otf`는 **커밋된 바이너리**다. 유형명·윙 설명·카드 고정 문구를
 * 한 글자라도 고치면 커밋된 서브셋이 조용히 낡아 OG 이미지 18장 전부에
 * 두부(□)가 생긴다. 커밋된 `docs/og-sample.png`는 재생성되지 않으므로 이
 * 회귀를 전혀 잡지 못한다 — 그래서 이 스크립트가 `prebuild`의 첫 단계다.
 *
 * 하는 일: `data/types.ts` ∪ `data/wings.ts` ∪ 카드 고정 문구 ∪ 숫자 ∪ 라틴
 * 기본의 **모든 유니크 문자**를 데이터에서 다시 계산해, 서브셋 폰트의 cmap에
 * 전부 존재하는지 단언한다. 없으면 누락 문자를 출력하고 비영 종료한다.
 *
 * `--print`를 주면 검사 대신 글리프 집합을 표준출력으로 내보낸다.
 * `pyftsubset --text-file=-` 입력으로 쓰는 경로이며, 이것이 "서브셋 생성"과
 * "서브셋 검사"가 같은 집합을 쓴다는 보장이다(생성 명령은 `docs/licenses.md`).
 */

import { readFileSync } from 'node:fs';

import { CARD_FIXED_STRINGS } from '../components/ShareCardArt';
import { facets, types } from '../data/types';
import { wings } from '../data/wings';

/** 서브셋 폰트 경로. 모듈 스코프 상수 — `process.cwd()` 결합을 쓰지 않는다. */
export const FONT_FILES = ['pretendard-subset-regular.otf', 'pretendard-subset-bold.otf'] as const;

function fontUrl(file: string): URL {
  return new URL(`../assets/fonts/${file}`, import.meta.url);
}

/** 객체 안의 모든 문자열 값을 재귀 수집한다. */
function collectStrings(value: unknown, out: string[]): void {
  if (typeof value === 'string') {
    out.push(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, out);
    return;
  }
  if (value !== null && typeof value === 'object') {
    for (const item of Object.values(value)) collectStrings(item, out);
  }
}

/**
 * 렌더 대상 문자 집합. 정렬된 배열로 돌려준다(결정적 출력 — 서브셋 재생성이
 * 같은 입력에서 같은 바이트를 내야 diff가 의미를 갖는다).
 */
export function requiredGlyphs(): string[] {
  const strings: string[] = [];
  collectStrings(types, strings);
  collectStrings(facets, strings);
  collectStrings(wings, strings);
  strings.push(...CARD_FIXED_STRINGS);

  const set = new Set<string>();
  for (const text of strings) {
    for (const ch of text) set.add(ch);
  }
  // 숫자 · 라틴 기본(ASCII 출력 가능 범위) — 점수·윙 라벨·파일명이 쓴다.
  for (let code = 0x20; code <= 0x7e; code += 1) set.add(String.fromCharCode(code));

  return [...set].sort();
}

/**
 * `.otf`/`.ttf`의 cmap에서 커버되는 코드포인트 집합을 읽는다.
 * format 4와 12만 읽으면 충분하다 — Pretendard 서브셋이 내는 형식이다.
 */
export function cmapCodePoints(bytes: Buffer): Set<number> {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const numTables = view.getUint16(4);
  let cmapOffset = -1;
  for (let i = 0; i < numTables; i += 1) {
    const rec = 12 + i * 16;
    const tag = bytes.toString('ascii', rec, rec + 4);
    if (tag === 'cmap') {
      cmapOffset = view.getUint32(rec + 8);
      break;
    }
  }
  if (cmapOffset < 0) throw new Error('cmap 테이블이 없다');

  const covered = new Set<number>();
  const numSubtables = view.getUint16(cmapOffset + 2);
  for (let i = 0; i < numSubtables; i += 1) {
    const enc = cmapOffset + 4 + i * 8;
    const subtable = cmapOffset + view.getUint32(enc + 4);
    const format = view.getUint16(subtable);

    if (format === 4) {
      const segCountX2 = view.getUint16(subtable + 6);
      const segCount = segCountX2 / 2;
      const endBase = subtable + 14;
      const startBase = endBase + segCountX2 + 2;
      const deltaBase = startBase + segCountX2;
      const rangeBase = deltaBase + segCountX2;
      for (let seg = 0; seg < segCount; seg += 1) {
        const end = view.getUint16(endBase + seg * 2);
        const start = view.getUint16(startBase + seg * 2);
        if (start === 0xffff) continue;
        const delta = view.getInt16(deltaBase + seg * 2);
        const rangeOffset = view.getUint16(rangeBase + seg * 2);
        for (let cp = start; cp <= end; cp += 1) {
          let glyphId: number;
          if (rangeOffset === 0) {
            glyphId = (cp + delta) & 0xffff;
          } else {
            const addr = rangeBase + seg * 2 + rangeOffset + (cp - start) * 2;
            if (addr + 1 >= bytes.byteLength) continue;
            const raw = view.getUint16(addr);
            glyphId = raw === 0 ? 0 : (raw + delta) & 0xffff;
          }
          if (glyphId !== 0) covered.add(cp);
        }
      }
    } else if (format === 12) {
      const nGroups = view.getUint32(subtable + 12);
      for (let g = 0; g < nGroups; g += 1) {
        const base = subtable + 16 + g * 12;
        const start = view.getUint32(base);
        const end = view.getUint32(base + 4);
        for (let cp = start; cp <= end; cp += 1) covered.add(cp);
      }
    }
  }
  return covered;
}

function main(): void {
  const glyphs = requiredGlyphs();

  if (process.argv.includes('--print')) {
    process.stdout.write(glyphs.join(''));
    return;
  }

  let failed = false;
  for (const file of FONT_FILES) {
    const bytes = readFileSync(fontUrl(file));
    const covered = cmapCodePoints(bytes);
    const missing = glyphs.filter((ch) => !covered.has(ch.codePointAt(0) as number));
    if (missing.length > 0) {
      failed = true;
      console.error(`[check-glyphs] ${file}: 누락 글리프 ${missing.length}자`);
      console.error(`[check-glyphs]   ${missing.join(' ')}`);
    } else {
      console.log(`[check-glyphs] ${file}: OK (${glyphs.length}자 전부 cmap에 존재)`);
    }
  }

  if (failed) {
    console.error(
      '[check-glyphs] 서브셋이 데이터보다 낡았다. docs/licenses.md의 재생성 명령을 다시 실행할 것.',
    );
    process.exit(1);
  }
}

// `--print`/검사 양쪽 모두 CLI 진입점에서만 실행한다(테스트가 import해도 안전하도록).
if (process.argv[1] !== undefined && process.argv[1].endsWith('check-glyphs.ts')) {
  main();
}
