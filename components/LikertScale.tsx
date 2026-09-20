'use client';

import type { Likert } from '../lib/types';

export const LIKERT_OPTIONS: { value: Likert; label: string }[] = [
  { value: 1, label: '전혀 그렇지 않다' },
  { value: 2, label: '그렇지 않은 편이다' },
  { value: 3, label: '보통이다' },
  { value: 4, label: '그런 편이다' },
  { value: 5, label: '매우 그렇다' },
];

/**
 * 5점 척도 — 화면에서 유일하게 90번 반복되는 컨트롤.
 *
 * 평상시 행은 선이 아니라 **회색 채움**으로 떠 있고, 고른 행에만 파랑이
 * 들어온다. 파랑이 한 화면에 하나뿐이어야 "지금 고른 것"이 글자를 읽지
 * 않아도 보인다. 행 높이는 56px — 엄지로 90번 눌러야 하는 크기다.
 */
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
              'press flex min-h-[3.5rem] cursor-pointer items-center gap-3.5 rounded-control border px-4 py-3',
              'has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary',
              selected
                ? 'border-primary bg-primary-wash'
                : 'border-transparent bg-sub hover:bg-line/60',
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
                'tnum flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[0.8125rem] font-bold transition-colors duration-150',
                selected ? 'bg-primary text-white' : 'bg-white text-ink-faint',
              ].join(' ')}
            >
              {option.value}
            </span>
            <span
              className={[
                'text-[1rem] leading-[1.5] tracking-[-0.01em]',
                selected ? 'font-bold text-primary-press' : 'font-medium text-ink-soft',
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
