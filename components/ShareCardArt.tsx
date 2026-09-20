/**
 * 공유 카드의 **단일 레이아웃**.
 *
 * 이 컴포넌트는 두 시점에 렌더된다(ADR — P5 "렌더 경로는 하나"):
 *   - 빌드 타임 `scripts/gen-og.ts` → `public/og/{wing}.png` (1200×630)
 *   - 런타임 `app/result/[code]/card/route.tsx` → 다운로드 카드 (1080×1350)
 *
 * `ImageResponse`(satori)는 브라우저가 아니다. 지켜야 하는 제약:
 *   - 자식이 둘 이상인 요소는 반드시 `display: 'flex'`를 명시한다.
 *   - 인라인 스타일만 쓴다(Tailwind 클래스는 적용되지 않는다).
 *   - 지원되는 CSS 부분집합만 쓴다(`gap`, `flex`, `borderRadius` 등은 지원).
 *
 * **카드 고정 문구는 이 파일이 소유한다.** `scripts/check-glyphs.ts`가
 * `CARD_FIXED_STRINGS`를 그대로 읽어 폰트 서브셋 cmap 검사에 넣으므로,
 * 여기 문자열을 고치면 서브셋이 낡았을 때 빌드가 실패한다(의도된 동작).
 */

// `scripts/gen-og.ts`는 Next 컴파일러가 아니라 `tsx`(esbuild)로 이 파일을 읽고,
// esbuild는 tsconfig의 `jsx: "preserve"`에서 **classic 런타임**(`React.createElement`)
// 으로 내려간다. 그래서 여기서는 React 네임스페이스를 명시적으로 들여온다 —
// Next의 automatic 런타임에서는 이 import가 무해하게 남을 뿐이다.
import * as React from 'react';

import type { TypeId } from '../data/schema';
import { TypeMark, markBox } from './TypeMarkView';

/** 카드에 인쇄되는 윙 마커. 공간 제약 때문에 결과 페이지보다 짧다(확정 문구). */
export const CARD_WING_MARKER = '윙 — 이론적 해석';

/** 면책 고지의 마지막 한 줄. 카드는 이 줄만 싣는다(확정 문구). */
export const CARD_DISCLAIMER = '교육·자기이해 목적이며 임상적 진단이 아닙니다.';

/** 카드 머리글. */
export const CARD_BRAND = '애니어그램 유형 테스트';

/** 점수 막대 구역의 표제. */
export const CARD_SCORES_HEADING = '9유형 점수 분포';

/** 1위–2위 점수차 라벨. */
export const CARD_GAP_LABEL = '1위-2위 점수차';

/** "가장 높게 나온 유형"이라는 표현 — 단정형("당신의 유형은")을 쓰지 않는다. */
export const CARD_PRIMARY_LABEL = '가장 높게 나온 유형';

/** 폰트 서브셋 글리프 집합의 입력이 되는 카드 고정 문구 전부. */
export const CARD_FIXED_STRINGS: readonly string[] = [
  CARD_WING_MARKER,
  CARD_DISCLAIMER,
  CARD_BRAND,
  CARD_SCORES_HEADING,
  CARD_GAP_LABEL,
  CARD_PRIMARY_LABEL,
];

/** 점수 막대 한 줄. */
export type CardBar = {
  typeId: TypeId;
  nameKo: string;
  score: number;
};

export type ShareCardArtProps = {
  width: number;
  height: number;
  /** 주유형 한국어 명칭 */
  typeNameKo: string;
  /** `5w4` */
  wingLabel: string;
  /** 주유형 한 줄 요약 */
  summary: string;
  /**
   * 9유형 점수 막대. OG 미리보기(1200×630)는 `null`이다 —
   * OG 이미지의 정보 내용을 윙 라벨 18종으로 한정해야 빌드 타임 사전 생성이 성립한다.
   */
  bars?: readonly CardBar[] | null;
  /** 1위−2위 점수차. `bars`가 있을 때만 의미가 있다. */
  gap?: number | null;
};

const INK = '#12151c';
const MUTED = '#5b6472';
const PAPER = '#f7f6f2';
const ACCENT = '#2f5d50';
const TRACK = '#e2e0d8';
const RULE = '#dcd9cf';

export function ShareCardArt({
  width,
  height,
  typeNameKo,
  wingLabel,
  summary,
  bars = null,
  gap = null,
}: ShareCardArtProps) {
  // 상대 비율 막대 — 원점수 자체가 아니라 최고점 대비 비율로 그린다.
  const maxScore = bars && bars.length > 0 ? Math.max(...bars.map((b) => b.score)) : 1;

  // 두 판형은 **화면 비율이 다르다**: 가로 1200×630, 세로 1080×1350.
  // 폭 하나로만 스케일을 잡으면(`width / 1200`) 세로 카드는 630 높이용으로
  // 조판된 내용이 1350 캔버스에 놓여 절반 가까이가 빈 공간이 된다.
  // 그래서 세로 판형은 **자체 배율**로 크게 조판하고, 여백은 나눠 뿌리지 않는다.
  const isPortrait = height > width;
  const scale = width / 1200;
  /** 글자·간격 배율. 세로 판형은 남는 높이를 본문 크기로 되돌려 받는다. */
  const ts = scale * (isPortrait ? 1.28 : 1.05);
  const pad = Math.round(isPortrait ? 66 * ts : 64 * scale);
  const px = (n: number) => Math.round(n * ts);

  // 막대 폭은 **픽셀로 직접 계산한다.** satori(yoga)에서 `width: '<n>%'` 채움은
  // 부모 트랙의 고유 너비를 키워, 채움이 긴 1·2위 줄에서만 라벨 칸을 밀어내고
  // 유형명이 한 글자씩 세로로 접힌다(`flexShrink: 0`으로도 막히지 않았다).
  // 카드 폭이 고정값이므로 퍼센트를 쓸 이유가 없다.
  const labelWidth = px(268);
  const scoreWidth = px(70);
  const columnGap = px(12);
  const trackWidth = width - pad * 2 - labelWidth - scoreWidth - columnGap * 2;
  const barHeight = px(22);
  const rowGap = px(28);

  // 도트 캐릭터의 유형 번호는 윙 라벨(`5w4`)의 앞자리다. 별도 prop을 받지 않는 이유는
  // 두 호출부(`scripts/gen-og.ts`, 카드 라우트)가 이미 윙 라벨을 넘기고 있고,
  // 윙 라벨의 기준 유형이 곧 주유형이기 때문이다 — 같은 값을 두 번 받을 필요가 없다.
  const markTypeId = Number.parseInt(wingLabel, 10);
  // 소셜 피드 썸네일에서도 실루엣이 읽혀야 하므로 카드 폭의 1/5 정도로 잡는다.
  const markDot = Math.max(1, px(13));
  const markGap = px(28);
  // 머리글 텍스트 칸은 **픽셀로 직접 계산한다.** 막대 채움과 같은 이유다 —
  // satori(yoga)에서 남은 폭에 기대면 긴 유형명이 한 글자씩 세로로 접힌다.
  const headWidth = width - pad * 2 - markBox(markDot) - markGap;

  return (
    <div
      style={{
        width,
        height,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: PAPER,
        color: INK,
        padding: pad,
        fontFamily: 'Pretendard',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: headWidth, flexShrink: 0 }}>
          <div style={{ fontSize: px(26), color: MUTED, letterSpacing: 1 }}>{CARD_BRAND}</div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: px(28),
            }}
          >
            <div style={{ fontSize: px(24), color: MUTED }}>{CARD_PRIMARY_LABEL}</div>
            <div
              style={{
                fontSize: px(74),
                fontWeight: 700,
                lineHeight: 1.18,
                marginTop: px(6),
              }}
            >
              {typeNameKo}
            </div>
          </div>

          {/* 윙 라벨과 이론적 해석 마커는 **한 덩어리**로 붙어 있어야 한다(AC-11).
              `alignSelf`가 없으면 열 정렬의 stretch 때문에 알약이 카드 폭 전체로
              늘어나 띠처럼 보인다 — 내용 폭만 차지하게 묶어 둔다. */}
          <div
            style={{
              display: 'flex',
              alignSelf: 'flex-start',
              alignItems: 'center',
              marginTop: px(22),
              padding: `${px(12)}px ${px(22)}px`,
              borderRadius: px(999),
              backgroundColor: '#e8ece9',
              border: `${Math.max(1, Math.round(2 * scale))}px solid ${ACCENT}`,
            }}
          >
            <div style={{ fontSize: px(36), fontWeight: 700, color: ACCENT }}>{wingLabel}</div>
            <div
              style={{
                fontSize: px(22),
                color: ACCENT,
                marginLeft: px(16),
              }}
            >
              {CARD_WING_MARKER}
            </div>
          </div>

          <div
            style={{
              fontSize: px(26),
              color: MUTED,
              lineHeight: 1.55,
              marginTop: px(26),
            }}
          >
            {summary}
          </div>
        </div>

        {/* 유형 도트 캐릭터. 카드에서 채도를 가진 유일한 요소이므로 다른 색은 더하지 않는다.
            새 문구를 만들지 않으므로 `CARD_FIXED_STRINGS`는 그대로다. */}
        <div style={{ display: 'flex', marginLeft: markGap, marginTop: px(6) }}>
          <TypeMark typeId={markTypeId} dot={markDot} />
        </div>
      </div>

      {bars && bars.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: px(40) }}>
          <div style={{ display: 'flex', height: 1, backgroundColor: RULE }} />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: px(24),
              color: MUTED,
              marginTop: px(22),
              marginBottom: px(20),
            }}
          >
            <div style={{ display: 'flex' }}>{CARD_SCORES_HEADING}</div>
            <div style={{ display: 'flex' }}>
              {gap === null ? '' : `${CARD_GAP_LABEL} ${gap}`}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {bars.map((bar, index) => (
              <div
                key={bar.typeId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: index === bars.length - 1 ? 0 : rowGap,
                }}
              >
                <div
                  style={{
                    width: labelWidth,
                    flexShrink: 0,
                    fontSize: px(22),
                    color: INK,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {`${bar.typeId}. ${bar.nameKo}`}
                </div>
                <div
                  style={{
                    display: 'flex',
                    width: trackWidth,
                    flexShrink: 0,
                    marginLeft: columnGap,
                    height: barHeight,
                    backgroundColor: TRACK,
                    borderRadius: Math.round(barHeight / 2),
                  }}
                >
                  <div
                    style={{
                      width: Math.round(trackWidth * (bar.score / maxScore)),
                      height: '100%',
                      backgroundColor: ACCENT,
                      borderRadius: Math.round(barHeight / 2),
                    }}
                  />
                </div>
                <div
                  style={{
                    width: scoreWidth,
                    flexShrink: 0,
                    marginLeft: columnGap,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    fontSize: px(22),
                    color: MUTED,
                  }}
                >
                  {String(bar.score)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* 남는 높이는 **한 군데로만** 몬다. 이전에는 루트의 `space-between`이
          잉여를 두 틈에 반씩 나눠 줘서 카드 한가운데가 비었다. */}
      <div style={{ display: 'flex', flexGrow: 1, minHeight: px(28) }} />

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', height: 1, backgroundColor: RULE }} />
        <div
          style={{
            fontSize: px(22),
            color: MUTED,
            marginTop: px(22),
          }}
        >
          {CARD_DISCLAIMER}
        </div>
      </div>
    </div>
  );
}
