'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { ownsResult } from './progress';

export type ResultNextStepProps = {
  code: string;
};

const LINK_CLASS =
  'press mt-5 flex min-h-[3.5rem] w-full items-center justify-center rounded-control bg-primary px-6 text-center text-[1.0625rem] font-bold tracking-[-0.01em] text-white hover:bg-primary-press';

/**
 * 27문항 결과의 다음 행동을 결과 생성자와 공유 방문자에게 다르게 보여 준다.
 * 결과 URL에는 점수만 있고 원 응답은 없으므로, 다른 기기에서 이어하기는 불가능하다.
 */
export function ResultNextStep({ code }: ResultNextStepProps) {
  const [owner, setOwner] = useState(false);

  useEffect(() => {
    setOwner(ownsResult(code));
  }, [code]);

  if (!owner) {
    return (
      <section aria-labelledby="try-heading" className="mt-14 rounded-card bg-sub p-5 sm:p-7">
        <h2 id="try-heading" className="text-[1.125rem] font-bold tracking-[-0.01em] text-ink">
          내 결과도 알아보기
        </h2>
        <p className="mt-3 text-[0.9375rem] leading-[1.7] text-ink-soft">
          이 링크는 다른 사람이 공유한 결과예요. 내 결과를 보려면 처음부터 27문항에 답해 주세요.
        </p>
        <Link href="/test" className={LINK_CLASS}>
          27문항 검사 시작하기
        </Link>
      </section>
    );
  }

  return (
    <section aria-labelledby="continue-heading" className="mt-14 rounded-card bg-sub p-5 sm:p-7">
      <h2 id="continue-heading" className="text-[1.125rem] font-bold tracking-[-0.01em] text-ink">
        총 90문항으로 더 자세히 알아보기
      </h2>
      <p className="mt-3 text-[0.9375rem] leading-[1.7] text-ink-soft">
        남은 63문항에서 더 다양한 상황을 살펴봐요. 다 답하면 90문항 결과가 되고 9유형
        점수 분포도 함께 나와요.{' '}
        <strong className="font-bold text-ink">이미 답한 27문항은 다시 묻지 않아요.</strong>
      </p>
      <Link href="/test?continue" className={LINK_CLASS}>
        63문항 이어서 답하기
      </Link>
    </section>
  );
}
