import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ShareActions } from './ShareActions';

const originalUserAgent = window.navigator.userAgent;

function setUserAgent(value: string) {
  Object.defineProperty(window.navigator, 'userAgent', { configurable: true, value });
}

describe('ShareActions', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/result/test-code');
    setUserAgent(originalUserAgent);
    delete window.Kakao;
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    setUserAgent(originalUserAgent);
    delete window.Kakao;
  });

  it('주 버튼의 목적을 결과 공유로 명확히 표시한다', () => {
    render(<ShareActions code="test-code" typeId={5} />);

    expect(screen.getByRole('button', { name: '내 5유형 결과 공유하기' })).toBeTruthy();
    expect(screen.getByText('친구와 결과를 비교해 보세요')).toBeTruthy();
    expect(screen.getByAltText('내 결과 공유 카드 미리보기')).toBeTruthy();
  });

  it('일반 브라우저에서는 운영체제 공유 시트를 먼저 연다', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(window.navigator, 'share', { configurable: true, value: share });
    render(<ShareActions code="test-code" typeId={5} />);

    fireEvent.click(screen.getByRole('button', { name: '내 5유형 결과 공유하기' }));

    await waitFor(() => expect(share).toHaveBeenCalledTimes(1));
    expect(share).toHaveBeenCalledWith({
      title: '내 애니어그램 5유형 결과',
      text: '친구와 결과를 비교해 보세요.',
      url: window.location.href,
    });
  });

  it('아이폰에서는 대상 앱이 문구만 받지 않도록 결과 URL만 공유한다', async () => {
    setUserAgent(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1',
    );
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(window.navigator, 'share', { configurable: true, value: share });
    render(<ShareActions code="test-code" typeId={5} />);

    fireEvent.click(screen.getByRole('button', { name: '내 5유형 결과 공유하기' }));

    await waitFor(() => expect(share).toHaveBeenCalledTimes(1));
    expect(share).toHaveBeenCalledWith({ url: window.location.href });
  });

  it('카카오톡 인앱 WebView에서는 카카오톡 공유창을 먼저 연다', async () => {
    setUserAgent('Mozilla/5.0 KAKAOTALK 11.0.0');
    const share = vi.fn();
    const sendDefault = vi.fn();
    Object.defineProperty(window.navigator, 'share', { configurable: true, value: share });
    window.Kakao = { init: vi.fn(), isInitialized: () => true, Share: { sendDefault } };
    render(<ShareActions code="test-code" typeId={5} />);

    fireEvent.click(screen.getByRole('button', { name: '내 5유형 결과 공유하기' }));

    await waitFor(() => expect(sendDefault).toHaveBeenCalledTimes(1));
    expect(sendDefault).toHaveBeenCalledWith(
      expect.objectContaining({
        objectType: 'feed',
        content: expect.objectContaining({
          imageUrl: `${window.location.origin}/result/test-code/card`,
          link: { mobileWebUrl: window.location.href, webUrl: window.location.href },
        }),
      }),
    );
    expect(share).not.toHaveBeenCalled();
    expect(screen.getByText('카카오톡 공유창을 열었어요.')).toBeTruthy();
  });

  it('카카오 SDK를 쓸 수 없으면 Web Share API로 폴백한다', async () => {
    setUserAgent('Mozilla/5.0 KAKAOTALK 11.0.0');
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(window.navigator, 'share', { configurable: true, value: share });
    render(<ShareActions code="test-code" typeId={5} />);

    fireEvent.click(screen.getByRole('button', { name: '내 5유형 결과 공유하기' }));

    await waitFor(() => expect(share).toHaveBeenCalledTimes(1));
    expect(screen.getByText('공유 시트를 열었어요.')).toBeTruthy();
  });

  it('본문 공유 영역을 벗어나면 모바일 고정 버튼을 보여주고 공유 후 숨긴다', async () => {
    let intersectionCallback: IntersectionObserverCallback | undefined;
    class MockIntersectionObserver {
      constructor(callback: IntersectionObserverCallback) {
        intersectionCallback = callback;
      }
      observe() {}
      disconnect() {}
      unobserve() {}
      takeRecords() { return []; }
      root = null;
      rootMargin = '0px';
      thresholds = [0.15];
    }
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(window.navigator, 'share', { configurable: true, value: share });
    render(<ShareActions code="test-code" typeId={5} />);

    act(() => intersectionCallback?.([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver));
    const buttons = screen.getAllByRole('button', { name: '내 5유형 결과 공유하기' });
    expect(buttons).toHaveLength(2);
    fireEvent.click(buttons[1]);

    await waitFor(() => expect(share).toHaveBeenCalledTimes(1));
    expect(screen.getAllByRole('button', { name: '내 5유형 결과 공유하기' })).toHaveLength(1);
  });

  it('공유 API가 없는 WebView에서도 execCommand 복사로 폴백한다', async () => {
    setUserAgent('Mozilla/5.0 Instagram 350.0.0');
    Object.defineProperty(window.navigator, 'share', { configurable: true, value: undefined });
    Object.defineProperty(window.navigator, 'clipboard', { configurable: true, value: undefined });
    const execCommand = vi.fn().mockReturnValue(true);
    Object.defineProperty(document, 'execCommand', { configurable: true, value: execCommand });
    render(<ShareActions code="test-code" typeId={5} />);

    fireEvent.click(screen.getByRole('button', { name: '내 5유형 결과 공유하기' }));

    await waitFor(() => expect(execCommand).toHaveBeenCalledWith('copy'));
    expect(screen.getByText('결과 링크를 복사했어요. 원하는 앱에 붙여 넣으세요.')).toBeTruthy();
  });
});
