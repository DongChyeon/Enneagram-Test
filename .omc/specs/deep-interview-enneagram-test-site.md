# Deep Interview Spec: 애니어그램 유형 테스트 사이트

## Metadata
- Interview ID: enneagram-2026-09-20
- Rounds: 6 (+ Round 0 topology gate)
- Final Ambiguity Score: 18%
- Type: greenfield
- Generated: 2026-09-20
- Threshold: 0.2
- Threshold Source: default
- Initial Context Summarized: no
- Status: PASSED

## Clarity Breakdown
| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Goal Clarity | 0.85 | 0.40 | 0.340 |
| Constraint Clarity | 0.80 | 0.30 | 0.240 |
| Success Criteria | 0.80 | 0.30 | 0.240 |
| **Total Clarity** | | | **0.82** |
| **Ambiguity** | | | **0.18** |

## Topology
| Component | Status | Description | Coverage |
|-----------|--------|-------------|----------|
| 테스트 진행 | active | 90문항(유형당 10) 한국어 문항 + 질문 UI + 응답 수집 | AC-1~4 |
| 채점/결과 | active | 9유형 점수 산출 + 주유형 + 윙 판정 + 결과 화면 | AC-5~8 |
| 결과 공유 | active | URL 인코딩 결과 페이지(OG 이미지) + PNG 결과 카드 다운로드 | AC-9~11 |
| 배포 | active | Vercel 정적 호스팅, 백엔드/DB 없음 | AC-12~13 |

## Goal
공개 라이선스 척도(IPIP 등)와 Riso-Hudson 이론 문헌을 조사해 구성한 90문항(유형당 10문항) 한국어 애니어그램 검사를, Next.js App Router 기반 완전 정적 사이트로 만들어 Vercel에 배포한다. 사용자는 90문항에 응답하면 주유형과 윙(예: 5w4), 9유형 점수 분포를 보고, 그 결과를 URL 링크와 PNG 카드로 공유할 수 있다.

## Constraints
- 백엔드 없음, DB 없음, 사용자 인증 없음. 응답 데이터는 서버에 저장하지 않는다.
- 스택: Next.js(App Router) + TypeScript + Tailwind CSS. 정적 생성(SSG) 중심.
- 배포 대상: Vercel. 별도 인프라 구성 없이 배포 가능해야 한다.
- 언어: 한국어.
- 모바일 우선 반응형 (테스트 응시의 주 경로가 모바일 공유 링크이므로).
- **저작권**: RHETI, WEPSS 등 상용 표준 검사의 문항을 복제하지 않는다. 문항은 (a) 공개 라이선스/퍼블릭 도메인 척도 기반 또는 (b) 이론 문헌 기반 자체 작성이며, 각 문항의 근거 출처를 데이터에 기록한다.
- 결과 공유 URL은 정적 경로 기반이어야 하며 서버 상태에 의존하지 않는다.

## Non-Goals
- 응답 저장, 통계 대시보드, 재방문 이력
- 로그인/계정
- 통합·분열 화살표(integration/disintegration), 본능 변형(sp/so/sx)
- 다국어 지원
- 임상적·진단적 용도 주장 (교육/자기이해 목적임을 고지)

## Acceptance Criteria
- [ ] AC-1: 문항 데이터가 90개이며 9유형에 정확히 10문항씩 균등 매핑된다.
- [ ] AC-2: 각 문항 레코드가 `type`, `text(ko)`, `source`(출처 식별자) 필드를 갖고, 출처가 공개 척도 또는 문헌 근거로 추적 가능하다.
- [ ] AC-3: 문항 출처 목록과 라이선스 근거가 저장소 내 문서(예: `docs/sources.md`)에 정리되어 있고, 상용 검사 문항 복제가 없음이 명시된다.
- [ ] AC-4: 응답 UI에서 90문항을 끝까지 응답할 수 있고, 진행률과 이전 문항 되돌아가기가 동작한다.
- [ ] AC-5: 채점 로직이 9유형 원점수를 계산하고 최고점 유형을 주유형으로 판정한다. 동점 처리 규칙이 명시적으로 구현되어 있다.
- [ ] AC-6: 윙은 주유형의 인접 두 유형(n-1, n+1, 1↔9 순환 포함) 중 높은 점수로 판정되며 `5w4` 형식으로 표기된다.
- [ ] AC-7: 채점 로직에 단위 테스트가 있고, 합성 응답으로 각 유형이 정확히 판정되는 9개 케이스 + 동점 케이스가 통과한다.
- [ ] AC-8: 결과 페이지가 주유형 상세 설명(핵심 동기/두려움/강점/성장 포인트), 윙 설명, 9유형 점수 막대그래프를 표시한다.
- [ ] AC-9: 결과가 URL에 인코딩되어(예: `/result/[code]`) 링크를 새 브라우저에서 열면 동일한 결과가 재현된다.
- [ ] AC-10: 결과 URL에 유형별 OG 이미지가 붙어 카카오톡/슬랙 등에서 미리보기 카드가 노출된다 (`next/og` 사용).
- [ ] AC-11: 결과 페이지에서 PNG 결과 카드를 다운로드할 수 있다.
- [ ] AC-12: `next build`가 경고 없이 통과하고, 백엔드/DB 의존성이 없다.
- [ ] AC-13: Vercel에 배포되어 공개 URL에서 모바일 브라우저로 전체 플로우(응시 → 결과 → 공유)가 동작한다.

## Assumptions Exposed & Resolved
| Assumption | Challenge | Resolution |
|------------|-----------|------------|
| "간단한 애니어그램 테스트" = 재미용 짧은 퀴즈 | 문항 수와 출처를 물음 | 90문항, 공개 척도 + 이론 기반 조합, 출처 명시 |
| 공신력 있는 검사 문항을 그대로 가져올 수 있다 | RHETI/WEPSS는 저작권 보호 상용 검사임을 제시 | 공개 라이선스 척도 + 문헌 기반 자체 작성 조합으로 전환 |
| "간단하게" = 코드 최소화 | Contrarian: 간단함 vs 공신력 중 무엇이 완성 기준인가 | **문항과 출처의 질**이 1순위 판정 기준. "간단히"는 인프라(백엔드 없음)에 적용 |
| 결과 공유는 DB에 저장된 링크 | 공유가 DB 필요 여부를 가른다고 제시 | URL 인코딩 + PNG 카드. DB 불필요 확정 |
| 애니어그램 전체 이론(윙/화살표/본능) 필요 | Simplifier: 최소 범위는 어디까지인가 | 윙까지 포함, 화살표·본능 변형은 Non-Goal |

## Technical Context
- 저장소는 빈 상태(`.git`, `.omc`만 존재) — 그린필드.
- `next/og`(Vercel OG Image Generation)가 유형별 동적 OG 이미지를 추가 의존성 없이 제공하므로 공유 요구사항이 스택 선택의 결정 요인이었다.
- 결과 인코딩은 주유형+윙+9점수를 짧은 문자열로 직렬화하는 방식 필요 (정적 경로 + 쿼리 또는 base64url 세그먼트).

## Ontology (Key Entities)
| Entity | Type | Fields | Relationships |
|--------|------|--------|---------------|
| Question | core domain | id, typeId, text(ko), source | belongs to one Type |
| Answer | core domain | questionId, value(리커트 점수) | belongs to Session |
| Type | core domain | id(1-9), name(ko), 핵심동기, 두려움, 강점, 성장포인트 | has many Questions, has two adjacent Wings |
| Wing | core domain | primaryTypeId, wingTypeId, label(예 5w4), description | derived from Type scores |
| Session | supporting | answers[], progress | produces one Result |
| Result | core domain | primaryType, wing, scores[9] | encoded into ShareCode |
| ShareCard | supporting | og image, png export | rendered from Result |
| Source | supporting | id, 척도/문헌명, 라이선스 | cited by Questions |

## Ontology Convergence
| Round | Entity Count | New | Changed | Stable | Stability Ratio |
|-------|-------------|-----|---------|--------|----------------|
| 1 | 5 | 5 | - | - | N/A |
| 2 | 6 | 1 | 0 | 5 | 83% |
| 3 | 7 | 1 | 0 | 6 | 86% |
| 4 | 7 | 0 | 0 | 7 | 100% |
| 5 | 7 | 0 | 0 | 7 | 100% |
| 6 | 8 | 1 | 0 | 7 | 88% |

## Interview Transcript
<details>
<summary>Full Q&A (Round 0 + 6 rounds)</summary>

### Round 0 — Topology
**Q:** 3개 컴포넌트(테스트 진행/채점·결과/배포)가 맞나요?
**A:** 결과 공유 컴포넌트 추가 → 4개 확정

### Round 1 — 테스트 진행 / Goal
**Q:** 문항 데이터를 어떻게 준비할 것인가? 문항 수는?
**A:** 더 제대로 90문항급. (추가 발언) 웹 및 여러 자료를 통해 재미용이 아닌 실제 공신력 있는 테스트 문항으로 구성하고 싶다.
**Ambiguity:** 71%

### Round 2 — 테스트 진행 / Constraints
**Q:** RHETI/WEPSS는 저작권 상용 검사임. 문항 조달을 어느 선에서 잡을까?
**A:** 공개 라이선스 척도 + 이론 기반 자체 작성 조합
**Ambiguity:** 61%

### Round 3 — 결과 공유 / Goal
**Q:** 친구가 링크를 클릭하면 무엇을 보는가?
**A:** URL 인코딩 결과 페이지 + PNG 결과 카드 다운로드 (DB 불필요 확정)
**Ambiguity:** 47%

### Round 4 — Contrarian / Success Criteria
**Q:** 완성됐다고 판단할 때 가장 먼저 확인할 것 하나는?
**A:** 문항과 출처의 질
**Ambiguity:** 36%

### Round 5 — 배포 / Constraints
**Q:** 기술 스택은?
**A:** Next.js App Router + TypeScript + Tailwind
**Ambiguity:** 26%

### Round 6 — Simplifier / Success Criteria
**Q:** 결과 페이지의 최소 범위는?
**A:** 윙(wing)까지 포함, 화살표·본능 변형은 제외
**Ambiguity:** 18%

</details>
