import { ImageResponse } from 'next/og';

import { cardFonts } from '../components/cardFont';

export const runtime = 'nodejs';
export const alt = '애니어그램 유형 테스트 — 나를 이해하는 45문항 또는 90문항 검사';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const TYPE_COLORS = [
  '#d66b65',
  '#d58a62',
  '#d6ad56',
  '#77a968',
  '#539e91',
  '#5f91b5',
  '#797fbd',
  '#a875ad',
  '#b66f85',
] as const;

/** 랜딩 URL 공유 전용 카드. 결과별 OG 이미지와 역할을 섞지 않는다. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#fbfaf7',
          color: '#252523',
          fontFamily: 'Pretendard',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {TYPE_COLORS.map((color, index) => (
            <div
              key={color}
              style={{
                width: 34,
                height: 34,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
                background: color,
                color: '#ffffff',
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              {index + 1}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 68, fontWeight: 700, letterSpacing: '-2.5px', lineHeight: 1.15 }}>
            애니어그램 유형 테스트
          </div>
          <div style={{ marginTop: 24, fontSize: 31, color: '#66645f', lineHeight: 1.45 }}>
            45문항 또는 90문항으로 알아보는 주유형과 윙
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 28,
            borderTop: '2px solid #e5e2dc',
            fontSize: 23,
            color: '#77746e',
          }}
        >
          <span>응답은 브라우저 안에만 저장됩니다</span>
          <span style={{ fontWeight: 700, color: '#3d70b2' }}>교육 · 자기이해 목적</span>
        </div>
      </div>
    ),
    { ...size, fonts: cardFonts },
  );
}
