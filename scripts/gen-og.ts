/**
 * 빌드 타임 OG 이미지 생성 (AC-10).
 *
 * 윙 라벨 18종 × `ShareCardArt` → `public/og/{wing}.png` (1200×630).
 * `generateMetadata`의 `og:image`는 **이 정적 파일**을 가리키므로 크롤러는
 * 런타임 이미지 생성 경로를 전혀 타지 않는다(ADR — R5 제거).
 *
 * OG 카드에는 점수 막대를 넣지 않는다. 그래야 정보 내용이 윙 18종으로 유한해져
 * 빌드 타임 사전 생성이 손실 없이 성립한다.
 *
 * `ImageResponse`는 이미지 바이트가 아니라 `Response`를 돌려준다 →
 * `arrayBuffer()` → `writeFileSync`.
 *
 * `export const runtime = 'nodejs'`는 **여기 두지 않는다** — Next 라우트
 * 세그먼트 설정이라 독립 스크립트에서는 아무 효과가 없다. 이 파일은 `tsx`로
 * 실행된다(Node 내장 타입 스트리핑은 JSX를 처리하지 못한다).
 *
 * 엘리먼트는 JSX가 아니라 `createElement`로 만든다 — 확장자가 `.ts`이므로
 * esbuild가 JSX 구문을 거부하고, `tsc`의 `jsx: "preserve"`도 `.ts`에서는
 * JSX를 허용하지 않는다. 카드 레이아웃 자체는 `ShareCardArt.tsx`에 있다.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { createElement } from 'react';

import { ImageResponse } from 'next/og';

import { ShareCardArt } from '../components/ShareCardArt';
import { cardFonts } from '../components/cardFont';
import { typeById } from '../data/types';
import { wings } from '../data/wings';

const WIDTH = 1200;
const HEIGHT = 630;

async function main(): Promise<void> {
  const outDir = new URL('../public/og/', import.meta.url);
  mkdirSync(outDir, { recursive: true });

  for (const wing of wings) {
    const type = typeById.get(wing.baseTypeId);
    if (type === undefined) throw new Error(`유형 누락: ${wing.baseTypeId}`);

    const response = new ImageResponse(
      createElement(ShareCardArt, {
        width: WIDTH,
        height: HEIGHT,
        typeNameKo: type.nameKo,
        wingLabel: wing.label,
        summary: type.summary,
      }),
      { width: WIDTH, height: HEIGHT, fonts: cardFonts },
    );

    const bytes = Buffer.from(await response.arrayBuffer());
    writeFileSync(new URL(`${wing.label}.png`, outDir), bytes);
    console.log(`[gen-og] public/og/${wing.label}.png (${bytes.byteLength} bytes)`);
  }

  console.log(`[gen-og] ${wings.length}종 생성 완료`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
