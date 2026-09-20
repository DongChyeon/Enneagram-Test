import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';

// `next lint`는 15.3에서 deprecated, 16에서 제거됐다. 이 저장소는 `npx eslint .`로 린트한다.
// eslint-config-next는 아직 eslintrc 형식이므로 FlatCompat으로 감싼다.
const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

const eslintConfig = [
  { ignores: ['.next/**', 'node_modules/**', 'public/**', 'next-env.d.ts'] },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
];

export default eslintConfig;
