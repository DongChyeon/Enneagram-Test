import type { TypeId } from '../data/schema';
import { typeById } from '../data/types';
import { TYPE_IDS } from '../lib/scoring';
import type { Scores } from '../lib/types';
import { RADIAL_ORDER as ORDER, RADIAL_SIZE as SIZE, normalizeScore, radialGeometry } from './radialGeometry';
import { TYPE_HUES } from './typeMark';

const { center: CENTER, radius: RADIUS, labelRadius: LABEL_RADIUS, point, polygon: points } = radialGeometry(SIZE);

export function RadialScoreProfile({
  scores,
  scoreRange,
}: {
  scores: Scores;
  scoreRange: readonly [number, number];
}) {
  const [min, max] = scoreRange;
  const ranking = [...TYPE_IDS].sort((a, b) => scores[b] - scores[a] || a - b);
  const topThree = new Set(ranking.slice(0, 3));
  const primary = ranking[0];
  const normalized = (typeId: TypeId) => normalizeScore(scores[typeId], scoreRange);
  const profilePoints = points((typeId) => normalized(typeId) * RADIUS);

  return (
    <section aria-labelledby="radial-profile-heading" className="mt-8 rounded-card border border-line p-5 sm:p-7">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h3 id="radial-profile-heading" className="text-[1.0625rem] font-bold text-ink">9유형 방사형 프로필</h3>
          <p className="mt-1.5 text-[0.8125rem] leading-[1.6] text-ink-faint">원 밖으로 갈수록 해당 유형의 점수가 높아요.</p>
        </div>
        <span className="shrink-0 text-[0.75rem] font-bold text-primary">상위 3개 강조</span>
      </div>

      <div className="mx-auto mt-4 max-w-[20rem]">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          role="img"
          aria-label={`9유형 점수 분포. 1위 ${primary}유형, 2위 ${ranking[1]}유형, 3위 ${ranking[2]}유형`}
          className="h-auto w-full overflow-visible"
        >
          {[0.25, 0.5, 0.75, 1].map((level) => (
            <polygon key={level} points={points(() => RADIUS * level)} fill="none" stroke="var(--line)" strokeWidth={level === 1 ? 1.5 : 1} />
          ))}
          {ORDER.map((typeId, index) => {
            const [x, y] = point(index, RADIUS);
            return <line key={typeId} x1={CENTER} y1={CENTER} x2={x} y2={y} stroke="var(--line)" strokeWidth="1" />;
          })}

          <polygon points={profilePoints} fill="var(--primary-wash)" fillOpacity="0.78" stroke="var(--primary)" strokeWidth="2.5" strokeLinejoin="round" />

          {ORDER.map((typeId, index) => {
            const [x, y] = point(index, normalized(typeId) * RADIUS);
            const rank = ranking.indexOf(typeId);
            const highlighted = topThree.has(typeId);
            return (
              <circle
                key={typeId}
                cx={x}
                cy={y}
                r={typeId === primary ? 5.5 : highlighted ? 4 : 2.5}
                fill={typeId === primary ? TYPE_HUES[typeId] : highlighted ? 'var(--primary)' : 'var(--ink-faint)'}
                stroke="white"
                strokeWidth="2"
                aria-label={`${rank + 1}위 ${typeId}유형 ${scores[typeId]}점`}
              />
            );
          })}

          {ORDER.map((typeId, index) => {
            const [x, y] = point(index, LABEL_RADIUS);
            const highlighted = topThree.has(typeId);
            return (
              <g key={typeId} aria-hidden="true">
                {typeId === primary ? <circle cx={x} cy={y - 1} r="13" fill={TYPE_HUES[typeId]} /> : null}
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={typeId === primary ? 'white' : highlighted ? 'var(--primary)' : 'var(--ink-faint)'}
                  fontSize={highlighted ? 14 : 12}
                  fontWeight={highlighted ? 700 : 600}
                >
                  {typeId}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <ol className="mt-3 grid grid-cols-3 gap-2 text-center">
        {ranking.slice(0, 3).map((typeId, index) => (
          <li key={typeId} className={index === 0 ? 'rounded-control bg-primary-wash px-2 py-3' : 'rounded-control bg-sub px-2 py-3'}>
            <span className="block text-[0.75rem] font-bold text-ink-faint">{index + 1}위</span>
            <strong className="mt-1 block text-[0.875rem] leading-[1.4] text-ink">{typeId}유형</strong>
            <span className="mt-0.5 block truncate text-[0.75rem] text-ink-soft">{typeById.get(typeId)?.nameKo}</span>
          </li>
        ))}
      </ol>

      <p className="mt-4 text-[0.8125rem] leading-[1.65] text-ink-faint">
        {min}~{max}점 범위를 0~100%로 바꿔 같은 검사 안에서 비교한 상대 프로필이에요. 정확한 원점수는 아래 점수 분포에서 확인할 수 있어요.
      </p>
    </section>
  );
}
