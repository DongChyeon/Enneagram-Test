import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-[34rem] px-5 pb-20 pt-20 sm:px-8">
      <h1 className="text-[1.5rem] font-bold leading-[1.45] tracking-[-0.02em] text-ink">
        결과를 찾을 수 없어요
      </h1>
      <p className="mt-4 text-[0.9375rem] leading-[1.7] text-ink-soft">
        주소가 잘못됐거나, 검사 내용이 바뀌어 예전 공유 링크가 더 이상 유효하지 않아요. 이 사이트는
        응답을 서버에 저장하지 않으므로 링크가 결과를 담는 유일한 수단이에요.
      </p>
      <Link
        href="/"
        className="press mt-8 flex min-h-[3.5rem] w-full items-center justify-center rounded-control bg-primary px-6 text-[1.0625rem] font-bold tracking-[-0.01em] text-white hover:bg-primary-press"
      >
        검사 처음으로 돌아가기
      </Link>
    </main>
  );
}
