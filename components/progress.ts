import type { Likert } from '../lib/types';

/**
 * 응시 진행 상태의 저장 계약 (AC-4 / R11) + 묶음(section) 좌표계.
 *
 * ## 왜 별도 모듈인가
 * 저장본을 읽는 곳이 둘이 됐다 — `TestRunner`(복원)와 랜딩의 `ResumeNotice`
 * (이어하기 안내). 저장 키와 **문항 세트 서명** 검증이 두 곳에 복사되면 문항을
 * 바꾼 뒤 한쪽만 고쳐 엉뚱한 문항에 엉뚱한 값이 붙는다. 정본을 여기 하나로 둔다.
 *
 * ## 이 파일은 `data/questions`를 import 하지 않는다
 * 그러면 랜딩(`/`)이 이어하기 안내 하나 때문에 90문항 텍스트 전체를 클라이언트
 * 번들로 끌고 온다 — 첫 화면을 무겁게 만들어 체감 부담을 줄이려던 목적과 정반대다.
 * 대신 문항 수와 서명을 **인자로 받는다**. 부르는 쪽이 이미 문항을 알고 있다
 * (`TestRunner`는 직접 import 하고, 랜딩은 서버 컴포넌트에서 문자열로 내려준다).
 *
 * ## 묶음은 저장하지 않는다
 * 문항을 10문항씩 묶어 보여 주지만, **묶음 번호는 `index`에서 유도하는
 * 파생값**이다(`sectionOf`). 묶음을 상태로 승격시키면 `index`와 어긋날 수 있는
 * 두 번째 진실이 생긴다.
 *
 * ## `answers`는 언제나 길이 90이다 — 기본 45문항도 마찬가지
 * 기본 검사는 90칸 중 **45칸만** 채운다. 그래서 이어하기가 남은 45칸만 물으면
 * 되고, 이미 답한 문항을 다시 물을 수 없다. 저장 페이로드에 한 필드만 늘렸다 —
 * `mode`. 지금 어떤 진행 계획(기본 / 이어하기 / 전체)을 돌고 있는지는 `answers`만
 * 봐서는 복원되지 않기 때문이다. `index`는 그 **계획 안에서의** 위치이지 90칸
 * 좌표가 아니다.
 *
 * `mode`가 없는 저장본은 기본 검사(`'base'`)로 읽는다. 서명이 다른 저장본은
 * 예전처럼 조용히 버린다 — 순서가 바뀌면 서명도 바뀌므로 자동으로 그렇게 된다.
 */

export const STORAGE_KEY = 'enneagram-test.progress.v1';

/** 한 묶음의 문항 수. 90 = 10 × 9이므로 나머지 없이 떨어진다. */
export const SECTION_SIZE = 10;

export type AnswerSlot = Likert | null;

/**
 * 진행 계획. 각 값에 대응하는 문항 위치 목록은 `data/questions.ts`가 소유한다.
 * - `'base'`     기본 45문항 (유형당 5문항, 다섯 facet 각 1문항)
 * - `'continue'` 기본 검사가 묻지 않은 45문항
 * - `'full'`     90문항을 한 번에
 */
export type RunMode = 'base' | 'continue' | 'full';

export type SavedProgress = {
  signature: string;
  /** 언제나 길이 90(정본 문항 순서 좌표). */
  answers: AnswerSlot[];
  /** **계획 안에서의** 위치. 90칸 좌표가 아니다. */
  index: number;
  mode: RunMode;
};

export function toRunMode(value: unknown): RunMode {
  return value === 'continue' || value === 'full' ? value : 'base';
}

/** 저장본이 어느 문항 세트의 것인지 식별한다. 달라지면 그 저장본은 버린다. */
export function questionSetSignature(total: number, firstId: string, lastId: string): string {
  return `${total}:${firstId}:${lastId}`;
}

export function sectionCount(total: number): number {
  return Math.ceil(total / SECTION_SIZE);
}

/** 0-based 묶음 번호. 화면에 쓸 때는 +1 한다. */
export function sectionOf(index: number): number {
  return Math.floor(index / SECTION_SIZE);
}

export function emptyAnswers(total: number): AnswerSlot[] {
  return Array.from({ length: total }, () => null);
}

export function toAnswerSlot(value: unknown): AnswerSlot {
  return value === 1 || value === 2 || value === 3 || value === 4 || value === 5 ? value : null;
}

export function countAnswered(answers: readonly AnswerSlot[]): number {
  return answers.reduce<number>((count, slot) => (slot === null ? count : count + 1), 0);
}

/** 묶음 `section`(0-based) 안에서 답한 개수. */
export function countAnsweredInSection(
  answers: readonly AnswerSlot[],
  section: number,
  total: number,
): number {
  const start = section * SECTION_SIZE;
  return countAnswered(answers.slice(start, Math.min(start + SECTION_SIZE, total)));
}

/** 묶음이 통째로 채워졌는가. 건너뛴 묶음을 "완료"라 부르지 않기 위해 쓴다. */
export function isSectionComplete(
  answers: readonly AnswerSlot[],
  section: number,
  total: number,
): boolean {
  const start = section * SECTION_SIZE;
  const end = Math.min(start + SECTION_SIZE, total);
  if (end <= start) return false;
  for (let position = start; position < end; position += 1) {
    if (answers[position] === null) return false;
  }
  return true;
}

export function readProgress(expected: { signature: string; total: number }): SavedProgress | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;

    const record = parsed as Record<string, unknown>;
    if (record.signature !== expected.signature) return null;
    if (!Array.isArray(record.answers) || record.answers.length !== expected.total) return null;

    const answers = record.answers.map(toAnswerSlot);
    const rawIndex = record.index;
    const index =
      typeof rawIndex === 'number' &&
      Number.isInteger(rawIndex) &&
      rawIndex >= 0 &&
      rawIndex < expected.total
        ? rawIndex
        : 0;

    return { signature: expected.signature, answers, index, mode: toRunMode(record.mode) };
  } catch {
    return null;
  }
}

export function writeProgress(progress: SavedProgress): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // 저장에 실패해도 응시는 계속되어야 한다. 이번 세션에서 새로고침 복원만 포기한다.
  }
}

export function clearProgress(): void {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // 지우지 못해도 화면 상태는 이미 초기화됐다. 다음 쓰기가 덮어쓴다.
  }
}
