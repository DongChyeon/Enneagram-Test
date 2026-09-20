'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { questions } from '../data/questions';
import { encodeResult } from '../lib/code';
import { buildResult } from '../lib/scoring';
import type { Answer, Likert } from '../lib/types';

import LikertScale from './LikertScale';
import ProgressBar from './ProgressBar';

/**
 * 90문항 응시 러너 (Step 4.3 / AC-4).
 *
 * ## 상태
 * 응답은 **문항 순서와 같은 길이 90의 배열**로 들고 다닌다(`null` = 미응답).
 * `data/questions.ts`가 순서를 고정하므로 배열 인덱스 → 문항이 1:1이고,
 * 되돌아가 고친 값의 복원이 배열 조회 한 번으로 끝난다. 제출 시점에만
 * `Answer[]`(`{ questionId, value }`)로 바꿔 `lib/scoring`에 넘긴다 —
 * 채점 계약은 문항 id 기반이므로 인덱스가 밖으로 새지 않는다.
 *
 * ## 영속화 (R11)
 * 90문항짜리 모바일 세션은 언젠가 반드시 끊긴다(전화 수신, 탭 회수, 새로고침).
 * 그래서 응답이 바뀔 때마다 `sessionStorage`에 통째로 쓴다. 서버로는 아무것도
 * 보내지 않으므로 "응답을 서버에 저장하지 않는다"는 제약과 충돌하지 않는다.
 *
 * 저장 페이로드에는 **문항 세트 서명**이 들어간다(문항 수 + 첫/마지막 id).
 * 문항이 바뀐 뒤 옛 응답을 되살리면 엉뚱한 문항에 엉뚱한 값이 붙으므로,
 * 서명이 다르면 조용히 버린다. 읽기·쓰기는 전부 try/catch다 — 시크릿 모드나
 * 사이트 데이터 차단 환경에서 `sessionStorage` 접근 자체가 던질 수 있고,
 * 그때도 화면은 "저장이 안 될 뿐 정상 동작"이어야 한다.
 *
 * 복원은 마운트 후 effect에서만 일어난다. 서버 렌더 결과와 첫 클라이언트 렌더가
 * 반드시 같아야 하므로, 복원 전에는 문항 대신 자리표시를 그린다.
 */

const TOTAL = questions.length;
const STORAGE_KEY = 'enneagram-test.progress.v1';
const QUESTION_SET_SIGNATURE = `${TOTAL}:${questions[0].id}:${questions[TOTAL - 1].id}`;

/** 선택 직후 다음 문항으로 넘어가기까지의 간격. 90문항의 탭 수를 절반으로 줄인다. */
const ADVANCE_DELAY_MS = 180;

type AnswerSlot = Likert | null;

type SavedProgress = {
  signature: string;
  answers: AnswerSlot[];
  index: number;
};

function emptyAnswers(): AnswerSlot[] {
  return Array.from({ length: TOTAL }, () => null);
}

function toAnswerSlot(value: unknown): AnswerSlot {
  return value === 1 || value === 2 || value === 3 || value === 4 || value === 5 ? value : null;
}

function readProgress(): SavedProgress | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;

    const record = parsed as Record<string, unknown>;
    if (record.signature !== QUESTION_SET_SIGNATURE) return null;
    if (!Array.isArray(record.answers) || record.answers.length !== TOTAL) return null;

    const answers = record.answers.map(toAnswerSlot);
    const rawIndex = record.index;
    const index =
      typeof rawIndex === 'number' && Number.isInteger(rawIndex) && rawIndex >= 0 && rawIndex < TOTAL
        ? rawIndex
        : 0;

    return { signature: QUESTION_SET_SIGNATURE, answers, index };
  } catch {
    return null;
  }
}

function writeProgress(progress: SavedProgress): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // 저장에 실패해도 응시는 계속되어야 한다. 이번 세션에서 새로고침 복원만 포기한다.
  }
}

export default function TestRunner() {
  const router = useRouter();
  const [answers, setAnswers] = useState<AnswerSlot[]>(emptyAnswers);
  const [index, setIndex] = useState(0);
  const [restored, setRestored] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelAdvance = useCallback(() => {
    if (advanceTimer.current !== null) {
      clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
  }, []);

  useEffect(() => {
    const saved = readProgress();
    if (saved !== null) {
      setAnswers(saved.answers);
      setIndex(saved.index);
    }
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored) return;
    writeProgress({ signature: QUESTION_SET_SIGNATURE, answers, index });
  }, [restored, answers, index]);

  useEffect(() => cancelAdvance, [cancelAdvance]);

  const goTo = useCallback(
    (next: number) => {
      cancelAdvance();
      setIndex(Math.min(Math.max(next, 0), TOTAL - 1));
    },
    [cancelAdvance],
  );

  const select = useCallback(
    (value: Likert) => {
      setError(null);
      setAnswers((prev) => {
        const next = prev.slice();
        next[index] = value;
        return next;
      });

      cancelAdvance();
      if (index < TOTAL - 1) {
        advanceTimer.current = setTimeout(() => {
          advanceTimer.current = null;
          setIndex((current) => (current === index ? current + 1 : current));
        }, ADVANCE_DELAY_MS);
      }
    },
    [cancelAdvance, index],
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      if (target instanceof HTMLElement && target.isContentEditable) return;
      if (target instanceof HTMLInputElement && target.type !== 'radio') return;
      if (target instanceof HTMLTextAreaElement) return;
      const slot = toAnswerSlot(Number(event.key));
      if (slot === null) return;
      event.preventDefault();
      select(slot);
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [select]);

  const answeredCount = answers.reduce<number>((total, slot) => (slot === null ? total : total + 1), 0);
  const allAnswered = answeredCount === TOTAL;
  const firstUnanswered = answers.findIndex((slot) => slot === null);

  const submit = useCallback(() => {
    cancelAdvance();
    const payload: Answer[] = [];
    for (let position = 0; position < TOTAL; position += 1) {
      const value = answers[position];
      if (value === null) {
        setError(`${position + 1}번 문항이 아직 비어 있습니다.`);
        setIndex(position);
        return;
      }
      payload.push({ questionId: questions[position].id, value });
    }

    setSubmitting(true);
    try {
      const code = encodeResult(buildResult(payload));
      router.push(`/result/${code}`);
    } catch {
      setSubmitting(false);
      setError('결과를 만드는 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요.');
    }
  }, [answers, cancelAdvance, router]);

  const question = questions[index];
  const showFinishPanel = allAnswered || index === TOTAL - 1;

  return (
    <div className="flex min-h-[100svh] flex-col bg-paper">
      <header className="sticky top-0 z-10 border-b border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto w-full max-w-[34rem] px-5 py-3.5 sm:px-8">
          <div className="flex items-baseline justify-between gap-4">
            <Link
              href="/"
              className="text-[0.75rem] font-medium text-ink-faint transition-colors hover:text-ink-soft"
            >
              ← 소개로
            </Link>
            <p className="tnum text-[0.9375rem] font-semibold text-ink">
              {index + 1}
              <span className="font-normal text-ink-faint">/{TOTAL}</span>
            </p>
          </div>
          <div className="mt-2.5">
            <ProgressBar value={answeredCount} max={TOTAL} />
          </div>
          <p className="tnum mt-1.5 text-[0.6875rem] text-ink-faint">
            응답 완료 {answeredCount}개 · 남은 문항 {TOTAL - answeredCount}개
          </p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[34rem] flex-1 flex-col px-5 pb-10 pt-8 sm:px-8 sm:pt-10">
        {!restored ? (
          <p className="pt-10 text-[0.9375rem] text-ink-faint">문항을 불러오는 중입니다…</p>
        ) : (
          <>
            <fieldset key={question.id} className="animate-item-in">
              <legend className="mb-7 w-full">
                <span className="tnum block text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-accent">
                  Question {index + 1}
                </span>
                <span className="mt-3 block text-[1.3125rem] font-semibold leading-[1.6] tracking-[-0.01em] text-ink sm:text-[1.5rem]">
                  {question.text}
                </span>
              </legend>
              <LikertScale name={question.id} value={answers[index]} onChange={select} />
            </fieldset>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                disabled={index === 0}
                className="min-h-[3rem] flex-1 rounded-lg border border-line bg-surface text-[0.9375rem] font-semibold text-ink-soft transition-colors duration-150 hover:border-line-strong disabled:cursor-not-allowed disabled:border-line disabled:bg-transparent disabled:text-ink-faint/60 disabled:hover:border-line"
              >
                이전
              </button>
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                disabled={index === TOTAL - 1}
                className="min-h-[3rem] flex-1 rounded-lg border border-line bg-surface text-[0.9375rem] font-semibold text-ink-soft transition-colors duration-150 hover:border-line-strong disabled:cursor-not-allowed disabled:border-line disabled:bg-transparent disabled:text-ink-faint/60 disabled:hover:border-line"
              >
                다음
              </button>
            </div>

            <div aria-live="polite" className="mt-4">
              {error !== null ? (
                <p className="rounded-lg border border-line-strong bg-surface px-4 py-3 text-[0.875rem] leading-[1.6] text-ink">
                  {error}
                </p>
              ) : null}
            </div>

            {showFinishPanel ? (
              <div className="mt-2 rounded-lg border border-line bg-surface p-4">
                {allAnswered ? (
                  <p className="text-[0.875rem] leading-[1.6] text-ink-soft">
                    {TOTAL}문항에 모두 답했습니다. 결과는 링크 주소 안에 담기며 서버에 저장되지 않습니다.
                  </p>
                ) : (
                  <p className="text-[0.875rem] leading-[1.6] text-ink-soft">
                    아직 {TOTAL - answeredCount}문항이 비어 있어 결과를 낼 수 없습니다.{' '}
                    <button
                      type="button"
                      onClick={() => goTo(firstUnanswered)}
                      className="font-semibold text-accent underline underline-offset-4"
                    >
                      {firstUnanswered + 1}번 문항으로 이동
                    </button>
                  </p>
                )}
                <button
                  type="button"
                  onClick={submit}
                  disabled={!allAnswered || submitting}
                  className="mt-3 min-h-[3.25rem] w-full rounded-lg bg-accent text-[1rem] font-semibold text-white transition-colors duration-150 hover:bg-accent-strong disabled:cursor-not-allowed disabled:bg-line-strong disabled:text-white/80 disabled:hover:bg-line-strong"
                >
                  {submitting ? '결과를 여는 중…' : '결과 보기'}
                </button>
              </div>
            ) : null}

            <p className="mt-8 text-[0.75rem] leading-[1.7] text-ink-faint">
              고민이 길어지면 처음 떠오른 쪽을 고르세요. 같은 탭에서는 새로고침해도 이어서 답할 수 있고,
              키보드를 쓴다면 1–5 키로 바로 선택할 수 있습니다.
            </p>
          </>
        )}
      </main>
    </div>
  );
}
