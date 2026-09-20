/**
 * 결과 페이지의 **얇은 셸** (AC-8, AC-9, AC-10).
 *
 * 하는 일은 셋뿐이다: ① 코드 디코드, 실패 시 `notFound()` ② 결과를 props로
 * `ResultView`에 넘김 ③ `generateMetadata`로 유형별 메타 + `og:image`를
 * **빌드 타임 정적 파일** `/og/{wing}.png`로 지정.
 *
 * **렌더 로직은 여기 두지 않는다** — async 서버 컴포넌트는 jsdom에 마운트할 수
 * 없어서 AC-8의 렌더 측면을 테스트로 닫지 못한다. 그 책임은 전부
 * `components/ResultView.tsx`에 있다.
 *
 * `og:image`의 절대 URL 해석은 `app/layout.tsx`의 하드코딩 `metadataBase`가
 * 담당한다. 여기서 절대 URL을 만들지 않는다(AC-12).
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ResultView } from '../../../components/ResultView';
import { typeById } from '../../../data/types';
import { decodeResult } from '../../../lib/code';

type PageProps = { params: Promise<{ code: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;
  const result = decodeResult(code);
  if (result === null) {
    return { title: '결과를 찾을 수 없습니다' };
  }

  // 어느 경로로 나온 결과인지 제목에서부터 밝힌다 — 링크만 보고 지나가는
  // 사람에게도 45문항 결과와 90문항 결과가 같은 것으로 보여서는 안 된다.
  const items = result.kind === 'base' ? 45 : 90;
  const type = typeById.get(result.primaryType);
  const title = `[${items}문항] ${result.wing} · ${type?.nameKo ?? ''} — 애니어그램 유형 테스트`;
  const description = `${items}문항 자기보고 결과입니다. ${type?.summary ?? ''} 교육·자기이해 목적이며 임상적 진단이 아닙니다.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: `/og/${result.wing}.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/og/${result.wing}.png`],
    },
  };
}

export default async function ResultPage({ params }: PageProps) {
  const { code } = await params;
  const result = decodeResult(code);
  if (result === null) notFound();

  return <ResultView result={result} code={code} />;
}
