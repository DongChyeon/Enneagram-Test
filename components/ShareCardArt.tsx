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
import { formatWingLabel } from '../data/wings';
import { TypeMark, markBox } from './TypeMarkView';
import { RADIAL_ORDER, normalizeScore, radialGeometry } from './radialGeometry';
import { TYPE_HUES } from './typeMark';

/** 카드에 인쇄되는 윙 마커. 공간 제약 때문에 결과 페이지보다 짧다(확정 문구). */
export const CARD_WING_MARKER = '날개 — 이론적 해석';

/** 면책 고지의 마지막 한 줄. 카드는 이 줄만 싣는다(확정 문구). */
export const CARD_DISCLAIMER = '교육·자기이해 목적이며 임상적 진단이 아니에요.';

/** 카드 머리글. */
export const CARD_BRAND = '애니어그램 유형 테스트';

/** 점수 구역의 표제. */
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

/** 한 유형의 점수. */
export type CardScore = {
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
   * 점수 내림차순 9유형 점수. 방사형 프로필과 상위 3개 목록을 그린다.
   * OG 미리보기(1200×630)는 `null`이다 — OG 이미지의 정보 내용을 윙 라벨
   * 18종으로 한정해야 빌드 타임 사전 생성이 성립한다.
   */
  scores?: readonly CardScore[] | null;
  /** 방사형 축의 척도 범위. 결과 화면과 같은 `SCALES[kind]`의 [min, max]다. */
  scoreRange?: readonly [number, number] | null;
  /** 1위−2위 점수차. `scores`가 있을 때만 의미가 있다. */
  gap?: number | null;
};

/**
 * 카드의 색. satori에는 CSS 변수가 없으므로 `app/globals.css`의 토큰을 **같은
 * 값의 리터럴로 옮겨 적는다**(정본은 여전히 globals.css다).
 *
 * 카드에는 **버튼이 없다.** 그러므로 파랑도 없다 — 파랑은 누를 수 있는 것의
 * 색이고, 누를 것이 없는 면에 칠하면 그냥 장식이다. 카드에서 채도를 갖는
 * 것은 주유형의 색 하나뿐이다: 도트 캐릭터와, 방사형 프로필에서 그 유형을
 * 가리키는 꼭짓점·번호 표식이 같은 색을 쓴다. 나머지는 흰 바탕 위 회색 계단이다.
 */
const INK = '#191f28';
const MUTED = '#6b7684';
const FAINT = '#8b95a1';
const PAPER = '#ffffff';
/** 윙 알약·막대 트랙·구분선이 공유하는 중성 채움. `--line`과 같은 값이다. */
const FILL = '#e5e8eb';
const RULE = FILL;

/**
 * 제목 한 줄의 폭을 추정할 때 쓰는 글자 폭(em). 실제 조판 폭이 아니라
 * **한 줄에 들어가는가**만 판정하면 되는 값이라 근사로 충분하다 —
 * 렌더된 카드에서 역산한 Pretendard Bold 한글 자평(0.88em)·공백(0.3em)이다.
 */
const TITLE_EM_CJK = 0.88;
const TITLE_EM_SPACE = 0.3;

export function ShareCardArt({
  width,
  height,
  typeNameKo,
  wingLabel,
  summary,
  scores = null,
  scoreRange = null,
  gap = null,
}: ShareCardArtProps) {
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

  // 방사형 프로필은 이전 막대 아홉 줄이 쓰던 높이(약 422 단위)를 그대로 쓴다 —
  // 세로 판형은 머리글·점수 구역·면책 고지가 캔버스를 정확히 채우므로, 이 구역이
  // 커지면 면책 고지가 캔버스 밖으로 밀린다. 오른쪽 칸 폭은 **픽셀로 직접 계산한다**
  // (satori에서 남은 폭에 기대면 긴 유형명이 한 글자씩 세로로 접힌다).
  const radarSize = px(440);
  const radarGap = px(36);
  const rankWidth = width - pad * 2 - radarSize - radarGap;

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

  // 제목 크기는 **고정값이 아니다.** 세로 판형(1080×1350)은 머리글·막대 아홉
  // 줄·면책 고지가 캔버스를 정확히 채워 높이 여유가 한 줄도 없다. 그래서 긴
  // 유형명이 두 줄로 접히는 순간 바닥의 면책 고지가 캔버스 **밖으로** 밀려난다
  // — 헤더가 `headWidth`로 가로 접힘은 막아도, 세로로 넘친 것은 아무도
  // 막아 주지 않는다(satori는 넘친 내용을 잘라 낼 뿐 오류를 내지 않는다).
  // 그래서 이름이 한 줄에 안 들어가면 접는 대신 **들어갈 만큼만 줄인다**.
  // 가로 판형은 머리글 칸이 넓어 아홉 이름 전부 원래 크기로 한 줄에 들어간다.
  const titleEm = [...typeNameKo].reduce(
    (sum, ch) => sum + (/\s/.test(ch) ? TITLE_EM_SPACE : TITLE_EM_CJK),
    0,
  );
  const titleSize = Math.min(px(74), Math.floor((headWidth * 0.97) / titleEm));

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
          <div style={{ fontSize: px(26), color: MUTED }}>{CARD_BRAND}</div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: px(28),
            }}
          >
            <div style={{ fontSize: px(24), color: FAINT }}>{CARD_PRIMARY_LABEL}</div>
            <div
              style={{
                fontSize: titleSize,
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
              padding: `${px(14)}px ${px(24)}px`,
              borderRadius: px(999),
              backgroundColor: FILL,
            }}
          >
            <div style={{ fontSize: px(36), fontWeight: 700, color: INK }}>
              {formatWingLabel(wingLabel)}
            </div>
            <div
              style={{
                fontSize: px(22),
                color: MUTED,
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

      {scores && scores.length > 0 && scoreRange ? (
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: px(40) }}>
          <div style={{ display: 'flex', height: 1, backgroundColor: RULE }} />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: px(24),
              color: FAINT,
              marginTop: px(22),
              marginBottom: px(20),
            }}
          >
            <div style={{ display: 'flex' }}>{CARD_SCORES_HEADING}</div>
            <div style={{ display: 'flex' }}>
              {gap === null ? '' : `${CARD_GAP_LABEL} ${gap}`}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <RadarProfile size={radarSize} scores={scores} scoreRange={scoreRange} px={px} />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: rankWidth,
                flexShrink: 0,
                marginLeft: radarGap,
              }}
            >
              {scores.slice(0, 3).map((entry, index) => (
                <div
                  key={entry.typeId}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: index === 0 ? 0 : px(30),
                  }}
                >
                  {/* 점수는 순위 줄에 둔다 — 이름 옆에 두면 긴 유형명과 붙는다. */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: px(20),
                      color: FAINT,
                    }}
                  >
                    <div style={{ display: 'flex' }}>{`${index + 1}위`}</div>
                    <div
                      style={{
                        display: 'flex',
                        fontWeight: index === 0 ? 700 : 400,
                        color: index === 0 ? INK : FAINT,
                      }}
                    >
                      {`${entry.score}점`}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      marginTop: px(4),
                      fontSize: px(index === 0 ? 26 : 23),
                      fontWeight: index === 0 ? 700 : 400,
                      color: index === 0 ? INK : MUTED,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {`${entry.typeId}. ${entry.nameKo}`}
                  </div>
                </div>
              ))}
            </div>
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
            color: FAINT,
            marginTop: px(22),
          }}
        >
          {CARD_DISCLAIMER}
        </div>
      </div>
    </div>
  );
}

/**
 * 방사형 프로필. 결과 화면의 `RadialScoreProfile`과 같은 도형(`radialGeometry`)을
 * 픽셀 크기로 그린다. satori는 SVG `<text>`를 그리지 않으므로 유형 번호는 SVG 위에
 * 절대 위치로 겹친 div로 찍는다.
 */
function RadarProfile({
  size,
  scores,
  scoreRange,
  px,
}: {
  size: number;
  scores: readonly CardScore[];
  scoreRange: readonly [number, number];
  px: (n: number) => number;
}) {
  const { center, radius, labelRadius, point, polygon } = radialGeometry(size);
  const scoreOf = new Map(scores.map((entry) => [entry.typeId, entry.score]));
  const rankOf = new Map(scores.map((entry, index) => [entry.typeId, index]));
  const primary = scores[0].typeId;
  const hue = TYPE_HUES[primary];
  const ratio = (typeId: TypeId) => normalizeScore(scoreOf.get(typeId) ?? scoreRange[0], scoreRange);
  const unit = size / 320;
  const labelBox = px(40);

  return (
    <div style={{ display: 'flex', position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {[0.25, 0.5, 0.75, 1].map((level) => (
          <polygon
            key={level}
            points={polygon(() => radius * level)}
            fill="none"
            stroke={RULE}
            strokeWidth={(level === 1 ? 1.5 : 1) * unit}
          />
        ))}
        {RADIAL_ORDER.map((typeId, index) => {
          const [x, y] = point(index, radius);
          return <line key={typeId} x1={center} y1={center} x2={x} y2={y} stroke={RULE} strokeWidth={unit} />;
        })}
        <polygon
          points={polygon((typeId) => ratio(typeId) * radius)}
          fill={INK}
          fillOpacity={0.08}
          stroke={INK}
          strokeWidth={2.5 * unit}
          strokeLinejoin="round"
        />
        {RADIAL_ORDER.map((typeId, index) => {
          const [x, y] = point(index, ratio(typeId) * radius);
          const rank = rankOf.get(typeId) ?? 9;
          return (
            <circle
              key={typeId}
              cx={x}
              cy={y}
              r={(rank === 0 ? 5.5 : rank < 3 ? 4 : 2.5) * unit}
              fill={rank === 0 ? hue : rank < 3 ? INK : FAINT}
              stroke={PAPER}
              strokeWidth={2 * unit}
            />
          );
        })}
      </svg>
      {RADIAL_ORDER.map((typeId, index) => {
        const [x, y] = point(index, labelRadius);
        const rank = rankOf.get(typeId) ?? 9;
        return (
          <div
            key={typeId}
            style={{
              position: 'absolute',
              left: Math.round(x - labelBox / 2),
              top: Math.round(y - labelBox / 2),
              width: labelBox,
              height: labelBox,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: labelBox,
              backgroundColor: rank === 0 ? hue : 'transparent',
              color: rank === 0 ? PAPER : rank < 3 ? INK : FAINT,
              fontSize: px(rank < 3 ? 22 : 19),
              fontWeight: rank < 3 ? 700 : 400,
            }}
          >
            {String(typeId)}
          </div>
        );
      })}
    </div>
  );
}
