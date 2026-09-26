import Link from 'next/link';

/** 랜딩·결과 하단의 개인정보 처리방침 링크. */
export function PrivacyLink() {
  return (
    <p className="mt-8 text-center text-[0.8125rem]">
      <Link href="/privacy" className="text-ink-faint underline underline-offset-2 hover:text-ink">
        개인정보 처리방침
      </Link>
    </p>
  );
}
