/**
 * 9유형 **상대 비율 막대** + 각 막대의 유형명·원점수 + 1위–2위 점수차 (AC-8 ④).
 *
 * 원점수만 보여주지 않는 이유: 이 검사는 전 문항이 정채점 방향으로 쏠려 있지
 * 않도록 역채점을 두긴 했지만, 그래도 묵종 응답자는 아홉 막대가 전부 40점대에
 * 몰린다. 그 숫자를 단독으로 보여주면 "40점 = 높음"이라는 **절대 규준**처럼
 * 오독된다. 최고점을 100%로 둔 상대 비율이 실제로 읽어야 할 정보다.
 *
 * ## 막대의 색 — 회색이어야 하는 이유
 * 이 화면에는 색 체계가 셋 있고 서로 섞이면 안 된다.
 *   ① 파랑은 **행동**이다. 누를 수 있는 것에만 쓴다. 차트를 파랗게 칠하면
 *      아홉 줄이 전부 눌러 볼 수 있는 것처럼 보인다.
 *   ② 아홉 유형의 고유색은 **정체**다. 도트 캐릭터 한 곳에만 있다. 막대에
 *      그 색을 얹으면 막대가 캐릭터와 같은 것을 재는 눈금처럼 읽힌다 —
 *      막대는 원점수의 상대 비율이지 유형됨의 정도가 아니다.
 *   ③ 그래서 막대는 **데이터**로 남는다. 무채색 계단만 쓰고, 1위는 색이
 *      아니라 **농도와 굵기**로 구분한다(잉크 채움 + 굵은 글자).
 *
 * ## 모바일 배치
 * 이름·점수를 한 줄에 놓고 막대를 그 아래 전폭으로 깐다. 390px에서 이름을
 * 자르지 않으려면 고정폭 라벨을 옆에 세울 수 없다 — "위험을 미리 살피는 사람"은
 * 가로로 나눠 가질 자리가 없다.
 */

import type { TypeId } from '../data/schema';
import { typeById } from '../data/types';
import { TYPE_IDS } from '../lib/scoring';
import type { Scores } from '../lib/types';

export type ScoreBarsProps = {
  scores: Scores;
  primaryType: TypeId;
  /**
   * 원점수의 가능 범위. 45문항 결과는 유형당 5문항이라 5~25,
   * 90문항 결과는 10문항이라 10~50이다. 각주에 범위를 하드코딩하면
   * 한쪽 경로에 틀린 숫자가 표시되므로 호출부가 넘긴다.
   */
  scoreRange: readonly [number, number];
};

export function ScoreBars({ scores, primaryType, scoreRange }: ScoreBarsProps) {
  const ordered = [...TYPE_IDS].sort((a, b) => scores[b] - scores[a]);
  const max = scores[ordered[0]];
  const gap = scores[ordered[0]] - scores[ordered[1]];

  return (
    <section aria-labelledby="score-bars-heading" className="mt-14">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id="score-bars-heading" className="text-[1.25rem] font-bold text-ink">
          9유형 점수 분포
        </h2>
        <p className="tnum text-[0.875rem] font-medium text-ink-faint">
          1위-2위 점수차 <strong className="font-bold text-ink">{gap}</strong>점
        </p>
      </div>

      <ul className="mt-6 space-y-4">
        {ordered.map((typeId) => {
          const name = typeById.get(typeId)?.nameKo ?? String(typeId);
          const ratio = Math.round((scores[typeId] / max) * 100);
          const top = typeId === primaryType;
          return (
            <li key={typeId}>
              <div className="flex items-baseline justify-between gap-3">
                <span
                  className={
                    top
                      ? 'truncate text-[0.9375rem] font-bold tracking-[-0.01em] text-ink'
                      : 'truncate text-[0.9375rem] font-medium tracking-[-0.01em] text-ink-soft'
                  }
                >
                  {typeId}. {name}
                </span>
                <span
                  className={
                    top
                      ? 'tnum shrink-0 text-[0.875rem] font-bold text-ink'
                      : 'tnum shrink-0 text-[0.875rem] font-medium text-ink-faint'
                  }
                >
                  {scores[typeId]}
                </span>
              </div>
              <span
                className="mt-2 flex h-2 w-full overflow-hidden rounded-full bg-line"
                role="img"
                aria-label={`${name} 상대 비율 ${ratio}퍼센트`}
              >
                <span
                  className={
                    top
                      ? 'h-full rounded-full bg-ink transition-[width] duration-500 ease-out'
                      : 'h-full rounded-full bg-ink-faint transition-[width] duration-500 ease-out'
                  }
                  style={{ width: `${ratio}%` }}
                />
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-5 text-[0.8125rem] leading-[1.7] text-ink-faint">
        막대 길이는 가장 높은 유형을 100%로 둔 상대 비율이며, 오른쪽 숫자는 원점수({scoreRange[0]}~{scoreRange[1]})입니다.
        원점수는 다른 사람과 비교하는 규준 점수가 아닙니다.
      </p>
    </section>
  );
}
