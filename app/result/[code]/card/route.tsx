/**
 * 다운로드용 PNG 카드 (AC-11). 1080×1350 — 이 비율은 AC-11이 **고정**한다.
 *
 * **Node 런타임이다. Edge가 아니다.** Edge에는 `fs`가 없어 커밋된 폰트 서브셋을
 * 읽을 수 없고, 그러면 폰트를 절대 URL로 fetch 해야 하는데 그 절대 URL은
 * 환경변수에서 올 수밖에 없다 — AC-12가 정면으로 금지하는 것이다.
 *
 * 헤더 계약:
 *   - 항상 `content-type: image/png` + `cache-control: public, max-age=31536000, immutable`
 *   - **조건부** `content-disposition`: `?dl=1`일 때만 `attachment; filename="enneagram-<code>.png"`.
 *     맨 URL에는 붙이지 않는다 — 저장 폴백 ③이 이 URL을 `<img>` 서브리소스로
 *     렌더하므로, 무조건 attachment로 보내면 가장 신뢰도 높은 iOS 경로가 무너지고
 *     AC-11이 자기 자신과 충돌한다.
 *
 * `?dl=1` 유무는 URL의 일부이므로 캐시 키가 갈린다 → `Vary`는 필요 없다.
 */

import { ImageResponse } from 'next/og';

import { ShareCardArt, type CardBar } from '../../../../components/ShareCardArt';
import { getCardFonts } from '../../../../components/cardFont';
import { typeById } from '../../../../data/types';
import { decodeResult } from '../../../../lib/code';
import { TYPE_IDS } from '../../../../lib/scoring';

export const runtime = 'nodejs';

const WIDTH = 1080;
const HEIGHT = 1350;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
): Promise<Response> {
  const { code } = await params;
  const result = decodeResult(code);
  if (result === null) {
    return new Response('결과 코드를 해석할 수 없어요.', {
      status: 404,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }

  const type = typeById.get(result.primaryType);
  if (type === undefined) {
    return new Response('유형 데이터 누락', { status: 500 });
  }

  const bars: CardBar[] = [...TYPE_IDS]
    .sort((a, b) => result.scores[b] - result.scores[a])
    .map((typeId) => ({
      typeId,
      nameKo: typeById.get(typeId)?.nameKo ?? String(typeId),
      score: result.scores[typeId],
    }));
  const gap = bars[0].score - bars[1].score;

  const headers: Record<string, string> = {
    'content-type': 'image/png',
    'cache-control': 'public, max-age=31536000, immutable',
  };
  if (new URL(request.url).searchParams.get('dl') === '1') {
    headers['content-disposition'] = `attachment; filename="enneagram-${code}.png"`;
  }

  return new ImageResponse(
    (
      <ShareCardArt
        width={WIDTH}
        height={HEIGHT}
        typeNameKo={type.nameKo}
        wingLabel={result.wing}
        summary={type.summary}
        bars={bars}
        gap={gap}
      />
    ),
    { width: WIDTH, height: HEIGHT, fonts: getCardFonts(), headers },
  );
}
