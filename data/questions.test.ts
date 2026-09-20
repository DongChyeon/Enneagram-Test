// Step 0 skeleton — see .omc/plans/enneagram-test-site.md Step 0 항목 4.
//
// 이 파일은 아직 존재하지 않는 `data/questions.ts`, `data/sources.ts`,
// `data/types.ts`, `data/wings.ts`를 import한다. Step 2가 그 파일들을 채울수록
// 아래 단언의 통과 범위가 늘어난다 — 실패가 곧 Step 2의 진행률 지표다.
//
// AC 종결 지점 (plan §4 표): AC-1, AC-2, AC-8(데이터 측면) → 여기(Step 2, V1).
// AC-3(문서), AC-14 → 여기(Step 2.5, V1).
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

import { questions } from './questions';
import { sources } from './sources';
import { types, facetsByType } from './types';
import { wings } from './wings';

const SOURCES_MD_PATH = path.join(process.cwd(), 'docs', 'sources.md');
const ITEM_REVIEW_MD_PATH = path.join(process.cwd(), 'docs', 'item-review.md');

// Step 1에서 확정된 7개 source id (plan §5 Step 2 항목 1 표).
const EXPECTED_SOURCE_IDS = [
  'riso-hudson-personality-types',
  'riso-hudson-wisdom',
  'palmer-1988',
  'naranjo-1994',
  'chestnut-2013',
  'hook-2021',
  'newgent-2004',
];

// AC-3 정준 라벨 5종 — 단일 정본은 plan의 AC-3 정의다. 여기서는 그 값을 참조만 한다.
const CANONICAL_SOURCE_LABELS = [
  '명칭',
  '저자·기관',
  '라이선스',
  '접근 URL 또는 서지정보',
  '사용 방식',
];

function groupBy<T, K extends string | number>(items: T[], key: (item: T) => K): Map<K, T[]> {
  const map = new Map<K, T[]>();
  for (const item of items) {
    const k = key(item);
    const bucket = map.get(k) ?? [];
    bucket.push(item);
    map.set(k, bucket);
  }
  return map;
}

describe('data/questions.ts — AC-1 (문항 수·유형별 분포·역채점 분포)', () => {
  it('문항이 정확히 90개다', () => {
    expect(questions.length).toBe(90);
  });

  it('유형별로 정확히 10문항이다 (typeId 1..9)', () => {
    const byType = groupBy(questions, (q) => q.typeId);
    expect(new Set(byType.keys())).toEqual(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]));
    for (const [typeId, items] of byType) {
      expect(items.length, `typeId ${typeId}`).toBe(10);
    }
  });

  it('id가 전역에서 유일하다', () => {
    const ids = questions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('유형별 facet 분포가 정확히 5종 x 2개이고, 그 유형 자신의 facet이다', () => {
    const byType = groupBy(questions, (q) => q.typeId);
    for (const [typeId, items] of byType) {
      const byFacet = groupBy(items, (q) => q.facet);

      // facet은 유형별로 스코프된다(data/schema.ts의 45-멤버 Facet 유니온).
      // 따라서 "전역 5개 리터럴"이 아니라 typeId로 묶어서 검사하고,
      // 해당 유형이 실제로 소유한 facet인지까지 대조한다 — 그러지 않으면
      // 다른 유형의 facet 5개를 빌려 써도 통과한다.
      expect(byFacet.size, `typeId ${typeId} 의 distinct facet 수`).toBe(5);

      const ownFacetIds = new Set((facetsByType.get(typeId) ?? []).map((f) => f.id));
      expect(ownFacetIds.size, `typeId ${typeId} 의 facet 정의 수`).toBe(5);

      for (const [facet, facetItems] of byFacet) {
        expect(ownFacetIds.has(facet), `typeId ${typeId} 에 속하지 않는 facet: ${facet}`).toBe(true);
        expect(facetItems.length, `typeId ${typeId} facet ${facet}`).toBe(2);
      }
    }
  });

  it('유형별 reverse === true 개수가 정확히 2다', () => {
    // 확정값(.omc/plans/open-questions.md): 유형당 정확히 2개, 9유형 균일, 총 18/90.
    // 범위(1~2)가 아니라 고정값이다 — 유형마다 역채점 수가 다르면 묵종 보정 강도가
    // 유형별로 달라져 점수 분포에 문항 설계에서 비롯된 인공적 편차가 생긴다.
    const byType = groupBy(questions, (q) => q.typeId);
    for (const [typeId, items] of byType) {
      const reverseCount = items.filter((q) => q.reverse === true).length;
      expect(reverseCount, `typeId ${typeId}`).toBe(2);
    }
    expect(questions.filter((q) => q.reverse === true).length).toBe(18);
  });
});

describe('data/questions.ts — AC-2 (필드 완전성 + 참조 무결성)', () => {
  it('모든 sourceId가 data/sources.ts에 존재한다', () => {
    const sourceIds = new Set(sources.map((s) => s.id));
    for (const q of questions) {
      expect(sourceIds.has(q.sourceId), `question ${q.id} -> sourceId ${q.sourceId}`).toBe(true);
    }
  });

  it('data/sources.ts의 id 집합이 Step 1 확정 7건과 정확히 일치한다', () => {
    const actual = new Set(sources.map((s) => s.id));
    expect(actual).toEqual(new Set(EXPECTED_SOURCE_IDS));
  });

  it('origin이 adapted|authored 중 하나다', () => {
    for (const q of questions) {
      expect(['adapted', 'authored'], `question ${q.id}`).toContain(q.origin);
    }
  });

  it('rationale과 authoredBy가 비어있지 않다', () => {
    for (const q of questions) {
      expect(q.rationale.trim().length, `question ${q.id} rationale`).toBeGreaterThan(0);
      expect(q.authoredBy.trim().length, `question ${q.id} authoredBy`).toBeGreaterThan(0);
    }
  });

  it('text가 공백이 아닌 한국어 문자열이다', () => {
    const hangulRegex = /[ㄱ-ㅣ가-힣]/;
    for (const q of questions) {
      expect(q.text.trim().length, `question ${q.id} text`).toBeGreaterThan(0);
      expect(hangulRegex.test(q.text), `question ${q.id} text contains Hangul`).toBe(true);
    }
  });

  it('reverse가 모든 문항에 명시적으로 존재한다 (boolean)', () => {
    for (const q of questions) {
      expect(typeof q.reverse, `question ${q.id}`).toBe('boolean');
    }
  });
});

describe('data/types.ts, data/wings.ts — AC-8 (데이터 측면)', () => {
  it('types.ts에 9개 유형이 존재하고 4개 서술 필드가 비어있지 않다', () => {
    expect(types.length).toBe(9);
    for (const t of types) {
      expect(t.coreMotivation.trim().length, `type ${t.id} coreMotivation`).toBeGreaterThan(0);
      expect(t.coreFear.trim().length, `type ${t.id} coreFear`).toBeGreaterThan(0);
      // 강점 / 성장 포인트는 배열이다(data/schema.ts: string[]).
      // Step 0 스켈레톤은 data/types.ts가 존재하기 전에 작성돼 단수 문자열을 가정했으나,
      // AC-8의 요구는 "4개 서술 필드가 비어있지 않음"이며 배열이 이를 충족한다.
      // 데이터를 단수로 낮추면 결과 페이지가 쓸 4항목 구조가 사라지므로 게이트 쪽을 맞춘다.
      expect(t.strengths.length, `type ${t.id} strengths 항목 수`).toBeGreaterThan(0);
      expect(t.strengths.join('').trim().length, `type ${t.id} strengths`).toBeGreaterThan(0);
      expect(t.growthPoints.length, `type ${t.id} growthPoints 항목 수`).toBeGreaterThan(0);
      expect(t.growthPoints.join('').trim().length, `type ${t.id} growthPoints`).toBeGreaterThan(0);
    }
  });

  it('wings.ts에 18개(9유형 x 2윙) 항목이 존재한다', () => {
    expect(wings.length).toBe(18);
  });
});

describe('data/questions.ts — AC-14 (저작권 독립 리뷰)', () => {
  it('90문항 전부 copyrightReview.verdict === "clear"다 (fail-closed 게이트)', () => {
    for (const q of questions) {
      expect(q.copyrightReview.verdict, `question ${q.id}`).toBe('clear');
    }
  });

  it('reviewedBy가 비어있지 않고, 문항의 authoredBy와 다르다', () => {
    for (const q of questions) {
      expect(q.copyrightReview.reviewedBy.trim().length, `question ${q.id} reviewedBy`).toBeGreaterThan(0);
      expect(q.copyrightReview.reviewedBy, `question ${q.id} reviewedBy !== authoredBy`).not.toBe(
        q.authoredBy,
      );
    }
  });

  it('note가 비어있지 않다', () => {
    for (const q of questions) {
      expect(q.copyrightReview.note.trim().length, `question ${q.id} note`).toBeGreaterThan(0);
    }
  });
});

describe('docs/sources.md — AC-3 (출처·라이선스 문서)', () => {
  it('docs/sources.md가 존재한다', () => {
    expect(fs.existsSync(SOURCES_MD_PATH)).toBe(true);
  });

  it('선두 30줄 안에 RHETI와 WEPSS를 모두 명시한 비복제 진술이 있다', () => {
    const content = fs.readFileSync(SOURCES_MD_PATH, 'utf-8');
    const firstLines = content.split('\n').slice(0, 30).join('\n');
    expect(firstLines).toContain('RHETI');
    expect(firstLines).toContain('WEPSS');
  });

  it('data/sources.ts의 모든 source id가 문서에 ## 표제로 등장하고, 정준 라벨 5종이 전부 존재·비어있지 않다', () => {
    const content = fs.readFileSync(SOURCES_MD_PATH, 'utf-8');
    const sections = content.split(/\n(?=## )/);

    for (const source of sources) {
      const section = sections.find((s) => {
        const heading = s.split('\n')[0];
        return heading.includes(source.id);
      });
      expect(section, `## section for source id ${source.id}`).toBeDefined();

      for (const label of CANONICAL_SOURCE_LABELS) {
        // `- **명칭**: X` 와 `- **명칭:** X` 를 모두 허용한다. 볼드 마커가
        // 라벨과 콜론 사이에 오는 것은 흔한 마크다운 습관이고, 그 차이로
        // 문서 전체가 파싱 실패하는 것은 게이트의 결함이지 문서의 결함이 아니다.
        const labelRegex = new RegExp(`${label}\\*{0,2}\\s*[:：]\\s*(.+)`);
        const match = section?.match(labelRegex);
        expect(match, `label "${label}" in section ${source.id}`).not.toBeNull();
        expect(match?.[1]?.trim().length ?? 0, `label "${label}" value in section ${source.id}`).toBeGreaterThan(0);
      }
    }
  });

  it('## 저작권 리뷰 절차 섹션이 존재하고 실제 판정 분포(clear/rewritten/rejected, clear=90)를 기록한다', () => {
    const content = fs.readFileSync(SOURCES_MD_PATH, 'utf-8');
    // 표제는 줄머리에 고정해서 찾는다. 앵커가 없으면 본문 산문에 인용된
    // `## 저작권 리뷰 절차` 같은 백틱 문구가 leftmost 매칭으로 먼저 걸려
    // 엉뚱한 구간을 캡처한다(실제로 그랬다). 절 번호는 있어도 없어도 통과시킨다.
    const sectionMatch = content.match(
      /^##\s*(?:\d+\.\s*)?저작권 리뷰 절차\s*$([\s\S]*?)(?=^##\s|\z)/m,
    );
    expect(sectionMatch, '## 저작권 리뷰 절차 section').not.toBeNull();

    const section = sectionMatch?.[1] ?? '';

    // 판정 분포는 표에서만 읽는다. `clear\D*(\d+)` 류는 "clear 토큰 뒤 첫 숫자"를
    // 잡으므로, 절차를 설명하는 산문에 `clear`가 먼저 등장하면 그 뒤의 무관한
    // 숫자(절 번호 등)를 분포로 오인한다. 표 행 형태를 직접 요구해 그 경로를 막는다.
    const countInTable = (label: string) =>
      section.match(new RegExp(`^\\|\\s*\`?${label}\`?\\s*\\|\\s*(\\d+)\\s*\\|`, 'im'));

    const clearMatch = countInTable('clear');
    const rewrittenMatch = countInTable('rewritten');
    const rejectedMatch = countInTable('rejected');

    expect(clearMatch, 'clear count recorded').not.toBeNull();
    expect(rewrittenMatch, 'rewritten count recorded').not.toBeNull();
    expect(rejectedMatch, 'rejected count recorded').not.toBeNull();
    expect(Number(clearMatch?.[1])).toBe(90);
  });
});

describe('docs/item-review.md — 내용 단언 (Step 0 항목 4에서 통합)', () => {
  it('docs/item-review.md가 존재한다', () => {
    expect(fs.existsSync(ITEM_REVIEW_MD_PATH)).toBe(true);
  });

  it('리뷰 일자, 리뷰어 식별자, 입력 범위, 판정 분포, rejected 목록+사유 5항목이 모두 비어있지 않다', () => {
    const content = fs.readFileSync(ITEM_REVIEW_MD_PATH, 'utf-8');

    // 라벨 뒤 볼드 마커 허용 (`- **리뷰 일자**: X` / `- **리뷰 일자:** X`).
    const reviewDateMatch = content.match(/리뷰\s*일자\**\s*[:：]\s*(.+)/);
    const reviewerMatch = content.match(/리뷰어\s*(?:식별자)?\**\s*[:：]\s*(.+)/);
    const scopeMatch = content.match(/(?:입력\s*범위|리뷰\s*범위)\**\s*[:：]\s*(.+)/);
    const distributionSection = content.match(/판정\s*분포([\s\S]*?)(?=\n##|\n#|$)/);
    const rejectedSection = content.match(/rejected[\s\S]*?(?=\n##|\n#|$)/i);

    expect(reviewDateMatch?.[1]?.trim().length ?? 0, '리뷰 일자').toBeGreaterThan(0);
    expect(reviewerMatch?.[1]?.trim().length ?? 0, '리뷰어 식별자').toBeGreaterThan(0);
    expect(scopeMatch?.[1]?.trim().length ?? 0, '입력 범위').toBeGreaterThan(0);
    expect(distributionSection, '판정 분포 섹션').not.toBeNull();
    expect(rejectedSection, 'rejected 목록 + 사유').not.toBeNull();

    // sources.md와 같은 이유로 표 행에서만 읽는다 — 산문의 `clear` 설명 뒤에
    // 오는 첫 숫자를 분포로 오인하지 않기 위해서다.
    const clearMatch = content.match(/^\|\s*`?clear`?\s*\|\s*(\d+)\s*\|/im);
    expect(clearMatch, 'clear count recorded').not.toBeNull();
    expect(Number(clearMatch?.[1]), 'clear 개수').toBe(90);
  });
});
