'use client';

/**
 * 링크 공유(공유 시트) + 이미지 **3단 저장 폴백** (AC-11, R10).
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
 *
 * ## 색과 배치
 * 세 갈래 중 **주 경로는 하나뿐**이므로 파랑도 하나뿐이다 — 「카드 공유」만
 * 채운 파랑이고, 나머지 둘은 회색 면이다. 폴백을 같은 무게로 세워 두면
 * 셋 다 똑같이 중요해 보이고, 그 순간 이 구역은 선택지 세 개가 된다.
 * 390px에서 세 버튼이 한 줄에 못 들어가므로 주 버튼은 전폭, 폴백 둘은
 * 아래 한 줄에 반씩 놓는다.
 */

import { useState } from 'react';

export type ShareActionsProps = {
  /** `/result/[code]`의 코드. 카드 URL과 파일명이 둘 다 이 값에서 나온다. */
  code: string;
};

type Status = { kind: 'idle' | 'ok' | 'fail'; message: string };

const SECONDARY =
  'press flex min-h-[3.25rem] flex-1 items-center justify-center rounded-control bg-sub px-4 text-[0.9375rem] font-bold text-ink-soft hover:bg-line/60';

function isKakaoTalkWebView(): boolean {
  return /KAKAOTALK/i.test(navigator.userAgent);
}

async function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // 일부 인앱 WebView는 API를 노출하면서 실제 쓰기는 막는다. 구형 복사로 잇는다.
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.readOnly = true;
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, text.length);

  try {
    return document.execCommand?.('copy') === true;
  } catch {
    return false;
  } finally {
    textarea.remove();
  }
}

export function ShareActions({ code }: ShareActionsProps) {
  const [status, setStatus] = useState<Status>({ kind: 'idle', message: '' });

  const cardUrl = `/result/${code}/card`;
  const fileName = `enneagram-${code}.png`;

  /**
   * 결과 **링크**를 OS 공유 시트로 보낸다. 시트에는 설치된 앱이 그대로 뜨므로
   * 카카오톡·인스타그램 전송이 여기서 이뤄진다.
   *
   * 카카오톡 SDK를 직접 붙이지 않는 이유: 앱 키가 필요하고 외부 스크립트가
   * 하나 늘며, 키를 다루려면 런타임 환경변수가 들어와 AC-12와 충돌한다.
   * 인스타그램은 웹에서 게시하는 API 자체가 없다. 공유 시트가 두 경로 모두를
   * 커버하는 유일한 방법이고, 의존성도 늘지 않는다.
   *
   * 링크를 카카오톡에 보내면 미리보기로 붙는 것이 빌드타임에 만든 OG 카드다.
   *
   * 데스크톱에는 공유 시트가 없다. 그 경우에만 클립보드 복사로 떨어진다 —
   * 별도의 "링크 복사" 버튼을 두지 않고 한 버튼이 환경에 맞게 동작한다.
   */
  async function shareLink() {
    const url = window.location.href;
    const title = '애니어그램 유형 테스트';
    // 카카오톡 인앱 WebView는 Web Share API 노출 여부와 실제 동작이 일치하지
    // 않는 버전이 있다. 클릭의 사용자 활성화가 살아 있을 때 복사 경로를 탄다.
    if (!isKakaoTalkWebView() && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, text: '내 결과를 확인해 보세요.', url });
        setStatus({ kind: 'ok', message: '공유 시트를 열었습니다.' });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }

    const copied = await copyText(url);
    setStatus(
      copied
        ? { kind: 'ok', message: '결과 링크를 복사했습니다. 카카오톡 대화방에 붙여 넣으세요.' }
        : { kind: 'fail', message: '주소창의 결과 링크를 길게 눌러 복사해 주세요.' },
    );
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
    <section aria-labelledby="share-heading" className="mt-14">
      <h2 id="share-heading" className="text-[1.25rem] font-bold text-ink">
        결과 공유·저장
      </h2>

      <button
        type="button"
        onClick={shareLink}
        className="press mt-5 min-h-[3.5rem] w-full rounded-control bg-primary px-6 text-[1.0625rem] font-bold tracking-[-0.01em] text-white hover:bg-primary-press"
      >
        결과 공유하기
      </button>

      <div className="mt-2 flex gap-2">
        <button type="button" onClick={shareCard} className={SECONDARY}>
          이미지로 공유
        </button>
        <a href={`${cardUrl}?dl=1`} download={fileName} className={SECONDARY}>
          카드 내려받기
        </a>
      </div>

      <p aria-live="polite" className="mt-3 min-h-5 text-[0.8125rem] leading-[1.6] text-ink-soft">
        {status.message}
      </p>

      <figure className="mt-4">
        <img
          src={cardUrl}
          alt="결과 공유 카드 미리보기"
          width={1080}
          height={1350}
          className="w-full max-w-[17rem] rounded-card border border-line"
        />
        <figcaption className="mt-3 text-[0.8125rem] leading-[1.7] text-ink-faint">
          위 두 버튼이 동작하지 않으면 카드를 길게 눌러 저장하세요.
        </figcaption>
      </figure>
    </section>
  );
}
