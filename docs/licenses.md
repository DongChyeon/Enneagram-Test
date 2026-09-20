# 번들 자산 라이선스

이 문서는 **저장소에 포함된 서드파티 자산**(폰트 등)의 라이선스를 기록한다.

**문항 출처는 여기가 아니라 `docs/sources.md`다.** 두 문서를 섞지 않는 이유는
행정 편의가 아니다 — `docs/sources.md`의 `##` 섹션은 AC-3 테스트가 파싱하는
대상이고, 그 테스트는 표제가 `data/sources.ts`의 source id와 일치하는 섹션에
5개 정준 라벨이 모두 있는지를 검사한다. 폰트 라이선스를 그 문서에 넣으면
문항 출처가 아닌 섹션이 검사 범위로 끌려 들어간다.

---

## Pretendard

- **용도**: 공유 카드(OG 미리보기 18종 + 다운로드 PNG)의 유일한 폰트.
  웹 페이지 본문에는 쓰지 않는다 — 카드만 `ImageResponse`(satori)로 렌더되고,
  satori는 시스템 폰트를 쓸 수 없어 폰트 바이트를 직접 넘겨야 한다.
- **버전**: 1.3.9
- **원본**: `Pretendard-Regular.otf`, `Pretendard-Bold.otf`
  (`https://github.com/orioncactus/pretendard`, 배포본은
  `packages/pretendard/dist/public/static/`)
- **라이선스**: SIL Open Font License 1.1 (OFL)
  전문: `https://github.com/orioncactus/pretendard/blob/main/LICENSE`
- **고지 의무**: OFL은 ① 저작권 고지와 라이선스를 함께 배포할 것 ② 폰트를
  단독 판매하지 말 것 ③ 예약 폰트 이름(Reserved Font Name)이 지정된 경우 파생본에
  그 이름을 쓰지 말 것을 요구한다. Pretendard는 **예약 폰트 이름을 지정하지 않으므로**
  서브셋 파생본이 `Pretendard`라는 이름을 유지해도 된다. 이 문서가 ①의 이행이다.
- **저작권**: Copyright (c) 2021 Kil Hyung-jin, with Reserved Font Name Pretendard
  (원본 고지 문자열은 서브셋 `.otf`의 name 테이블에 그대로 보존되어 있다 —
  `pyftsubset`에 `--name-IDs='*'`를 준 이유다).

### 저장소에 있는 파일

| 파일 | 내용 |
|---|---|
| `assets/fonts/pretendard-subset-regular.otf` | Regular(400) 서브셋 |
| `assets/fonts/pretendard-subset-bold.otf` | Bold(700) 서브셋 |

### 서브셋 재생성

글리프 집합은 **데이터에서 도출한다** — 고정 KS X 1001 서브셋을 쓰면 유형명
한 글자가 빠졌을 때 카드 18장이 조용히 두부(□)가 된다. 집합의 정의는
`scripts/check-glyphs.ts`의 `requiredGlyphs()` 하나뿐이고, 생성과 검사가 그
같은 함수를 쓴다.

`pyftsubset`은 npm 패키지가 아니라 Python `fonttools`의 CLI다. **작성자 로컬
환경 요건**이며, 산출물만 커밋되므로 Vercel 빌드 환경에는 Python이 필요 없다.

```sh
# 선행: pip install fonttools  (또는 uv tool install fonttools)
npx tsx scripts/check-glyphs.ts --print > /tmp/glyphs.txt

pyftsubset <원본>/Pretendard-Regular.otf \
  --text-file=/tmp/glyphs.txt \
  --output-file=assets/fonts/pretendard-subset-regular.otf \
  --layout-features='*' --drop-tables+=DSIG --name-IDs='*' --notdef-outline

pyftsubset <원본>/Pretendard-Bold.otf \
  --text-file=/tmp/glyphs.txt \
  --output-file=assets/fonts/pretendard-subset-bold.otf \
  --layout-features='*' --drop-tables+=DSIG --name-IDs='*' --notdef-outline

npx tsx scripts/check-glyphs.ts   # 누락 0 확인
```

`.woff2`는 쓰지 않는다 — satori가 지원하지 않는다. `.otf`/`.ttf`만 쓴다.
