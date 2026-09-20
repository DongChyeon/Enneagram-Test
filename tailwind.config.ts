import type { Config } from 'tailwindcss';

/**
 * Tailwind v3는 설정 파일에서 content 경로를 직접 받는다.
 *
 * 색은 전부 `app/globals.css`의 CSS 변수를 가리킨다 — 팔레트 정본이 한 곳
 * (`:root`)에만 있어야 결과 페이지·카드까지 같은 색을 쓸 수 있다.
 *
 * `primary`는 **행동 전용** 키다(버튼·선택된 보기·진행률 채움·링크).
 * 유형별 고유색은 이 스케일에 들어오지 않는다 — 그쪽은 결과 층의 데이터가
 * 정본이고, 컨트롤에는 쓰이지 않는다.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        surface: 'var(--surface)',
        sub: 'var(--bg-sub)',
        ink: {
          DEFAULT: 'var(--ink)',
          soft: 'var(--ink-soft)',
          faint: 'var(--ink-faint)',
        },
        line: {
          DEFAULT: 'var(--line)',
          strong: 'var(--line-strong)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          press: 'var(--primary-press)',
          wash: 'var(--primary-wash)',
        },
      },
      borderRadius: {
        // 큰 면 16px, 컨트롤 14px — 이 둘만 쓴다.
        card: '1rem',
        control: '0.875rem',
      },
      fontFamily: {
        sans: [
          'Pretendard Variable',
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Apple SD Gothic Neo',
          'Noto Sans KR',
          'Malgun Gothic',
          'sans-serif',
        ],
      },
      keyframes: {
        'item-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'none' },
        },
        'rise-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        'item-in': 'item-in 220ms cubic-bezier(0.22, 0.61, 0.36, 1) both',
        'rise-in': 'rise-in 420ms cubic-bezier(0.22, 0.61, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};

export default config;
