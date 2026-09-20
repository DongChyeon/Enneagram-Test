/**
 * 유형 도트 캐릭터의 **단일 렌더러**.
 *
 * 결과 화면(DOM)과 공유 카드(satori)가 같은 컴포넌트를 쓴다(ADR — P5 "렌더 경로는 하나").
 * 스프라이트·색 데이터는 `components/typeMark.ts`가 소유하며 여기서는 그리기만 한다.
 *
 * satori 제약이 구조를 결정했다:
 *   - **CSS grid가 없다.** 그래서 16행을 flex row로 쌓고, 행마다 16칸을 가로로 놓는다.
 *   - **CSS 변수가 없다.** 색은 전부 리터럴 hex(`typeMark.ts`)에서 온다.
 *   - 자식이 둘 이상인 요소는 `display: 'flex'`를 명시해야 한다.
 *   - 인라인 스타일만 쓴다(Tailwind 클래스는 카드에 적용되지 않는다).
 *   - 빈칸도 **투명 칸으로 렌더한다.** 빼 버리면 그 행의 칸 수가 줄어 도트가 밀린다.
 *
 * `.tsx`지만 `scripts/gen-og.ts`를 통해 esbuild(classic JSX 런타임)로도 컴파일되므로
 * `ShareCardArt`와 같은 이유로 React 네임스페이스를 명시적으로 들여온다.
 */

import * as React from 'react';

import { MARK_SIZE, TYPE_HUES, TYPE_MARKS, cellColor } from './typeMark';

export type TypeMarkProps = {
  /** 유형 번호 1–9. */
  typeId: number;
  /** 도트 한 칸의 픽셀 크기. 전체 상자는 `MARK_SIZE * dot`이 된다. */
  dot: number;
};

/** 도트 캐릭터 한 벌의 픽셀 변. */
export function markBox(dot: number): number {
  return MARK_SIZE * dot;
}

export function TypeMark({ typeId, dot }: TypeMarkProps) {
  const rows = TYPE_MARKS[typeId];
  const hue = TYPE_HUES[typeId];
  if (rows === undefined || hue === undefined) return null;

  const box = markBox(dot);

  return (
    <div
      // 유형명이 바로 옆에 텍스트로 있으므로 이 그림은 장식이다 — 두 번 읽히지 않게 한다.
      aria-hidden="true"
      data-type-mark={typeId}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: box,
        height: box,
        flexShrink: 0,
      }}
    >
      {rows.map((row, y) => (
        <div key={y} style={{ display: 'flex', width: box, height: dot }}>
          {Array.from(row, (ch, x) => {
            const color = cellColor(ch, hue);
            return (
              <div
                key={x}
                style={{
                  display: 'flex',
                  width: dot,
                  height: dot,
                  backgroundColor: color ?? 'transparent',
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
