'use client';

import type { Likert } from '../lib/types';

/**
 * 5점 동의 척도 (AC-4).
 *
 * 문항 어간이 전부 "평소에 …" / "지난 몇 년간 대체로 …" 형태의 서술문이므로
 * 빈도가 아니라 **동의** 앵커를 쓴다.
 *
 * 네이티브 `<input type="radio">` 위에 라벨을 얹는다 — 화살표 키 이동과
 * 그룹 시맨틱을 브라우저가 그대로 제공하므로 직접 구현하지 않는다.
 * 좁은 폭에서는 세로로 쌓이고, 각 행의 최소 높이는 48px다.
 */
export const LIKERT_OPTIONS: { value: Likert; label: string }[] = [
  { value: 1, label: '전혀 그렇지 않다' },
  { value: 2, label: '그렇지 않은 편이다' },
  { value: 3, label: '보통이다' },
  { value: 4, label: '그런 편이다' },
  { value: 5, label: '매우 그렇다' },
];

export default function LikertScale({
  name,
  value,
  onChange,
}: {
  name: string;
  value: Likert | null;
  onChange: (next: Likert) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {LIKERT_OPTIONS.map((option) => {
        const selected = value === option.value;
        return (
          <label
            key={option.value}
            className={[
              'flex min-h-[3rem] cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors duration-150',
              'has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent',
              selected
                ? 'border-accent bg-accent-wash'
                : 'border-line bg-surface hover:border-line-strong',
            ].join(' ')}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selected}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className={[
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[0.75rem] font-semibold tnum transition-colors duration-150',
                selected
                  ? 'border-accent bg-accent text-white'
                  : 'border-line-strong bg-surface text-ink-faint',
              ].join(' ')}
            >
              {option.value}
            </span>
            <span
              className={[
                'text-[0.9375rem] leading-[1.5]',
                selected ? 'font-semibold text-accent-strong' : 'text-ink-soft',
              ].join(' ')}
            >
              {option.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}
