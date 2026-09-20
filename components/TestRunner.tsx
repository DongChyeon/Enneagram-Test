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
import {
  SECTION_SIZE,
  clearProgress,
  countAnswered,
  countAnsweredInSection,
  emptyAnswers,
  isSectionComplete,
  questionSetSignature,
  readProgress,
  sectionCount,
  sectionOf,
  toAnswerSlot,
  writeProgress,
} from './progress';

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
 * 저장 계약(키·서명·검증)은 `./progress`가 정본이다 — 랜딩의 이어하기 안내와
 * 같은 코드를 쓴다. 서명이 다른 저장본은 거기서 조용히 버려진다.
 *
 * 복원은 마운트 후 effect에서만 일어난다. 서버 렌더 결과와 첫 클라이언트 렌더가
 * 반드시 같아야 하므로, 복원 전에는 문항 대신 자리표시를 그린다.
 *
 * ## 묶음(section)
 * 90을 한 줄로 세면 길다. 그래서 **10문항 × 9묶음**으로 끊어 보여 준다.
 * 다만 묶음은 새 상태가 아니라 `index`의 파생값이고(`sectionOf`), 묶음을
 * 넘길 때 **탭이 하나도 늘지 않는다** — 경계에서 별도 화면을 세우는 대신
 * 새 묶음의 첫 문항 위에 완료 리본을 얹는다. 다음으로 나아가는 행위가 곧
 * 리본을 지나가는 행위다. 중간에 건너뛴 문항이 있으면 완료라고 말하지 않는다.
 */

const TOTAL = questions.length;
const SECTION_COUNT = sectionCount(TOTAL);
const QUESTION_SET_SIGNATURE = questionSetSignature(TOTAL, questions[0].id, questions[TOTAL - 1].id);
const EXPECTED = { signature: QUESTION_SET_SIGNATURE, total: TOTAL };

/** 선택 직후 다음 문항으로 넘어가기까지의 간격. 90문항의 탭 수를 절반으로 줄인다. */
const ADVANCE_DELAY_MS = 180;

function blankAnswers() {
  return emptyAnswers(TOTAL);
}

export default function TestRunner() {
  const router = useRouter();
  const [answers, setAnswers] = useState(blankAnswers);
  const [index, setIndex] = useState(0);
  const [restored, setRestored] = useState(false);
  const [resumed, setResumed] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);
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
    const saved = readProgress(EXPECTED);
    if (saved !== null) {
      setAnswers(saved.answers);
      setIndex(saved.index);
      // 빈 저장본(막 시작해 아무것도 안 고른 상태)까지 "이어서 하는 중"이라 말하면 거짓말이다.
      if (countAnswered(saved.answers) > 0) setResumed(true);
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
      setResumed(false);
      setConfirmingReset(false);
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

  const restart = useCallback(() => {
    cancelAdvance();
    clearProgress();
    setAnswers(blankAnswers());
    setIndex(0);
    setError(null);
    setResumed(false);
    setConfirmingReset(false);
  }, [cancelAdvance]);

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

  const answeredCount = countAnswered(answers);
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

  const section = sectionOf(index);
  const sectionAnswered = countAnsweredInSection(answers, section, TOTAL);
  const sectionSize = Math.min(SECTION_SIZE, TOTAL - section * SECTION_SIZE);
  // 묶음의 첫 문항이고, **직전 묶음이 빠짐없이 채워졌을 때만** 완료를 말한다.
  // 이어하기 안내가 떠 있을 땐 양보한다 — 문항 위에 배너 둘이 쌓이면 844px 화면에서
  // 정작 답할 문장이 접히는 아래로 밀린다. 부담을 줄이려고 얹은 것이 부담이 되면 안 된다.
  const crossedSection =
    !resumed &&
    index % SECTION_SIZE === 0 &&
    section > 0 &&
    isSectionComplete(answers, section - 1, TOTAL);
  const remainingSections = SECTION_COUNT - section;

  return (
    <div className="flex min-h-[100svh] flex-col bg-paper">
      {/*
        상단 고정 막대. 90문항 내내 한 번도 사라지지 않는 유일한 면이라
        내용을 세 줄로 제한한다: 지금 몇 번째인가 · 전체 진척 · 이 묶음의 진척.
      */}
      <header className="sticky top-0 z-10 border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto w-full max-w-[34rem] px-5 py-3.5 sm:px-8">
          <div className="flex items-baseline justify-between gap-4">
            <Link
              href="/"
              className="press text-[0.875rem] font-medium text-ink-faint hover:text-ink-soft"
            >
              ← 소개로
            </Link>
            <p className="tnum text-[1rem] font-bold tracking-[-0.02em] text-ink">
              {index + 1}
              <span className="font-medium text-ink-faint">/{TOTAL}</span>
            </p>
          </div>
          <div className="mt-2.5">
            <ProgressBar value={answeredCount} max={TOTAL} segments={SECTION_COUNT} />
          </div>
          <p className="tnum mt-2 text-[0.75rem] font-medium text-ink-faint">
            <span className="font-bold text-ink-soft">
              묶음 {section + 1}/{SECTION_COUNT}
            </span>
            {' · '}이 묶음에서 {sectionAnswered}/{sectionSize}문항
          </p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[34rem] flex-1 flex-col px-5 pb-12 pt-8 sm:px-8 sm:pt-10">
        {!restored ? (
          <p className="pt-10 text-[0.9375rem] text-ink-faint">문항을 불러오는 중입니다…</p>
        ) : (
          <>
            {resumed ? (
              <div className="animate-item-in mb-7 rounded-card bg-sub p-5">
                <p className="text-[0.9375rem] leading-[1.6] text-ink">
                  <span className="font-bold">이어서 답하는 중입니다.</span>{' '}
                  <span className="tnum text-ink-soft">
                    {TOTAL}문항 중 {answeredCount}문항을 답해 두었습니다.
                  </span>
                </p>
                {confirmingReset ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={restart}
                      className="press min-h-[3rem] flex-1 rounded-control bg-white px-4 text-[0.9375rem] font-bold text-ink hover:bg-line/50"
                    >
                      지우고 1번부터
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingReset(false)}
                      className="press min-h-[3rem] flex-1 rounded-control px-4 text-[0.9375rem] font-bold text-ink-faint hover:text-ink-soft"
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmingReset(true)}
                    className="mt-3 text-[0.875rem] font-bold text-primary underline underline-offset-4 hover:text-primary-press"
                  >
                    처음부터 다시 하기
                  </button>
                )}
              </div>
            ) : null}

            {/*
              묶음 완료 리본. 앞 묶음을 **실제로 다 채웠을 때만** 뜬다.
              면은 회색이고 파랑은 체크 하나뿐이다 — 이 줄은 읽을 것이지
              누를 것이 아니므로 파랑을 면으로 깔지 않는다.
            */}
            {crossedSection ? (
              <p
                role="status"
                className="animate-item-in mb-7 flex items-center gap-3 rounded-card bg-sub px-5 py-4 text-[0.9375rem] leading-[1.6] text-ink"
              >
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[0.75rem] font-bold text-white"
                >
                  ✓
                </span>
                <span>
                  <span className="tnum font-bold">{section}번째 묶음</span>을 끝냈습니다.{' '}
                  {remainingSections === 1 ? (
                    <>이제 마지막 묶음, {sectionSize}문항 남았습니다.</>
                  ) : (
                    <span className="tnum text-ink-soft">{remainingSections}묶음 남았습니다.</span>
                  )}
                </span>
              </p>
            ) : null}

            <fieldset key={question.id} className="animate-item-in">
              <legend className="mb-7 w-full">
                <span className="block text-[1.375rem] font-bold leading-[1.45] tracking-[-0.02em] text-ink sm:text-[1.625rem]">
                  {question.text}
                </span>
              </legend>
              <LikertScale name={question.id} value={answers[index]} onChange={select} />
            </fieldset>

            <div className="mt-7 flex gap-2">
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                disabled={index === 0}
                className="press min-h-[3.25rem] flex-1 rounded-control bg-sub text-[0.9375rem] font-bold text-ink-soft hover:bg-line/60 disabled:cursor-not-allowed disabled:bg-sub disabled:text-ink-faint/50 disabled:hover:bg-sub"
              >
                이전
              </button>
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                disabled={index === TOTAL - 1}
                className="press min-h-[3.25rem] flex-1 rounded-control bg-sub text-[0.9375rem] font-bold text-ink-soft hover:bg-line/60 disabled:cursor-not-allowed disabled:bg-sub disabled:text-ink-faint/50 disabled:hover:bg-sub"
              >
                다음
              </button>
            </div>

            <div aria-live="polite" className="mt-4">
              {error !== null ? (
                <p className="rounded-control bg-sub px-4 py-3.5 text-[0.875rem] font-medium leading-[1.6] text-ink">
                  {error}
                </p>
              ) : null}
            </div>

            {showFinishPanel ? (
              <div className="mt-3 rounded-card bg-sub p-5">
                {allAnswered ? (
                  <p className="text-[0.9375rem] leading-[1.6] text-ink-soft">
                    {TOTAL}문항에 모두 답했습니다. 결과는 링크 주소 안에 담기며 서버에 저장되지 않습니다.
                  </p>
                ) : (
                  <p className="text-[0.9375rem] leading-[1.6] text-ink-soft">
                    아직 {TOTAL - answeredCount}문항이 비어 있어 결과를 낼 수 없습니다.{' '}
                    <button
                      type="button"
                      onClick={() => goTo(firstUnanswered)}
                      className="font-bold text-primary underline underline-offset-4 hover:text-primary-press"
                    >
                      {firstUnanswered + 1}번 문항으로 이동
                    </button>
                  </p>
                )}
                <button
                  type="button"
                  onClick={submit}
                  disabled={!allAnswered || submitting}
                  className="press mt-4 min-h-[3.5rem] w-full rounded-control bg-primary text-[1.0625rem] font-bold tracking-[-0.01em] text-white hover:bg-primary-press disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-faint disabled:hover:bg-line"
                >
                  {submitting ? '결과를 여는 중…' : '결과 보기'}
                </button>
              </div>
            ) : null}

            <p className="mt-10 text-[0.8125rem] leading-[1.7] text-ink-faint">
              고민이 길어지면 처음 떠오른 쪽을 고르세요. {SECTION_SIZE}문항씩 {SECTION_COUNT}묶음으로
              나뉘어 있고, 같은 탭에서는 새로고침하거나 잠시 나갔다 와도 이어서 답할 수 있습니다.
              키보드를 쓴다면 1–5 키로 바로 선택할 수 있습니다.
            </p>
          </>
        )}
      </main>
    </div>
  );
}
