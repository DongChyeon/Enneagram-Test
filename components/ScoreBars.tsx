/**
 * 9유형 **상대 비율 막대** + 각 막대의 유형명·원점수 + 1위–2위 점수차 (AC-8 ④).
 *
 * 원점수만 보여주지 않는 이유: 이 검사는 전 문항이 정채점 방향으로 쏠려 있지
 * 않도록 역채점을 두긴 했지만, 그래도 묵종 응답자는 아홉 막대가 전부 40점대에
 * 몰린다. 그 숫자를 단독으로 보여주면 "40점 = 높음"이라는 **절대 규준**처럼
 * 오독된다. 최고점을 100%로 둔 상대 비율이 실제로 읽어야 할 정보다.
 */

import type { TypeId } from '../data/schema';
import { typeById } from '../data/types';
import { TYPE_IDS } from '../lib/scoring';
import type { Scores } from '../lib/types';

export type ScoreBarsProps = {
  scores: Scores;
  primaryType: TypeId;
};

export function ScoreBars({ scores, primaryType }: ScoreBarsProps) {
  const ordered = [...TYPE_IDS].sort((a, b) => scores[b] - scores[a]);
  const max = scores[ordered[0]];
  const gap = scores[ordered[0]] - scores[ordered[1]];

  return (
    <section aria-labelledby="score-bars-heading" className="mt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="score-bars-heading" className="text-base font-bold">
          9유형 점수 분포
        </h2>
        <p className="text-sm text-neutral-600">
          1위-2위 점수차 <strong className="font-bold text-neutral-900">{gap}</strong>점
        </p>
      </div>

      <ul className="mt-3 space-y-2">
        {ordered.map((typeId) => {
          const name = typeById.get(typeId)?.nameKo ?? String(typeId);
          const ratio = Math.round((scores[typeId] / max) * 100);
          return (
            <li key={typeId} className="flex items-center gap-2 text-sm">
              <span className="w-36 shrink-0 truncate">
                {typeId}. {name}
              </span>
              <span
                className="flex h-3 flex-1 overflow-hidden rounded-full bg-neutral-200"
                role="img"
                aria-label={`${name} 상대 비율 ${ratio}퍼센트`}
              >
                <span
                  className={
                    typeId === primaryType
                      ? 'h-full rounded-full bg-emerald-800'
                      : 'h-full rounded-full bg-neutral-400'
                  }
                  style={{ width: `${ratio}%` }}
                />
              </span>
              <span className="w-8 shrink-0 text-right tabular-nums text-neutral-600">
                {scores[typeId]}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-3 text-xs text-neutral-500">
        막대 길이는 가장 높은 유형을 100%로 둔 상대 비율이며, 오른쪽 숫자는 원점수(10~50)입니다.
        원점수는 다른 사람과 비교하는 규준 점수가 아닙니다.
      </p>
    </section>
  );
}
