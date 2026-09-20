/**
 * 진행률 바 (AC-4).
 *
 * `aria-valuenow`는 **응답을 마친 문항 수**다 — 현재 보고 있는 문항 번호가
 * 아니다. 뒤로 돌아가 답을 고치는 동안 진행도가 줄어들면 안 되기 때문이다.
 */
export default function ProgressBar({ value, max }: { value: number; max: number }) {
  const ratio = max > 0 ? Math.min(Math.max(value / max, 0), 1) : 0;

  return (
    <div
      role="progressbar"
      aria-label="응답 진행률"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuetext={`${max}문항 중 ${value}문항 응답`}
      className="h-1 w-full overflow-hidden rounded-full bg-line"
    >
      <div
        className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
        style={{ width: `${ratio * 100}%` }}
      />
    </div>
  );
}
