'use client';

import Link from 'next/link';
import { captureOnce } from '../lib/analytics';
import { consumeEntryKind, durationBucket } from './ProductAnalytics';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { BASE_PLAN, CONTINUE_PLAN, FULL_PLAN, questions } from '../data/questions';
import { encodeResult } from '../lib/code';
import { buildResult } from '../lib/scoring';
import type { Answer, Likert, ResultKind } from '../lib/types';

import LikertScale from './LikertScale';
import ProgressBar from './ProgressBar';
import {
  SECTION_SIZE,
  type AnswerSlot,
  type RunMode,
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
  rememberResult,
  rememberAnswerProfile,
} from './progress';

/**
 * 응시 러너 (Step 4.3 / AC-4).
 *
 * ## 상태 — 좌표계는 하나뿐이다
 * 응답은 **정본 문항 순서와 같은 길이 90의 배열**로 들고 다닌다(`null` = 미응답).
 * `data/questions.ts`가 그 순서를 고정하므로 배열 인덱스 → 문항이 1:1이고,
 * 되돌아가 고친 값의 복원이 배열 조회 한 번으로 끝난다. 제출 시점에만
 * `Answer[]`(`{ questionId, value }`)로 바꿔 `lib/scoring`에 넘긴다 —
 * 채점 계약은 문항 id 기반이므로 인덱스가 밖으로 새지 않는다.
 *
 * ## 진행 계획(plan)
 * 이 러너는 "90문항을 1번부터 센다"가 아니라 **위치 목록 하나를 순서대로
 * 돈다**. 목록은 셋이고 전부 `data/questions.ts`가 계산한다.
 *   - `base`     기본 27칸 (유형당 3문항)
 *   - `continue` 기본 검사가 묻지 않은 63칸
 *   - `full`     90칸 전부
 *
 * 세 목록이 같은 90칸 좌표를 가리키므로 **이어하기가 이미 답한 문항을 다시
 * 물을 방법이 없다** — `continue`의 좌표 집합과 `base`의 좌표 집합은 서로소다.
 * 화면 표기(n/총계, 묶음, 진행률)는 전부 "지금 도는 계획" 기준이다. 90문항을
 * 돌 때 그것은 예전 그대로 90분율이다.
 *
 * **도중에 계획을 바꾸는 길은 두지 않는다.** 진행률과 묶음 분할이 도중에 달라지면
 * 지금 어디쯤인지 읽을 수 없게 된다. 27을 고른 사람은 결과 화면에서 이어한다.
 *
 * ## 영속화 (R11)
 * 긴 모바일 세션은 언젠가 반드시 끊긴다(전화 수신, 탭 회수, 새로고침).
 * 그래서 응답이 바뀔 때마다 `sessionStorage`에 통째로 쓴다. 서버로는 아무것도
 * 보내지 않는다. 저장 계약(키·서명·검증)은 `./progress`가 정본이고, 서명이
 * 다른 저장본은 거기서 조용히 버려진다.
 *
 * 복원은 마운트 후 effect에서만 일어난다. 서버 렌더 결과와 첫 클라이언트 렌더가
 * 반드시 같아야 하므로, 복원 전에는 문항 대신 자리표시를 그린다.
 *
 * ## 묶음(section)
 * 길게 늘어선 목록은 끝이 안 보인다. 그래서 **10문항씩** 끊어 보여 준다.
 * 묶음은 새 상태가 아니라 `index`의 파생값이고(`sectionOf`), 묶음을 넘길 때
 * **탭이 하나도 늘지 않는다** — 경계에서 별도 화면을 세우는 대신 새 묶음의 첫
 * 문항 위에 완료 리본을 얹는다. 중간에 건너뛴 문항이 있으면 완료라고 하지 않는다.
 */

const TOTAL = questions.length;
const QUESTION_SET_SIGNATURE = questionSetSignature(TOTAL, questions[0].id, questions[TOTAL - 1].id);
const EXPECTED = { signature: QUESTION_SET_SIGNATURE, total: TOTAL };

const PLANS: Record<RunMode, readonly number[]> = {
  base: BASE_PLAN,
  continue: CONTINUE_PLAN,
  full: FULL_PLAN,
};

/**
 * 선택 직후 다음 문항으로 넘어가기까지의 간격.
 *
 * 고른 칸이 채워지는 것을 눈으로 확인할 시간은 주되, 그 이상은 주지 않는다.
 * 90문항이면 이 값이 그대로 90배로 쌓인다 — 180ms는 16초, 100ms는 9초다.
 */
const ADVANCE_DELAY_MS = 100;

function blankAnswers() {
  return emptyAnswers(TOTAL);
}

/** 계획 좌표로 투영한 응답. 표기·묶음 계산은 전부 이 배열 위에서 한다. */
function projectAnswers(answers: readonly AnswerSlot[], plan: readonly number[]): AnswerSlot[] {
  return plan.map((position) => answers[position]);
}

function isBaseComplete(answers: readonly AnswerSlot[]): boolean {
  return BASE_PLAN.every((position) => answers[position] !== null);
}

/**
 * 주소가 지정한 계획. `/test?continue` · `/test?full`과 값 형태(`?mode=full`)를
 * 둘 다 받는다. 아무것도 없으면 **기본 검사 27문항**이다.
 *
 * 마운트 뒤 effect 안에서만 읽는다 — 서버 렌더에는 주소의 질의 문자열이 없고,
 * 여기서 읽지 않는 덕분에 `/test`가 정적 페이지로 남는다.
 */
function modeFromLocation(): RunMode | undefined {
  if (typeof window === 'undefined') return undefined;
  const params = new URLSearchParams(window.location.search);
  if (params.has('continue') || params.get('mode') === 'continue') return 'continue';
  if (params.has('full') || params.get('mode') === 'full') return 'full';
  if (params.has('base') || params.get('mode') === 'base') return 'base';
  return undefined;
}

export type TestRunnerProps = {
  /**
   * 계획을 주소 대신 직접 지정한다(테스트용). 지정하지 않으면 주소 → 저장본 →
   * 전체판 순으로 정해진다.
   *
   * `continue`는 **기본 27문항이 실제로 채워져 있을 때만** 받아들인다. 저장본 없이
   * 이 주소로 바로 들어온 사람(다른 탭·다른 기기에서 결과 링크를 연 경우)에게
   * 남은 63문항만 묻고 끝내면 채점이 불가능한 응답이 남는다. 그때는 기본 검사로 돌린다.
   */
  requestedMode?: RunMode;
};

export default function TestRunner({ requestedMode }: TestRunnerProps = {}) {
  const router = useRouter();
  const [answers, setAnswers] = useState(blankAnswers);
  const [mode, setMode] = useState<RunMode>('base');
  const [index, setIndex] = useState(0);
  const [restored, setRestored] = useState(false);
  const [resumed, setResumed] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const startedAt = useRef<number>(0);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelAdvance = useCallback(() => {
    if (advanceTimer.current !== null) {
      clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
  }, []);

  useEffect(() => {
    const saved = readProgress(EXPECTED);
    const base = saved === null ? blankAnswers() : saved.answers;

    let nextMode: RunMode = requestedMode ?? modeFromLocation() ?? saved?.mode ?? 'base';
    if (nextMode === 'continue' && !isBaseComplete(base)) nextMode = 'base';
    const plan = PLANS[nextMode];

    let nextIndex = 0;
    if (saved !== null && saved.mode === nextMode) {
      nextIndex = Math.min(saved.index, plan.length - 1);
    } else {
      const firstOpen = plan.findIndex((position) => base[position] === null);
      nextIndex = firstOpen === -1 ? 0 : firstOpen;
    }

    setAnswers(base);
    setMode(nextMode);
    setIndex(nextIndex);
    if (countAnswered(projectAnswers(base, plan)) > 0) setResumed(true);
    setRestored(true);
  }, [requestedMode]);

  useEffect(() => {
    if (!restored) return;
    writeProgress({ signature: QUESTION_SET_SIGNATURE, answers, index, mode });
  }, [restored, answers, index, mode]);

  useEffect(() => cancelAdvance, [cancelAdvance]);

  const plan = PLANS[mode];
  const planSize = plan.length;
  const sectionTotal = sectionCount(planSize);
  const planSlots = useMemo(() => projectAnswers(answers, plan), [answers, plan]);

  const goTo = useCallback(
    (next: number) => {
      cancelAdvance();
      setIndex(Math.min(Math.max(next, 0), planSize - 1));
    },
    [cancelAdvance, planSize],
  );

  const select = useCallback(
    (value: Likert) => {
      setError(null);
      setResumed(false);
      setConfirmingReset(false);
      setAnswers((prev) => {
        const next = prev.slice();
        next[plan[index]] = value;
        return next;
      });

      cancelAdvance();
      if (index < planSize - 1) {
        advanceTimer.current = setTimeout(() => {
          advanceTimer.current = null;
          setIndex((current) => (current === index ? current + 1 : current));
        }, ADVANCE_DELAY_MS);
      }
    },
    [cancelAdvance, index, plan, planSize],
  );

  const restart = useCallback(() => {
    cancelAdvance();
    clearProgress();
    setAnswers(blankAnswers());
    // 이어하기를 지우면 근거였던 27문항도 함께 사라진다 → 기본 검사로 되돌린다.
    setMode((current) => (current === 'continue' ? 'base' : current));
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

  const answeredCount = countAnswered(planSlots);
  const testStage = mode === 'base' ? 'base' : 'detail';
  const startedKey = `enneagram:analytics:started:${testStage}`;
  useEffect(() => { startedAt.current = 0; }, [testStage]);
  useEffect(() => {
    if (!restored) return;
    if (!startedAt.current) {
      try {
        startedAt.current = Number(sessionStorage.getItem(startedKey)) || Date.now();
        sessionStorage.setItem(startedKey, String(startedAt.current));
      } catch { startedAt.current = Date.now(); }
    }
    // Consumed only when the event is actually sent, so a lost queue keeps the mark.
    captureOnce(`start:${testStage}`, 'test_started', () => ({
      test_stage: testStage, entry_kind: consumeEntryKind(), resumed,
    }));
    for (const milestone of [25, 50, 75, 100]) {
      if (answeredCount * 100 >= planSize * milestone) {
        captureOnce(`progress:${testStage}:${milestone}`, 'test_progress_reached', {
          test_stage: testStage, progress_percent: milestone,
          question_index: Math.ceil(planSize * milestone / 100),
          elapsed_bucket: durationBucket(startedAt.current),
        });
      }
    }
  }, [restored, testStage, startedKey, resumed, answeredCount, planSize]);

  const allAnswered = answeredCount === planSize;
  const firstUnanswered = planSlots.findIndex((slot) => slot === null);

  /** 기본 검사만 27문항 결과다. 이어하기는 90칸이 다 차므로 전체 결과를 낸다. */
  const resultKind: ResultKind = mode === 'base' ? 'base' : 'full';

  const submit = useCallback(() => {
    cancelAdvance();
    const open = plan.findIndex((position) => answers[position] === null);
    if (open !== -1) {
      setError(`${open + 1}번 문항이 아직 비어 있어요.`);
      setIndex(open);
      return;
    }

    const scored = resultKind === 'base' ? BASE_PLAN : FULL_PLAN;
    const payload: Answer[] = [];
    for (const position of scored) {
      const value = answers[position];
      if (value === null) {
        setError('아직 채워지지 않은 문항이 있어 결과를 낼 수 없어요.');
        return;
      }
      payload.push({ questionId: questions[position].id, value });
    }

    setSubmitting(true);
    try {
      const result = buildResult(payload, resultKind);
      const code = encodeResult(result);
      rememberResult(code);
      rememberAnswerProfile(code, answers);
      captureOnce(`complete:${testStage}`, 'test_completed', {
        test_stage: testStage, duration_bucket: durationBucket(startedAt.current),
        primary_type: result.primaryType, ambiguous_result: result.ambiguous,
      });
      // A later attempt in this tab must not inherit this start time.
      try { sessionStorage.removeItem(startedKey); } catch { /* Optional measurement. */ }
      router.push(`/result/${code}`);
    } catch {
      setSubmitting(false);
      setError('결과를 만드는 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.');
    }
  }, [answers, cancelAdvance, plan, resultKind, router, testStage, startedKey]);

  const question = questions[plan[index]];
  const showFinishPanel = allAnswered || index === planSize - 1;

  const section = sectionOf(index);
  const sectionAnswered = countAnsweredInSection(planSlots, section, planSize);
  const sectionSize = Math.min(SECTION_SIZE, planSize - section * SECTION_SIZE);
  const crossedSection =
    !resumed &&
    index % SECTION_SIZE === 0 &&
    section > 0 &&
    isSectionComplete(planSlots, section - 1, planSize);
  const remainingSections = sectionTotal - section;

  return (
    <div className="ph-no-capture flex min-h-[100svh] flex-col bg-paper">
      <header className="sticky top-0 z-10 border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto w-full max-w-[34rem] px-5 py-3.5 sm:px-8">
          <div className="flex items-baseline justify-between gap-4">
            <Link
              href="/"
              className="press text-[0.875rem] font-medium text-ink-faint hover:text-ink-soft"
            >
              ← 소개로
            </Link>
            {/* 계획은 복원 시점에야 정해진다. 그 전에 숫자를 적으면 27문항으로
                들어온 사람에게 `1/90`을 한 프레임 보여 주게 된다. */}
            {restored ? (
              <p className="tnum text-[1rem] font-bold tracking-[-0.02em] text-ink">
                {index + 1}
                <span className="font-medium text-ink-faint">/{planSize}</span>
              </p>
            ) : null}
          </div>
          {restored ? (
            <>
              <div className="mt-2.5">
                <ProgressBar value={answeredCount} max={planSize} segments={sectionTotal} />
              </div>
              <p className="tnum mt-2 text-[0.75rem] font-medium text-ink-faint">
                <span className="font-bold text-ink-soft">
                  묶음 {section + 1}/{sectionTotal}
                </span>
                {' · '}이 묶음에서 {sectionAnswered}/{sectionSize}문항
              </p>
            </>
          ) : null}
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[34rem] flex-1 flex-col px-5 pb-12 pt-8 sm:px-8 sm:pt-10">
        {!restored ? (
          <p className="pt-10 text-[0.9375rem] text-ink-faint">문항을 불러오는 중이에요…</p>
        ) : (
          <>
            {mode === 'continue' && !resumed ? (
              <p className="animate-item-in mb-7 rounded-card bg-sub p-5 text-[0.9375rem] leading-[1.7] text-ink-soft">
                <span className="font-bold text-ink">
                  이미 답한 {BASE_PLAN.length}문항은 그대로 두고, 남은 {planSize}문항만 물어요.
                </span>{' '}
                끝나면 {TOTAL}문항 전체 결과가 나와요.
              </p>
            ) : null}

            {resumed ? (
              <div className="animate-item-in mb-7 rounded-card bg-sub p-5">
                <p className="text-[0.9375rem] leading-[1.6] text-ink">
                  <span className="font-bold">이어서 답하는 중이에요.</span>{' '}
                  <span className="tnum text-ink-soft">
                    {planSize}문항 중 {answeredCount}문항을 답해 두었어요.
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
                  <span className="tnum font-bold">{section}번째 묶음</span>을 끝냈어요.{' '}
                  {remainingSections === 1 ? (
                    <>이제 마지막 묶음, {sectionSize}문항 남았어요.</>
                  ) : (
                    <span className="tnum text-ink-soft">{remainingSections}묶음 남았어요.</span>
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
              <LikertScale name={question.id} value={planSlots[index]} onChange={select} />
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
              {index === planSize - 1 ? (
                <button
                  type="button"
                  onClick={submit}
                  disabled={!allAnswered || submitting}
                  className="press min-h-[3.25rem] flex-1 rounded-control bg-primary text-[0.9375rem] font-bold text-white hover:bg-primary-press disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-faint disabled:hover:bg-line"
                >
                  {submitting ? '결과를 여는 중…' : '완료'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => goTo(index + 1)}
                  className="press min-h-[3.25rem] flex-1 rounded-control bg-sub text-[0.9375rem] font-bold text-ink-soft hover:bg-line/60"
                >
                  다음
                </button>
              )}
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
                    {mode === 'base'
                      ? `${planSize}문항에 모두 답했어요. 답변과 결과 링크는 서버에 저장하지 않고, 서비스 개선용 익명 사용 통계만 수집해요. 이어서 나머지 ${TOTAL - planSize}문항을 답하면 더 다양한 상황을 살펴볼 수 있어요.`
                      : `${TOTAL}문항에 모두 답했어요. 답변과 결과 링크는 서버에 저장하지 않고, 서비스 개선용 익명 사용 통계만 수집해요.`}
                  </p>
                ) : (
                  <p className="text-[0.9375rem] leading-[1.6] text-ink-soft">
                    아직 {planSize - answeredCount}문항이 비어 있어 결과를 낼 수 없어요.{' '}
                    <button
                      type="button"
                      onClick={() => goTo(firstUnanswered)}
                      className="font-bold text-primary underline underline-offset-4 hover:text-primary-press"
                    >
                      {firstUnanswered + 1}번 문항으로 이동
                    </button>
                  </p>
                )}
              </div>
            ) : null}

            <p className="mt-10 text-[0.8125rem] leading-[1.7] text-ink-faint">
              고민이 길어지면 처음 떠오른 쪽을 고르세요. 최대 {SECTION_SIZE}문항씩{' '}
              {sectionTotal}묶음으로 나뉘어 있고, 같은 탭에서는 새로고침하거나 잠시 나갔다 와도
              이어서 답할 수 있어요. 키보드를 쓴다면 1–5 키로 바로 선택할 수 있어요.
            </p>
          </>
        )}
      </main>
    </div>
  );
}
