'use client';

/**
 * 결과 직후의 주 공유 행동과 페이지 하단의 보조 저장 도구.
 *
 * 공유 의향이 가장 높은 결과 요약 직후에는 공유될 카드와 단일 주 버튼만 보여준다.
 * 모바일에서 사용자가 본문을 읽으며 이 구역을 벗어나면 같은 행동을 하단에 고정하고,
 * 공유창을 열거나 링크 복사에 성공하면 고정 버튼을 숨긴다. 이미지 공유와 다운로드는
 * 선택 부담을 만들지 않도록 하단의 보조 도구로 분리한다.
 */

import { useEffect, useRef, useState } from 'react';
import { trackEvent } from '../lib/analytics';
import type { ResultKind } from '../lib/types';
import { resultStage } from './ProductAnalytics';

export type ShareActionsProps = {
  /** `/result/[code]`의 코드. 카드 URL과 파일명이 둘 다 이 값에서 나온다. */
  code: string;
  /** 개인화된 공유 버튼 문구에 쓰는 주유형 번호. */
  typeId: number;
  kind?: ResultKind;
};

type Status = { kind: 'idle' | 'ok' | 'fail'; message: string };

const PRIMARY =
  'press flex min-h-[3.5rem] w-full items-center justify-center rounded-control bg-primary px-5 text-center text-[1rem] font-bold tracking-[-0.01em] text-white shadow-sm hover:bg-primary-press';
const SECONDARY =
  'press flex min-h-[3.25rem] flex-1 items-center justify-center rounded-control bg-sub px-4 text-[0.9375rem] font-bold text-ink-soft hover:bg-line/60';

function isKakaoTalkWebView(): boolean {
  return /KAKAOTALK/i.test(navigator.userAgent);
}

/**
 * iOS 공유 시트는 `text`와 `url`을 함께 넘기면 일부 대상 앱에서 `text`만
 * 전달한다. iPadOS의 데스크톱 UA도 터치 포인트로 함께 잡는다.
 */
function isAppleMobile(): boolean {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent)
    || (/Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
}

/** `null`이면 공유창을 열었다는 뜻이고, 아니면 실패 사유다. */
function shareWithKakao(url: string, imageUrl: string, typeId: number): 'sdk_unavailable' | 'unknown' | null {
  const kakao = window.Kakao;
  if (!isKakaoTalkWebView() || !kakao?.isInitialized()) return 'sdk_unavailable';

  try {
    kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `내 에니어그램 ${typeId}유형 결과`,
        description: '친구와 결과를 비교해 보세요.',
        imageUrl,
        link: { mobileWebUrl: url, webUrl: url },
      },
      buttons: [{ title: '결과 보기', link: { mobileWebUrl: url, webUrl: url } }],
    });
    return null;
  } catch {
    return 'unknown';
  }
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

/** 결과 요약 바로 아래의 주 공유 행동 + 모바일 하단 고정 리마인더. */
export function ShareActions({ code, typeId, kind = 'base' }: ShareActionsProps) {
  const [status, setStatus] = useState<Status>({ kind: 'idle', message: '' });
  const [shared, setShared] = useState(false);
  const [inlineVisible, setInlineVisible] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const cardUrl = `/result/${code}/card`;
  const buttonLabel = `내 ${typeId}유형 결과 공유하기`;

  useEffect(() => {
    const section = sectionRef.current;
    if (section === null || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(([entry]) => setInlineVisible(entry.isIntersecting), {
      threshold: 0.15,
    });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  async function shareLink() {
    const url = window.location.href;
    const imageUrl = new URL(cardUrl, window.location.origin).href;
    const properties = { primary_type: typeId, result_stage: resultStage(kind) };
    if (isKakaoTalkWebView()) trackEvent('share_attempted', { ...properties, channel: 'kakao' });
    const kakaoFailure = shareWithKakao(url, imageUrl, typeId);
    if (!kakaoFailure) {
      trackEvent('share_succeeded', { ...properties, channel: 'kakao' });
      setShared(true);
      setStatus({ kind: 'ok', message: '카카오톡 공유창을 열었어요.' });
      return;
    }

    if (isKakaoTalkWebView()) trackEvent('share_failed', { channel: 'kakao', reason_code: kakaoFailure });
    if (typeof navigator.share === 'function') {
      trackEvent('share_attempted', { ...properties, channel: 'web_share' });
      try {
        await navigator.share(
          isAppleMobile()
            ? { url }
            : {
                title: `내 에니어그램 ${typeId}유형 결과`,
                text: '친구와 결과를 비교해 보세요.',
                url,
              },
        );
        trackEvent('share_succeeded', { ...properties, channel: 'web_share' });
        setShared(true);
        setStatus({ kind: 'ok', message: '공유 시트를 열었어요.' });
        return;
      } catch (error) {
        const cancelled = error instanceof DOMException && error.name === 'AbortError';
        trackEvent('share_failed', { channel: 'web_share', reason_code: cancelled ? 'cancelled' : 'unknown' });
        if (cancelled) return;
      }
    }

    trackEvent('share_attempted', { ...properties, channel: 'copy_link' });
    const copied = await copyText(url);
    if (copied) trackEvent('share_succeeded', { ...properties, channel: 'copy_link' });
    else trackEvent('share_failed', { channel: 'copy_link', reason_code: 'permission_denied' });
    if (copied) setShared(true);
    setStatus(
      copied
        ? { kind: 'ok', message: '결과 링크를 복사했어요. 원하는 앱에 붙여 넣으세요.' }
        : { kind: 'fail', message: '주소창의 결과 링크를 길게 눌러 복사해 주세요.' },
    );
  }

  return (
    <>
      <section
        ref={sectionRef}
        aria-labelledby="share-heading"
        className="animate-rise-in mt-8 rounded-card bg-primary-wash p-4 sm:p-5"
      >
        <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-5">
          <img
            src={cardUrl}
            alt="내 결과 공유 카드 미리보기"
            width={1080}
            height={1350}
            className="w-full rounded-control border border-primary/10 bg-white"
          />
          <div className="min-w-0">
            <h2 id="share-heading" className="text-[1.0625rem] font-bold leading-[1.45] text-ink sm:text-[1.125rem]">
              친구와 결과를 비교해 보세요
            </h2>
            <p className="mt-1.5 text-[0.8125rem] leading-[1.6] text-ink-soft">
              내 결과 카드와 링크가 함께 공유돼요.
            </p>
            <button type="button" onClick={shareLink} className={`${PRIMARY} mt-3`}>
              {buttonLabel}
            </button>
          </div>
        </div>
        <p aria-live="polite" className="mt-2 min-h-5 text-[0.8125rem] leading-[1.6] text-ink-soft">
          {status.message}
        </p>
      </section>

      {!shared && !inlineVisible ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:hidden">
          <button type="button" onClick={shareLink} className={PRIMARY}>
            {buttonLabel}
          </button>
        </div>
      ) : null}
    </>
  );
}

/** 페이지 하단에서 필요할 때만 쓰는 이미지 공유·저장 폴백. */
export function ShareTools({ code, typeId, kind = 'base' }: { code: string; typeId?: number; kind?: ResultKind }) {
  const [status, setStatus] = useState<Status>({ kind: 'idle', message: '' });
  const cardUrl = `/result/${code}/card`;
  const fileName = `enneagram-${code}.png`;

  async function shareCard() {
    const properties = { channel: 'image', primary_type: typeId, result_stage: resultStage(kind) };
    trackEvent('share_attempted', properties);
    try {
      const response = await fetch(`${cardUrl}?dl=1`);
      if (!response.ok) throw new Error(String(response.status));
      const blob = await response.blob();
      const file = new File([blob], fileName, { type: 'image/png' });
      if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file] });
        trackEvent('share_succeeded', properties);
        setStatus({ kind: 'ok', message: '공유 시트를 열었어요.' });
        return;
      }
      trackEvent('share_failed', { channel: 'image', reason_code: 'unsupported' });
      setStatus({ kind: 'fail', message: '이 브라우저에서는 카드 내려받기나 길게 눌러 저장을 이용해 주세요.' });
    } catch (error) {
      trackEvent('share_failed', { channel: 'image', reason_code: error instanceof DOMException && error.name === 'AbortError' ? 'cancelled' : 'unknown' });
      setStatus({ kind: 'fail', message: '공유에 실패했어요. 카드 내려받기나 길게 눌러 저장을 이용해 주세요.' });
    }
  }

  return (
    <section aria-labelledby="share-tools-heading" className="mt-14">
      <h2 id="share-tools-heading" className="text-[1.125rem] font-bold text-ink">
        다른 방법으로 공유하기
      </h2>
      <div className="mt-4 flex gap-2">
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
      <p className="text-[0.8125rem] leading-[1.7] text-ink-faint">
        버튼이 동작하지 않으면 위의 결과 카드를 길게 눌러 저장하세요.
      </p>
    </section>
  );
}
