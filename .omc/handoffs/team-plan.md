## Handoff: team-plan → team-exec

- **Decided**: 계획(.omc/plans/enneagram-test-site.md, 842줄)의 단계 의존성을 그대로 따른다.
  Step 1은 완료(docs/sources.md). 실행 순서: Step 0 → Step 2(A: 데이터 정의 / B: 90문항 / C: 통합+facet검수)
  → Step 2.5(독립 저작권 리뷰) → Step 3(채점+테스트) → Step 4·5(병렬) → Step 6.
- **Rejected**:
  - 90문항을 1개 워커가 전부 작성 — R12(저술 공수) 위험, 배치 전략이 계획에 이미 있음.
  - 여러 워커가 `data/questions.ts` 단일 파일에 동시 기록 — 충돌. 대신 워커별
    `data/questions/type-{n}.ts`에 작성하고 Stage C에서 `data/questions.ts`로 통합한다.
    AC는 `data/questions.ts`만 검사하므로 중간 파일은 AC에 영향 없음(구현 세부).
  - Step 4·5를 Step 3 이전에 병렬 착수 — 둘 다 scoring/encoding에 의존.
- **Risks**:
  - Step 2.5 리뷰어가 작성 컨텍스트에 오염되면 게이트가 무의미해진다 → 반드시 신규 컨텍스트,
    입력은 문항 텍스트 + typeId + 이론 출처로 한정.
  - Step 6의 실제 `vercel --prod`는 사용자 Vercel 계정 인증이 필요 → 빌드 검증까지만 자율 수행하고
    배포 직전에 멈춘다.
  - metadataBase 잠정 상수를 유효한 URL로 넣지 않으면 첫 빌드가 TypeError로 실패(계획 §10-1).
- **Files**: docs/sources.md(완료), .omc/plans/enneagram-test-site.md, .omc/plans/open-questions.md
- **Remaining**: Step 0, 2, 2.5, 3, 4, 5, 6

### 확정값 (open-questions.md에서)
- 역채점: 유형당 정확히 2개 (총 18/90)
- 윙 표시(페이지): `윙은 이론적 해석이며 검증된 측정 결과가 아닙니다.`
- 윙 표시(카드): `윙 — 이론적 해석`
- 면책 문구: open-questions.md 하단 블록 전문
