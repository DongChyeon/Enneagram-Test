/** 둥근 유형 캐릭터. DOM과 satori 공유 카드에서 같은 SVG를 렌더한다. */
import * as React from 'react';

import { MARK_SIZE, TYPE_HUES, MARK_INK, MARK_BLUSH, MARK_MOUTH } from './typeMark';

export type TypeMarkProps = {
  typeId: number;
  /** 기존 화면과 공유 카드의 크기 단위를 유지한다. */
  dot: number;
};

export function markBox(dot: number): number {
  return MARK_SIZE * dot;
}

export function TypeMark({ typeId, dot }: TypeMarkProps) {
  const hue = TYPE_HUES[typeId];
  if (hue === undefined) return null;
  const box = markBox(dot);
  const happy = typeId === 2 || typeId === 7;
  const sleepy = typeId === 9;

  return (
    <div aria-hidden="true" data-type-mark={typeId} style={{ display: 'flex', width: box, height: box, flexShrink: 0 }}>
      <svg width={box} height={box} viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="80" cy="145" rx="44" ry="6" fill="#51433e" opacity="0.07" />
        {/* 작은 발과 비대칭 손으로 스티커처럼 가벼운 자세를 만든다. */}
        <g stroke={MARK_INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M58 125 Q44 142 55 144 Q65 147 69 130" fill={hue} />
          <path d="M94 128 Q98 146 109 143 Q119 138 105 123" fill={hue} />
          <path d="M37 87 Q18 85 21 99 Q23 108 39 105" fill={hue} />
          <path d={typeId === 7 ? 'M122 83 Q145 62 145 79 Q144 94 126 99' : 'M122 89 Q145 83 140 99 Q135 109 121 103'} fill={hue} />
          {typeId === 6 && <path d="M46 49 Q28 7 44 13 Q61 23 62 43 M99 42 Q105 8 118 15 Q129 27 117 54" fill={hue} />}
          {typeId === 8 && <g><circle cx="45" cy="43" r="17" fill={hue} /><circle cx="115" cy="43" r="17" fill={hue} /><circle cx="45" cy="43" r="8" fill={MARK_MOUTH} /><circle cx="115" cy="43" r="8" fill={MARK_MOUTH} /></g>}
          <path d={sleepy ? 'M30 86 Q24 65 43 55 Q46 34 67 37 Q82 22 99 40 Q126 37 130 65 Q145 81 132 102 Q128 130 100 132 L60 134 Q29 132 28 107 Q19 96 30 86Z' : 'M32 79 Q30 36 75 34 Q124 28 131 77 L133 101 Q134 132 101 134 L61 134 Q27 132 29 104Z'} fill={hue} />
          {/* 유형별 소품에도 같은 선과 부드러운 색을 쓴다. */}
          {typeId === 1 && <g><path d="M79 36 Q79 24 83 19" fill="none" /><path d="M81 28 Q60 28 62 14 Q79 10 81 28Z" fill="#87af79" /><path d="M82 23 Q83 9 99 12 Q99 25 82 23Z" fill="#d3e5b3" /></g>}
          {typeId === 2 && <path d="M80 43 C53 29 66 14 80 26 C94 11 110 29 80 43Z" fill="#ef8199" />}
          {typeId === 3 && <path d="M80 9 L86 23 L101 25 L90 36 L92 50 L79 43 L65 50 L68 35 L58 24 L73 22Z" fill="#fff1b4" />}
          {typeId === 4 && <g><path d="M46 43 Q36 21 70 20 Q96 7 112 28 Q121 40 101 44Z" fill="#9782be" /><path d="M81 20 L86 12" fill="none" /></g>}
          {typeId === 7 && <path d="M139 25 L142 34 L151 37 L142 40 L139 49 L136 40 L127 37 L136 34Z" fill="#f4d183" />}
        </g>
        <ellipse cx="49" cy="94" rx="10" ry="6" fill={MARK_BLUSH} opacity="0.6" />
        <ellipse cx="111" cy="94" rx="10" ry="6" fill={MARK_BLUSH} opacity="0.6" />
        {happy || sleepy ? (
          <g fill="none" stroke={MARK_INK} strokeWidth="3.5" strokeLinecap="round">
            <path d={sleepy ? 'M54 81 Q60 86 66 81' : 'M54 84 Q60 73 66 84'} />
            <path d={sleepy ? 'M94 81 Q100 86 106 81' : 'M94 84 Q100 73 106 84'} />
          </g>
        ) : (
          <g fill={MARK_INK}>
            <ellipse cx="60" cy="81" rx="4" ry="6" /><ellipse cx="100" cy="81" rx="4" ry="6" />
            <circle cx="61" cy="79" r="1.4" fill={MARK_MOUTH} /><circle cx="101" cy="79" r="1.4" fill={MARK_MOUTH} />
          </g>
        )}
        {typeId === 5 && <g fill="none" stroke={MARK_INK} strokeWidth="2.5"><circle cx="60" cy="81" r="15" /><circle cx="100" cy="81" r="15" /><path d="M75 79 Q80 75 85 79 M40 77 L45 79 M115 79 L120 77" /></g>}
        {typeId === 7 ? <path d="M71 96 Q80 100 89 96 Q87 111 80 111 Q73 111 71 96Z" fill={MARK_INK} /> : <path d="M73 97 Q80 105 87 97" fill="none" stroke={MARK_INK} strokeWidth="3" strokeLinecap="round" />}
        <ellipse cx="80" cy="121" rx="17" ry="6" fill={MARK_MOUTH} opacity="0.4" />
      </svg>
    </div>
  );
}
