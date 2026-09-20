import type { Metadata } from 'next';

import TestRunner from '../../components/TestRunner';

/**
 * 응시 페이지 (Step 4.3).
 *
 * 문항 진행은 전적으로 클라이언트 상태이므로 이 서버 컴포넌트는 껍데기만 맡는다.
 * 문항 데이터는 `TestRunner`가 직접 import 한다 — 채점(`lib/scoring`)이 어차피
 * 같은 모듈을 클라이언트 번들로 끌고 오므로, 여기서 props로 다시 내려보내면
 * 같은 텍스트가 RSC 페이로드에 한 번 더 실린다.
 *
 * ## `?quick` / `?continue`를 여기서 읽지 않는 이유
 * 이 셸에서 `searchParams`를 읽으면 `/test`가 **정적 프리렌더에서 빠져** 요청마다
 * 서버 렌더가 된다 — 서버가 줄 데이터가 하나도 없는 페이지인데도. 게다가 서버는
 * `?continue`가 유효한지 판단할 수도 없다. 근거인 27문항 응답이 `sessionStorage`에
 * 있기 때문이다. 그래서 계획은 `TestRunner`가 복원 시점에 주소와 저장본을 함께
 * 보고 정한다.
 */
export const metadata: Metadata = {
  title: '검사 진행 · 에니어그램 유형 테스트',
  description: '5점 척도 자기보고 검사. 응답은 브라우저 안에만 머물러요.',
};

export default function TestPage() {
  return <TestRunner />;
}
