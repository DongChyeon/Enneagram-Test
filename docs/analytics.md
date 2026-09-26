# 지표 측정과 PostHog 운영

이 문서는 실제 코드가 수집하는 이벤트와 계산 방법을 정리한다. 목표는 **검사를 시작한
사람이 자기 결과 화면까지 도달하는 비율**을 높이는 것이다. 개인의 응답을 분석하거나
재방문자를 추적하지 않는다.

구현 파일은 [`lib/analytics.ts`](../lib/analytics.ts),
[`ProductAnalytics.tsx`](../components/ProductAnalytics.tsx),
[`TestRunner.tsx`](../components/TestRunner.tsx),
[`ShareActions.tsx`](../components/ShareActions.tsx),
[`ResultNextStep.tsx`](../components/ResultNextStep.tsx)다.

## 활성화와 환경변수

PostHog Cloud 프로젝트를 만든 뒤 해당 프로젝트의 공개 프로젝트 키와 수집 호스트를
설정한다. 개인 API 키나 관리용 비밀 키를 브라우저에 넣지 않는다.

| 환경변수 | 값과 용도 |
| --- | --- |
| `NEXT_PUBLIC_POSTHOG_ENABLED` | 정확히 `true`일 때만 활성화. 기본 예시는 `false` |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog 프로젝트 키. 비어 있으면 전송하지 않음 |
| `NEXT_PUBLIC_POSTHOG_HOST` | 프로젝트 리전에 맞는 수집 주소. 미국은 `https://us.i.posthog.com`, 유럽은 `https://eu.i.posthog.com`. 생략 시 미국 주소 |

Vercel에서는 이 사이트 **프로젝트의 Environment Variables**에 등록한다. 운영 데이터에
미리보기·개발 데이터를 섞지 않도록 Production 환경에만 활성화한다. `NEXT_PUBLIC_` 값은
빌드에 포함되므로 변경 후 새로 빌드·배포해야 한다. 참고 파일은 [`.env.example`](../.env.example)이다.

`NODE_ENV=production`, 활성화 값, 프로젝트 키가 모두 갖춰져야 수집한다. 개발 서버에서는
키가 있어도 수집하지 않는다. 초기화나 전송 실패가 검사 진행을 막지 않도록 처리했다.
PostHog SDK는 수집 조건이 갖춰졌을 때만 동적으로 불러온다. 비활성 빌드에서는 SDK를 받지 않고,
SDK를 불러오는 동안 발생한 이벤트는 순서대로 대기했다가 전송한다. 로딩에 실패하면 대기 중인
이벤트는 버린다. 대기했던 이벤트의 `timestamp`, `$current_url`, `$pathname`은 발생 시점이 아니라
**전송 시점** 값이다. 예를 들어 SDK 로딩 전에 검사로 넘어가면 `landing_viewed`가 `/test` 경로로
기록될 수 있다. 퍼널은 이벤트 이름·속성과 순서로 계산하므로 영향이 없고, 이미 떠난 화면의
페이지뷰는 잘못된 경로로 남기지 않도록 건너뛴다.

무료로 운영하려면 PostHog의 현재 무료 제공량과 사용량을 확인하고, 가능한 과금 한도와
알림을 설정한다. 자동 클릭·히트맵도 사용량을 늘릴 수 있으므로 무료 운영을 코드가
보장하지는 않는다. 계정 생성, 키 발급, 과금 설정, 실제 클라우드 수신 확인은 별도 운영
절차이며 이 저장소의 테스트로 완료되지 않는다.

## PostHog 콘솔 설정 체크리스트

코드만으로 보장되지 않아 PostHog 웹 콘솔에서 직접 설정해야 하는 항목이다. 메뉴 이름은
PostHog 개편에 따라 바뀔 수 있으므로 설정 검색창에서 항목 이름으로 찾는다. 사이트의
[개인정보 처리방침](../app/privacy/page.tsx)이 이 설정을 전제로 쓰였으므로, 설정을 바꾸면
처리방침도 함께 고친다.

| 순서 | 위치 | 설정 | 이유 |
| --- | --- | --- | --- |
| 1 | 프로젝트 생성 | 리전(US/EU) 선택 후 `NEXT_PUBLIC_POSTHOG_HOST`를 같은 리전으로 설정 | 리전은 생성 후 바꿀 수 없다. 리전을 바꾸면 처리방침의 국외 이전 국가도 수정 |
| 2 | Project settings | **Discard client IP data** 켬 | SDK의 `ip: false`로는 `$ip` 저장이 막히지 않는다. 처리방침의 "IP 주소는 저장하지 않도록 설정" 근거 |
| 3 | Project settings | 세션 녹화(Session replay), 설문(Surveys) 끔 | 코드에서도 끄지만 콘솔에서도 꺼 두어 SDK 설정 변경 실수를 막는다 |
| 4 | Data management / 보관 기간 | 이벤트 보관 기간을 **1년 이하**로 설정. 플랜에서 지정할 수 없으면 1년 지난 데이터를 정기 삭제 | 처리방침의 "최대 1년 보관" 근거 |
| 5 | Billing | 제품별 과금 한도(billing limit)와 사용량 알림 설정 | 트래픽 급증 시 무료 제공량 초과 과금 방지 |
| 6 | Organization settings | 구성원 최소화, 2단계 인증 필수 | 대시보드 접근 통제 |
| 7 | Project settings | 프로젝트 토큰(`phc_...`)만 Vercel 환경변수에 등록. Personal API key는 발급하더라도 저장소·브라우저에 넣지 않음 | 프로젝트 토큰은 공개용이지만 Personal API key는 관리 권한이 있다 |

설정 후 운영 빌드에서 이벤트를 하나 발생시키고, PostHog의 Activity(수신 이벤트) 화면에서
해당 이벤트에 `$ip` 속성이 비어 있는지 확인한다.

## 수집 범위

| 화면 | 명시적 이벤트 | 자동 클릭 | 히트맵 | 페이지뷰 |
| --- | --- | --- | --- | --- |
| 랜딩 `/` | 랜딩 조회 | 링크·버튼 클릭 | 허용 | 허용 |
| 검사 `/test` | 시작·진행 구간·완료 | 차단 | 차단 | 차단 |
| 결과 `/result/...` | 결과 조회·영역 클릭·공유·다음 행동 | 민감 영역을 제외한 링크·버튼 클릭 | **차단** | 허용 |
| 기타 화면 | 해당 화면에 구현된 이벤트만 | 차단 | 차단 | 차단 |

처음 논의한 결과 화면 히트맵은 구현하지 않았다. 히트맵 좌표 수집은 `ph-no-capture`만으로
민감한 응답 근거를 제외할 수 없어서, **랜딩에서만** 허용한다. 결과 화면에서는 제한된
자동 클릭과 명시적 영역 클릭 이벤트로 관심도를 확인한다.

검사 전체와 결과의 응답 근거·상황 비교 영역에는 `ph-no-capture`를 적용했다. 해당 영역은
명시적 영역 클릭에서도 제외한다. 자동 수집은 클릭만 허용하며 입력·변경·폼 제출·복사한
텍스트를 수집하지 않는다.

## 명시적 이벤트 사전

아래 표의 속성 외에는 이벤트별 허용 목록에서 제거한다. 모든 값이 항상 존재하는 것은
아니며 유효하지 않거나 전달하지 않은 값도 제거한다.

| 이벤트 | 발생 시점 | 허용 속성 |
| --- | --- | --- |
| `landing_viewed` | 랜딩이 브라우저에서 마운트될 때 | `entry_kind`, `device_class` |
| `test_started` | 검사 저장 상태 복원이 끝나고 진행 화면이 준비될 때. 첫 답변 전에도 발생 | `test_stage`, `entry_kind`, `resumed` |
| `test_progress_reached` | 현재 검사 계획의 응답 수가 25·50·75·100%에 도달할 때 | `test_stage`, `progress_percent`, `question_index`, `elapsed_bucket` |
| `test_completed` | 완료 버튼을 눌러 채점·결과 생성이 성공했을 때. 결과 페이지 이동 **전** | `test_stage`, `duration_bucket`, `primary_type`, `ambiguous_result` |
| `result_viewed` | 결과 화면이 브라우저에서 마운트될 때 | `result_stage`, `primary_type`, `viewer_context` |
| `result_section_engaged` | 표시된 결과 영역 안을 클릭할 때. 읽기·스크롤·체류 시간은 아님 | `section`, `result_stage`, `primary_type` |
| `share_attempted` | 각 공유 수단을 시도할 때 | `channel`, `result_stage`, `primary_type` |
| `share_succeeded` | 해당 공유 API가 성공으로 처리될 때 | `channel`, `result_stage`, `primary_type` |
| `share_failed` | 공유 API 실패·취소·미지원 시 | `channel`, `reason_code` |
| `detail_cta_clicked` | 본인의 기본 결과에서 자세히 이어보기 링크 클릭 | `primary_type`, `source_section` |
| `try_my_test_clicked` | 공유받은 결과에서 내 검사 시작 링크 클릭 | `shared_primary_type`, `source_section` |

### 속성 값과 의미

- `test_stage`: `base`는 기본 검사, `detail`은 이어하기 또는 직접 전체 검사다.
- `result_stage`: `full` 결과만 `detail`로, 기본·기존 단축 결과는 `base`로 분류한다.
- `entry_kind`: 현재 구현은 `direct` 또는 `shared_result`. 공유받은 결과의 시작 링크를
  누른 뒤 **처음 시작한 검사 한 번**만 `shared_result`로 표시하고 표시를 지운다. 그 뒤 같은 탭의
  이어하기 검사는 `direct`다. 외부 리퍼러·카카오·인스타 유입 판별값은 아니다.
- `device_class`: 랜딩 화면 너비 기준 `mobile`(<768px), `tablet`(<1024px), `desktop`.
  실제 기기 모델이나 사용자 에이전트가 아니다.
- `resumed`: 검사 화면이 저장된 진행 상태로 복원됐는지 나타내는 불리언이다.
- `progress_percent`: `25`, `50`, `75`, `100`. `question_index`는 해당 구간의 기준 응답 수다.
  기본 27문항에서는 7·14·21·27, 이어하기 63문항에서는 16·32·48·63이다.
  현재 보고 있는 문항 번호나 특정 문항 ID가 아니다.
- `elapsed_bucket`, `duration_bucket`: `under_1m`, `1_3m`, `3_5m`, `5_10m`, `over_10m`.
  각각 1분 미만, 1분 이상 3분 미만, 3분 이상 5분 미만, 5분 이상 10분 미만, 10분 이상이다.
  정확한 소요 시간을 보내지 않는다.
- `primary_type`, `shared_primary_type`: 1~9의 대표 유형 번호. 날개·전체 점수·응답은 제외한다.
- `ambiguous_result`: 채점 결과의 유형 구분이 뚜렷하지 않은지 나타내는 불리언이다.
- `viewer_context`: 현재 구현은 `owner` 또는 `shared`. 브라우저의 결과 소유 기록으로
  판단하므로 다른 기기에서 연 본인 결과도 `shared`가 될 수 있다.
- `section`: `radar_profile`, `score_distribution`, `compatibility`, `characters`,
  `personalized_insights`. 어느 다른 유형을 펼쳤는지는 별도로 수집하지 않는다.
- `channel`: `kakao`, `web_share`, `copy_link`, `image`.
- `reason_code`: `cancelled`, `unsupported`, `permission_denied`, `sdk_unavailable`, `unknown`.
  `permission_denied`는 복사 실패에 사용하는 분류이며 실제 브라우저 권한 오류로 확정한 값은 아니다.
- `source_section`: 현재 두 CTA는 모두 `next_step`을 보낸다. 허용 목록에는 `hero`,
  `footer`, `result`, `personalized_insights`, `sticky`도 있지만 현재 구현의 발생 위치는 아니다.
- 허용 목록에 있는 `entry_kind`, `device_class`, `viewer_context`의 `unknown`은 예약값이다.

### 자동 이벤트와 공통 정보

자동 이벤트는 `$pageview`, `$autocapture`, `$$heatmap`만 통과시킨다.
`$pageview`는 SDK의 자동 페이지뷰가 아니라 허용 경로로 이동할 때 코드에서 호출한다.

- 공통: 프로젝트 `token`, 임시 `distinct_id`, SDK가 제공하는 `$session_id`, `$window_id`,
  `$lib`, `$lib_version` 문자열과 이벤트 `uuid`, `timestamp`를 유지한다.
- `$current_url`은 사이트 origin과 정규화된 경로만, `$pathname`은 `/`, `/result`,
  `/test`, `/other` 중 하나만 보낸다. 쿼리·해시·결과 코드는 제거한다.
- 자동 클릭은 `$event_type=click`, 요소의 `tag_name`, `nth_child`, `nth_of_type`만 남긴다.
  텍스트, ID, 클래스, 링크 주소, 다른 HTML 속성은 보내지 않는다.
- 히트맵은 랜딩 URL에 속한 좌표 `x`, `y`, 동작 `type`, `target_fixed`만 남긴다.
  SDK가 히트맵 버퍼를 최대 5초 늦게 보내고 수집을 끄면 버퍼를 비우므로, 수집은 켜 둔 채
  전송 직전에 **기록된 URL이 `/`인 좌표만** 남긴다. 그래서 시작 버튼을 누르고 검사 화면으로
  넘어간 뒤 전송된 랜딩 클릭도 유지되고, 검사·결과 화면 좌표는 브라우저 밖으로 나가지 않는다.
  허용 동작은 `click`, `mousemove`, `rageclick`, `deadclick`이지만 별도 rage/dead-click
  수집은 설정상 꺼져 있다. 스크롤 깊이·읽은 시간은 별도 수집하지 않는다.

## 익명 흐름과 개인정보 경계

- SDK 영속 저장은 끄고 메모리만 사용한다. 분석용 쿠키와 localStorage는 사용하지 않는다.
- 앱은 난수 ID, 중복 방지 표시, 검사 시작 시각, 공유 결과 진입 표시를 `sessionStorage`에
  저장한다. 시작 시각은 검사 완료 시, 진입 표시는 첫 검사 시작 시 지운다. 쿠키를 쓰지 않는다는 뜻이지 브라우저 저장소를 전혀 쓰지 않는다는 뜻은 아니다.
- 난수 `distinct_id`는 같은 SPA 탐색 흐름과 새로고침을 연결한다. 새 문서로 이동하거나
  새 탭에서 열면 새 ID를 만든다. 장기간 재방문자·서로 다른 탭을 연결하지 않는다.
- 랜딩 조회는 흐름당 한 번, 검사 시작·완료는 단계당 한 번, 진행은 단계·백분율당 한 번,
  결과 조회는 단계·대표 유형·조회 맥락(`owner`/`shared`) 조합당 한 번 기록한다.
  공유받은 X유형 결과를 본 사람이 검사해서 같은 X유형이 나와도 본인 결과 조회가 따로 남는다. 나머지 클릭·공유는 반복 기록한다.
- 사용자 프로필, identify, 세션 녹화, 설문, 성능, 예외 자동 수집, 캠페인·리퍼러 저장,
  기능 플래그 수집과 외부 의존성 자동 로딩은 끈다.
- `$geoip_disable: true`로 IP 기반 위치 보강만 끈다. SDK의 `ip: false`는 기본값일 뿐
  PostHog가 요청의 IP를 `$ip`로 저장하는 것을 막지 않는다. IP를 저장하지 않으려면 PostHog
  프로젝트 설정에서 **Discard client IP data**를 켠다. 켜더라도 외부 SaaS로 요청을 보내므로
  수신 서버가 네트워크 연결의 IP를 볼 수 없다고 보장하는 것은 아니다. 서비스 제공자의 처리·보관 정책은 별도로 확인해야 한다.
- 문항 원문·개별 선택·응답 배열·점수 분포·결과 코드·이름·이메일·리퍼러를 분석 이벤트로
  보내지 않는다. 이름을 지운 난수 데이터도 다른 정보와 연결 가능성이 전혀 없다고
  단정하지 않는다.

## 지표와 계산 방법

PostHog에서 말하는 고유 사용자는 여기서는 **임시 익명 흐름**이다. 실제 사람 수나 검사
시도 수와 같지 않다. 서로 다른 이벤트의 총횟수를 단순 나누지 말고 같은 흐름의 순차
퍼널로 계산한다. 우선 전환 창은 24시간으로 고정하고 기간별 비교에도 같은 설정을 쓴다.

| 지표 | 퍼널 또는 집계 |
| --- | --- |
| **기본 검사 결과 도달률 — 1순위** | `test_started(test_stage=base)` → `test_completed(test_stage=base)` → `result_viewed(result_stage=base, viewer_context=owner)`. 마지막 단계에 도달한 고유 흐름 ÷ 시작 흐름 |
| 채점 완료율 | 위 퍼널의 `test_completed` 도달률. 페이지가 실제 표시됐다는 의미와 구분 |
| 구간별 이탈률 | 시작 → 진행 25 → 50 → 75 → 100 → 완료의 단계별 전환율을 보고 `1 - 다음 단계 도달 흐름 / 현재 단계 흐름` 계산 |
| 랜딩에서 시작한 비율 | `landing_viewed` → `test_started(test_stage=base)`. 랜딩을 거치지 않은 직접 진입은 분모에서 제외 |
| 결과 영역 관심도 | `result_viewed` → `result_section_engaged(section=관심 영역)`. 결과 단계·대표 유형별 비교 |
| 공유 시도율·처리 성공률 | `result_viewed` → `share_attempted` → `share_succeeded`. 채널별 시도 대비 처리 성공도 따로 비교 |
| 공유 실패 원인 | `share_failed` 횟수를 `channel`, `reason_code`로 분류. 실패 이벤트에는 유형·단계가 없음 |
| 자세한 검사 전환율 | 본인 기본 결과 → `detail_cta_clicked` → `test_started(test_stage=detail)` → `test_completed(test_stage=detail)` |
| 공유 결과에서 검사 시작률 | `result_viewed(viewer_context=shared)` → `try_my_test_clicked` → `test_started(entry_kind=shared_result)` |
| 소요 시간 분포 | 진행 이벤트의 `elapsed_bucket`, 완료 이벤트의 `duration_bucket`별 횟수. 정확한 중앙값은 계산하지 않음 |

### PostHog 대시보드 만들기

1. Product Analytics에서 새 Insight를 만들고 Funnel을 선택한다.
2. 첫 카드에 위 표의 **기본 검사 결과 도달률** 3단계를 넣는다. 각 단계에 이벤트 속성
   필터를 따로 적용하고, 순서는 **Sequential**로 설정한다. 자동 클릭이 중간에 섞이므로
   Strict order를 사용하지 않는다.
3. 전환 창 24시간, 조회 기간 최근 7일로 시작한다. Overall conversion은 시작 대비,
   Relative conversion은 직전 단계 대비 전환율을 보여준다. 아직 전환 창이 지나지 않은
   최근 유입은 최종 이탈로 해석하지 않는다.
4. 두 번째 Funnel에는 기본 검사 시작·25·50·75·100·완료를 넣는다. 진행 이벤트는 같은
   이름을 네 번 사용하되 `progress_percent` 필터를 각각 다르게 지정한다.
5. 결과 관심도·공유·상세 검사·공유받은 결과 전환을 별도 Insight로 저장한다. 결과 유형
   비교는 결과 이벤트의 `primary_type`으로, 공유 채널 비교는 공유 이벤트의 `channel`로
   분류한다. 분류 속성이 없는 시작 단계에 전역 필터를 걸어 분모를 없애지 않는다.
6. Trends에 완료 시간 구간과 공유 실패 원인 분포를 추가하고 하나의 대시보드에 저장한다.
   사용자 프로필 속성이 아니라 **이벤트 속성**으로 필터링한다.

메뉴와 전환 옵션은 [PostHog Funnel 문서](https://posthog.com/docs/product-analytics/funnels),
저장·배치는 [Dashboard 문서](https://posthog.com/docs/product-analytics/dashboards)를 참고한다.
대시보드는 저장소에서 자동 생성하지 않는다.

## 해석할 때 주의할 점

- `share_succeeded`는 상대에게 전달됐거나 상대가 열었다는 뜻이 아니다. 카카오는 SDK
  공유창 호출 성공, Web Share와 이미지 공유는 Promise resolve, 링크 복사는 클립보드
  쓰기 성공이다. 실제 메시지 전송·수신 여부는 알 수 없다.
- 한 클릭에서 카카오 실패 → Web Share 실패 → 복사 성공처럼 여러 채널 이벤트가 발생할
  수 있다. 공유 시도 총횟수를 공유 버튼 클릭 수로 해석하지 않는다.
- 모든 응답을 채워도 완료 버튼을 누르지 않으면 진행 100%만 기록되고 완료는 없다.
- 응답을 복원하면 이미 지난 구간 이벤트가 한 번에 발생할 수 있다. 처음부터 진행한
  흐름과 복원 흐름(`resumed`)은 분리해서 본다.
- 진행 구간 이탈은 전환 창 내 다음 이벤트가 없다는 추정이다. 창 닫힘을 확정하는
  `test_abandoned` 이벤트, 개별 문항 이탈, 이탈 이유는 수집하지 않는다.
- 단계당 중복 방지 때문에 같은 SPA 흐름에서 다시 푼 검사는 별도 시도로 집계되지 않는다.
  시작 시각에 대기·백그라운드 시간이 포함되고 같은 단계 재시작 시 남아 있을 수 있다.
- 결과 영역의 클릭은 흥미의 대리 지표일 뿐 읽음·만족도는 아니다. 민감 영역은 제외되고,
  점수 분포에서 펼친 상대 유형까지 식별하지 않으므로 세부 관심 유형 순위는 알 수 없다.
- 공유 링크에 추적 ID를 넣지 않으므로 특정 공유자의 행동과 수신자의 검사를 연결하는
  추천인 분석은 하지 않는다. 새로운 방문·새로고침으로 ID나 중복 방지 조건이 달라지는
  경우와 광고 차단·네트워크 실패에 따른 누락도 고려한다.

## 검증과 문제 확인

자동 회귀 검증:

```bash
npm test -- lib/analytics.test.ts components/ProductAnalytics.test.tsx
```

검증 대상은 활성화 조건, 속성 허용 목록, URL 정규화, 검사 화면 자동 수집 차단, 랜딩 전용
히트맵, 흐름 중복 방지, 기본 검사 퍼널, 민감 영역 클릭 제외, 공유 복사 결과다. SDK를
모킹한 테스트이므로 실제 PostHog 수신·히트맵 표시를 보장하지는 않는다.

활성화한 운영 빌드에서는 브라우저 Network와 PostHog의 수신 이벤트 화면을 함께 확인한다.

1. 랜딩에서 조회·클릭 이벤트와 랜딩 히트맵 데이터가 도착하는지 확인한다.
2. 기본 검사를 완료해 시작·25·50·75·100·완료·결과 조회의 순서를 확인한다.
3. 전송 본문에 문항 답변, 결과 코드, 쿼리, 리퍼러, 요소 텍스트가 없는지 확인한다.
4. 검사 화면 자동 클릭·페이지뷰·히트맵과 결과 화면 히트맵이 없는지 확인한다.
5. 결과의 민감 영역 클릭은 수집되지 않고, 공유와 다음 행동 이벤트는 수집되는지 확인한다.
6. 새로고침 시 중복이 생기지 않는지, 새 탭은 다른 `distinct_id`인지 확인한다.

| 증상 | 확인할 사항 |
| --- | --- |
| 이벤트가 전혀 없음 | production 빌드인지, 활성화 값이 `true`인지, 프로젝트 키와 리전이 맞는지, 환경변수 수정 후 재빌드했는지, 광고 차단·요청 실패가 있는지 |
| 검사 페이지뷰가 없음 | 정상. 검사 화면에서는 명시적 퍼널 이벤트만 전송 |
| 재검사·재조회 수가 예상보다 적음 | 흐름·단계별 중복 방지와 결과 단계·유형별 중복 방지 확인 |
| 결과 히트맵이 없음 | 정상. 랜딩만 허용. 결과는 명시적 영역 이벤트로 분석 |
| 이벤트에 `$ip`가 남음 | PostHog 프로젝트 설정의 Discard client IP data가 켜져 있는지 확인 |
| 자동 클릭의 버튼 문구가 없음 | 정상. DOM 텍스트·속성을 제거하므로 의미별 분석은 명시적 이벤트 사용 |
| API 성공은 보이나 실제 공유 수를 모름 | 정상. 공유 API 성공과 실제 상대방 전달은 다름 |

설정 의미는 [PostHog JS 설정 문서](https://posthog.com/docs/libraries/js/config)를 참고한다.
개인정보 경계를 바꾸는 SDK 업그레이드나 설정 변경은 회귀 테스트와 실제 전송 본문 확인을
함께 수행한다.
