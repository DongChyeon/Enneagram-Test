import type { Metadata } from 'next';

import TestRunner from '../../components/TestRunner';

/**
 * 응시 페이지 (Step 4.3).
 *
 * 문항 진행은 전적으로 클라이언트 상태이므로 이 서버 컴포넌트는 껍데기만 맡는다.
 * 문항 데이터는 `TestRunner`가 직접 import 한다 — 채점(`lib/scoring`)이 어차피
 * 같은 모듈을 클라이언트 번들로 끌고 오므로, 여기서 props로 다시 내려보내면
 * 같은 텍스트가 RSC 페이로드에 한 번 더 실린다.
 */
export const metadata: Metadata = {
  title: '검사 진행 · 에니어그램 유형 테스트',
  description: '90문항 5점 척도 자기보고 검사. 응답은 브라우저 안에만 머뭅니다.',
};

export default function TestPage() {
  return <TestRunner />;
}
