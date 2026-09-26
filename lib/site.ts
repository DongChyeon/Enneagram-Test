/**
 * 사이트의 정식 주소. 공유 미리보기(OG)의 절대 URL, canonical, `robots.txt`,
 * `sitemap.xml`이 모두 이 값을 기준으로 한다.
 *
 * **하드코딩 상수이며 환경변수를 읽지 않는다.** 카카오 JavaScript 키는 공개
 * 클라이언트 설정이라 빌드 시 주입하지만, OG의 기준 주소는 배포마다 흔들리지 않는
 * 정식 도메인을 그대로 쓴다. `metadataBase`가 없으면 상대 OG 경로를 절대 URL로
 * 해석할 수 없다.
 *
 * 값은 **반드시 파싱 가능한 실제 URL**이어야 한다. `'https://<production-domain>'`
 * 같은 플레이스홀더는 금지다 — `<`·`>`는 WHATWG URL 파서의 금지 호스트 코드
 * 포인트라 `new URL()`이 모듈 평가 시점에 `TypeError`를 던지고, 첫 빌드가
 * 통째로 실패해 OG PNG가 하나도 생성되지 않는다.
 *
 * 아래 값은 실제 배포 도메인이다(2026-09-20 배포로 확정). 도메인이 바뀌면
 * 이 상수만 고치는 것으로는 부족하다 — OG 이미지 18장을 재생성해야 한다.
 * 그러지 않으면 미리보기 카드가 옛 주소를 가리킨다.
 */
export const SITE_URL = new URL('https://enneagram-test-one.vercel.app');
