import type { Config } from 'tailwindcss';

/** Tailwind v3는 설정 파일에서 content 경로를 직접 받는다. */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
