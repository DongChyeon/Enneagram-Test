/**
 * 공유 카드용 Pretendard 서브셋 로더. **이미지 생성 시 처음 한 번만 읽는다.**
 *
 * ## 왜 `new URL(..., import.meta.url)`이 아닌가 (계획서에서 이탈한 지점)
 *
 * ADR은 이 경로를 `readFileSync(new URL('../assets/fonts/x.otf', import.meta.url))`
 * 로 고정했다. 그 형태는 **webpack 번들 안에서 성립하지 않는다** — 실측:
 *
 *   - webpack 파서는 `new URL(<리터럴>, import.meta.url)`을 **asset module 참조**로
 *     다시 쓴다. 산출물은 `new __webpack_require__.U(__webpack_require__(5814))`이고,
 *     그 값의 `pathname`은 파일 경로가 아니라 `/_next/static/media/<hash>.otf`다.
 *     `fs.readFileSync`는 이것을 받고 `ERR_INVALID_ARG_TYPE`로 죽는다
 *     (`next build`의 "Collecting page data" 단계에서 빌드 전체가 실패한다).
 *   - webpack의 asset 변환을 꺼도 낫지 않다. 그러면 webpack이 `import.meta.url`을
 *     **빌드 시점 소스 파일의 절대 경로**로 치환하는데, 그 경로는 Vercel 런타임
 *     (`/var/task/...`)에 존재하지 않는다. 즉 그 형태는 배포에서 더 조용히 깨진다.
 *
 * 그래서 `process.cwd()` 결합을 쓴다. ADR이 이 결합을 경계한 이유는 **output file
 * tracing이 정적으로 따라가지 못한다**는 것 하나였고, ADR 자신이 그 대안으로
 * `outputFileTracingIncludes`를 제시하면서 "둘 중 최소 하나는 필수"라고 적었다.
 * 우리는 그 둘 중 **추적 쪽**을 택했다 — `next.config.ts`의
 * `outputFileTracingIncludes: { 'app/result/[code]/card/route': ['./assets/fonts/**'] }`
 * 가 폰트를 람다 번들에 명시적으로 싣고, `outputFileTracingRoot`가 저장소 루트로
 * 고정돼 있으므로 런타임 `process.cwd()` 기준 상대 경로가 그대로 맞는다.
 *
 * **환경변수는 읽지 않는다**(AC-12). `process.cwd()`는 환경변수가 아니다.
 *
 * 이 선택의 잔여 리스크는 ADR이 말한 것과 같다: 효과는 로컬이 아니라 **Vercel
 * 프리뷰 배포에서만** 증명된다(R13). Step 5의 Done-when이 그 확인을 요구한다.
 *
 * 서브셋 생성·검사는 `scripts/check-glyphs.ts`, 라이선스는 `docs/licenses.md`.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const FONT_DIR = join(process.cwd(), 'assets', 'fonts');

type CardFont = {
  name: string;
  data: Buffer;
  weight: 400 | 700;
  style: 'normal';
};

let cachedFonts: CardFont[] | undefined;

/** `ImageResponse`의 `fonts` 옵션에 그대로 넘기는 값. */
export function getCardFonts(): CardFont[] {
  if (cachedFonts !== undefined) return cachedFonts;

  cachedFonts = [
    {
      name: 'Pretendard',
      data: readFileSync(join(FONT_DIR, 'pretendard-subset-regular.otf')),
      weight: 400,
      style: 'normal',
    },
    {
      name: 'Pretendard',
      data: readFileSync(join(FONT_DIR, 'pretendard-subset-bold.otf')),
      weight: 700,
      style: 'normal',
    },
  ];
  return cachedFonts;
}
