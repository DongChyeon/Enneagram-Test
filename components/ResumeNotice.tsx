'use client';

import { useEffect, useState } from 'react';

import { SECTION_SIZE, clearProgress, countAnswered, readProgress, sectionCount } from './progress';

/**
 * 랜딩의 이어하기 안내.
 *
 * 저장본이 없거나 서명이 어긋나면 **아무것도 그리지 않는다** — 처음 온 사람에게
 * 없는 기록을 있다고 말하지 않기 위해서다.
 *
 * 색: 이 상자는 알림이지 행동이 아니므로 파랑을 면으로 깔지 않는다. 회색 면
 * 위에서 파랑은 "처음부터 다시 하기" 한 군데, 누를 수 있는 것에만 쓴다.
 */
export default function ResumeNotice({ total, signature }: { total: number; signature: string }) {
  const [answered, setAnswered] = useState<number | null>(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const saved = readProgress({ signature, total });
    if (saved === null) return;
    const count = countAnswered(saved.answers);
    if (count > 0) setAnswered(count);
  }, [signature, total]);

  if (answered === null) return null;

  const sections = sectionCount(total);
  const section = Math.min(Math.floor(answered / SECTION_SIZE) + 1, sections);

  return (
    <div className="animate-rise-in mt-7 rounded-card bg-sub p-5">
      <p className="text-[1rem] font-bold leading-[1.5] text-ink">답하다 만 기록이 남아 있어요</p>
      <p className="tnum mt-1.5 text-[0.9375rem] leading-[1.6] text-ink-soft">
        {total}문항 중 {answered}문항 · {sections}묶음 중 {section}번째 묶음까지 왔어요. 아래
        버튼을 누르면 멈춘 자리에서 이어서 답해요.
      </p>
      {confirming ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              clearProgress();
              setAnswered(null);
            }}
            className="press min-h-[3rem] flex-1 rounded-control bg-white px-4 text-[0.9375rem] font-bold text-ink hover:bg-line/50"
          >
            지우고 1번부터
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="press min-h-[3rem] flex-1 rounded-control px-4 text-[0.9375rem] font-bold text-ink-faint hover:text-ink-soft"
          >
            취소
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="mt-3 text-[0.875rem] font-bold text-primary underline underline-offset-4 hover:text-primary-press"
        >
          처음부터 다시 하기
        </button>
      )}
    </div>
  );
}
