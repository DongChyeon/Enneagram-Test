/**
 * 진행률.
 *
 * **접근성의 진실은 90분율 하나다** — `aria-valuenow`/`aria-valuemax`는 언제나
 * 응답 수/총 문항이고, 9칸으로 쪼개는 것은 눈으로 "한 묶음 남았다"를 읽게
 * 하려는 장식이라 칸들은 전부 `aria-hidden`이다. 채움은 파랑(행동/진척),
 * 빈 칸은 회색 채움 — 선은 쓰지 않는다.
 */
export default function ProgressBar({
  value,
  max,
  segments = 1,
}: {
  value: number;
  max: number;
  segments?: number;
}) {
  const ratio = max > 0 ? Math.min(Math.max(value / max, 0), 1) : 0;
  const count = Math.max(Math.floor(segments), 1);
  const perSegment = max / count;

  return (
    <div
      role="progressbar"
      aria-label="응답 진행률"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuetext={`${max}문항 중 ${value}문항 응답`}
      className={
        count === 1
          ? 'h-1.5 w-full overflow-hidden rounded-full bg-line'
          : 'flex h-1.5 w-full gap-1'
      }
    >
      {count === 1 ? (
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
          style={{ width: `${ratio * 100}%` }}
        />
      ) : (
        Array.from({ length: count }, (_, slot) => {
          const filled = Math.min(Math.max(value - slot * perSegment, 0), perSegment);
          return (
            <div
              key={slot}
              aria-hidden="true"
              className="h-full flex-1 overflow-hidden rounded-full bg-line"
            >
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
                style={{ width: `${(filled / perSegment) * 100}%` }}
              />
            </div>
          );
        })
      )}
    </div>
  );
}
