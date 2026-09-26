/**
 * 결과 카드 PNG 주소. 카드 응답은 `immutable` 1년 캐시라서 주소가 같으면 브라우저가
 * 서버에 다시 묻지 않고 옛 이미지를 계속 쓴다. 결과 코드는 그대로여도 카드 **디자인**이
 * 바뀌면 새 이미지를 받아야 하므로, 디자인을 바꿀 때마다 `CARD_VERSION`을 올린다.
 * 라우트는 `v`를 읽지 않는다 — 캐시 키만 바꾼다.
 */
export const CARD_VERSION = 2;

export function cardPath(code: string, { download = false }: { download?: boolean } = {}): string {
  return `/result/${code}/card?v=${CARD_VERSION}${download ? '&dl=1' : ''}`;
}
