'use client';

/**
 * 링크 복사 + **3단 저장 폴백** (AC-11, R10).
 *
 *   ① Web Share — `navigator.canShare({ files })` → `navigator.share({ files })`.
 *      Web Share는 실제 `File` 객체를 요구하므로 이 단계 **안에서만**
 *      `fetch(카드 URL) → blob → new File(...)`을 수행한다.
 *   ② 동일 출처 앵커 다운로드 — `<a href=".../card?dl=1" download="...">`.
 *      파일명은 앵커의 `download` 속성이 나르고, 서버는 `?dl=1`일 때만
 *      `content-disposition: attachment`를 붙인다.
 *   ③ 인라인 이미지 — 맨 카드 URL(`content-disposition` 없음)을 `<img>`로
 *      실제로 렌더하고 "길게 눌러 저장"을 안내한다. iOS에서 가장 신뢰도가
 *      높은 경로이고, 저장 전에 카드를 눈으로 확인시켜 준다.
 *
 * **금지**: blob에서 만든 object URL을 `<a download>`의 `href`로 쓰는 다운로드.
 * iOS Safari에서 실패하는 조합이 정확히 이것이다.
 * `fetch → blob → File`은 다운로드가 아니라 공유 시트에 넘길 객체를 만드는
 * 용도이므로 ①에서 허용된다.
 */

import { useState } from 'react';

export type ShareActionsProps = {
  /** `/result/[code]`의 코드. 카드 URL과 파일명이 둘 다 이 값에서 나온다. */
  code: string;
};

type Status = { kind: 'idle' | 'ok' | 'fail'; message: string };

export function ShareActions({ code }: ShareActionsProps) {
  const [status, setStatus] = useState<Status>({ kind: 'idle', message: '' });

  const cardUrl = `/result/${code}/card`;
  const fileName = `enneagram-${code}.png`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setStatus({ kind: 'ok', message: '링크를 복사했습니다.' });
    } catch {
      setStatus({ kind: 'fail', message: '복사에 실패했습니다. 주소창의 URL을 직접 복사해 주세요.' });
    }
  }

  async function shareCard() {
    try {
      const response = await fetch(`${cardUrl}?dl=1`);
      if (!response.ok) throw new Error(String(response.status));
      const blob = await response.blob();
      const file = new File([blob], fileName, { type: 'image/png' });
      if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file] });
        setStatus({ kind: 'ok', message: '공유 시트를 열었습니다.' });
        return;
      }
      setStatus({
        kind: 'fail',
        message: '이 브라우저는 이미지 공유를 지원하지 않습니다. 아래 "카드 내려받기"를 쓰거나 카드를 길게 눌러 저장하세요.',
      });
    } catch {
      setStatus({
        kind: 'fail',
        message: '공유에 실패했습니다. 아래 "카드 내려받기"를 쓰거나 카드를 길게 눌러 저장하세요.',
      });
    }
  }

  return (
    <section aria-labelledby="share-heading" className="mt-8">
      <h2 id="share-heading" className="text-base font-bold">
        결과 공유·저장
      </h2>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copyLink}
          className="min-h-11 rounded-lg border border-neutral-300 px-4 text-sm font-medium"
        >
          링크 복사
        </button>
        {/* ① Web Share */}
        <button
          type="button"
          onClick={shareCard}
          className="min-h-11 rounded-lg bg-emerald-800 px-4 text-sm font-medium text-white"
        >
          카드 공유
        </button>
        {/* ② 동일 출처 앵커 다운로드 — 파일명은 download 속성이 나른다 */}
        <a
          href={`${cardUrl}?dl=1`}
          download={fileName}
          className="flex min-h-11 items-center rounded-lg border border-neutral-300 px-4 text-sm font-medium"
        >
          카드 내려받기
        </a>
      </div>

      <p aria-live="polite" className="mt-2 min-h-5 text-xs text-neutral-600">
        {status.message}
      </p>

      {/* ③ 인라인 이미지 — 맨 URL이라 content-disposition이 없고 그대로 렌더된다 */}
      <figure className="mt-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cardUrl}
          alt="결과 공유 카드 미리보기"
          width={1080}
          height={1350}
          className="w-full max-w-xs rounded-xl border border-neutral-200"
        />
        <figcaption className="mt-2 text-xs text-neutral-600">
          위 두 버튼이 동작하지 않으면 카드를 길게 눌러 저장하세요.
        </figcaption>
      </figure>
    </section>
  );
}
