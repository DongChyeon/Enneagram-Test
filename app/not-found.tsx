import Link from 'next/link';

/**
 * 404. 결과 코드 디코드 실패(형식·버전·점수 범위·접두사 불일치)가 여기로 온다.
 * 접두사만으로 화면을 그리지 않는다 — 디코드 실패는 404다(`lib/code.ts`).
 */
export default function NotFound() {
  return (
    <main className="mx-auto max-w-md px-5 py-16">
      <h1 className="text-xl font-bold">결과를 찾을 수 없습니다</h1>
      <p className="mt-3 text-sm leading-relaxed text-neutral-700">
        주소가 잘못됐거나, 검사 내용이 바뀌어 예전 공유 링크가 더 이상 유효하지 않습니다. 이 사이트는
        응답을 서버에 저장하지 않으므로 링크가 결과를 담는 유일한 수단입니다.
      </p>
      <Link href="/" className="mt-6 inline-flex min-h-11 items-center text-sm font-medium underline">
        검사 처음으로 돌아가기
      </Link>
    </main>
  );
}
