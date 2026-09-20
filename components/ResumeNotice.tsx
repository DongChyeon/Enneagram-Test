'use client';

import { useEffect, useState } from 'react';

import { SECTION_SIZE, clearProgress, countAnswered, readProgress, sectionCount } from './progress';

/**
 * 랜딩의 "이어서 답하기" 안내.
 *
 * 복원은 원래도 동작했지만 **아무 데서도 그 사실을 말하지 않아서**, 응시자는
 * 90문항을 전부 아니면 전무로 받아들였다. 되돌아왔을 때 남아 있는 응답을
 * 눈으로 확인시켜 주는 것이 이탈 시점의 심리적 비용을 가장 크게 깎는다.
 *
 * `sessionStorage`는 서버에 없으므로 마운트 전에는 아무것도 그리지 않는다 —
 * 첫 클라이언트 렌더가 서버 HTML과 같아야 하이드레이션이 깨지지 않는다.
 * 유효한 저장본이 없거나(서명 불일치 포함) 한 문항도 답하지 않았으면 계속 null이다.
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
    <div className="animate-rise-in mt-7 rounded-lg border border-accent bg-accent-wash p-4">
      <p className="text-[0.9375rem] font-semibold leading-[1.6] text-accent-strong">
        답하다 만 기록이 남아 있습니다
      </p>
      <p className="tnum mt-1.5 text-[0.875rem] leading-[1.7] text-ink-soft">
        {total}문항 중 {answered}문항 · {sections}묶음 중 {section}번째 묶음까지 왔습니다. 아래
        버튼을 누르면 멈춘 자리에서 이어서 답합니다.
      </p>
      {confirming ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              clearProgress();
              setAnswered(null);
            }}
            className="min-h-[2.75rem] flex-1 rounded-lg border border-line-strong bg-surface px-4 text-[0.875rem] font-semibold text-ink transition-colors duration-150 hover:border-ink-faint"
          >
            지우고 1번부터
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="min-h-[2.75rem] flex-1 rounded-lg px-4 text-[0.875rem] font-semibold text-ink-faint transition-colors duration-150 hover:text-ink-soft"
          >
            취소
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="mt-2 text-[0.8125rem] font-semibold text-accent-strong underline underline-offset-4"
        >
          처음부터 다시 하기
        </button>
      )}
    </div>
  );
}
