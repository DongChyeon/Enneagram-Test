/**
 * 결과 공유 코드 인코딩/디코딩 (AC-9).
 *
 * 코드 형식: **`{wing}-{base64url}`** — 예: `5w4-AQoUHigyPEZQTA`
 *   - 페이로드 = **10바이트** = 버전 1바이트 + 유형 1~9의 점수 각 1바이트(10~50)
 *   - base64url 무패딩 → 정확히 14자. 접두사 3자 + `-` 1자 = **총 18자 (≤ 20)**
 *
 * `decodeResult`는 다음 중 하나라도 어긋나면 `null`을 돌려준다 —
 * ① 형식 ② 버전 ③ 점수 범위(10~50) ④ **접두사–점수 일치**.
 * ④는 페이로드를 채점 규칙으로 다시 풀어 얻은 윙 라벨이 접두사와 같은지 보는 것이고,
 * 무작위 14자 문자열이 거의 전부 거부되는 이유이기도 하다.
 *
 * **체크섬은 두지 않는다(YAGNI).** 유효 범위 안의 변조는 탐지 대상이 아니다 —
 * 이 URL은 사용자 본인의 결과이므로 신뢰 경계가 없다. `README.md`에 같은 내용을 적었다.
 *
 * 접두사는 **URL 가독성**을 위한 것이다. 디코드가 실패했을 때 접두사만으로
 * 화면을 그리지 않는다 — 디코드 실패는 404다.
 *
 * 버전 바이트는 **채점 규칙 + 문항 세트**를 가리킨다. 둘 중 하나라도 바뀌면
 * 버전을 올려야 하고, 그 순간 기존 공유 링크는 무효가 된다(DB를 두지 않는 대가).
 */

import type { TypeId } from '../data/schema';
import { TYPE_IDS, resolvePrimary, resolveWing, resultFromScores } from './scoring';
import type { Result, Scores } from './types';

/** 현재 채점 규칙 + 문항 세트의 버전. */
const VERSION = 1;

const MIN_SCORE = 10;
const MAX_SCORE = 50;

/** 접두사 3자 + `-` + base64url 14자. */
const CODE_PATTERN = /^([1-9])w([1-9])-([A-Za-z0-9_-]{14})$/;

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(text: string): Uint8Array | null {
  const padding = '='.repeat((4 - (text.length % 4)) % 4);
  const base64 = text.replace(/-/g, '+').replace(/_/g, '/') + padding;
  let binary: string;
  try {
    binary = atob(base64);
  } catch {
    return null;
  }
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/** 결과 → 공유 코드. */
export function encodeResult(result: Result): string {
  const bytes = new Uint8Array(10);
  bytes[0] = VERSION;
  TYPE_IDS.forEach((typeId, index) => {
    bytes[index + 1] = result.scores[typeId];
  });
  return `${result.wing}-${toBase64Url(bytes)}`;
}

/** 공유 코드 → 결과. 검증에 하나라도 실패하면 `null`. */
export function decodeResult(code: string): Result | null {
  const match = CODE_PATTERN.exec(code);
  if (match === null) return null;

  const bytes = fromBase64Url(match[3]);
  if (bytes === null || bytes.length !== 10) return null;
  if (bytes[0] !== VERSION) return null;

  const scores = {} as Scores;
  for (let index = 0; index < TYPE_IDS.length; index += 1) {
    const value = bytes[index + 1];
    if (value < MIN_SCORE || value > MAX_SCORE) return null;
    scores[TYPE_IDS[index]] = value;
  }

  // 접두사 일치 검증: 점수를 채점 규칙으로 다시 풀어 얻은 라벨과 같아야 한다.
  const primaryType = resolvePrimary(scores);
  if (primaryType !== (Number(match[1]) as TypeId)) return null;
  if (resolveWing(scores, primaryType) !== `${match[1]}w${match[2]}`) return null;

  return resultFromScores(scores);
}
