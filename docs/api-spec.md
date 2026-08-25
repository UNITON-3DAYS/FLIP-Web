# 채킷(CHECKIT) 채점 API 명세 v0.2

테스트용 최소 명세. 프론트는 이 구조로 구현되어 있고, `VITE_API_BASE_URL`이 없으면 목 데이터로 동작한다.

v0.1 → v0.2: 촬영 종료 시 일괄 업로드 → **촬영할 때마다 장당 업로드**로 변경 (종료 후 대기 시간 제거, 버저 간격 동안 업로드 진행).

- 인증: 없음 (해커톤 범위)
- 응답은 `application/json`
- 에러 공통 형식:

```json
{ "error": { "code": "SESSION_NOT_FOUND", "message": "세션이 없습니다" } }
```

## 1. 채점 세션 시작

`POST /api/grading-sessions`

촬영 시작 시 호출. JSON body:

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `examType` | `EXAM` \| `BOOK` | O | 시험지 / 외부 교재 |
| `title` | string | O | 사용자가 입력한 타이틀 |
| `bookName` | string \| null | BOOK일 때 O | 교재명 (예: 쎈 2-1) |

응답 `201 Created`:

```json
{ "id": "550e8400-e29b-41d4-a716-446655440000" }
```

## 2. 페이지 업로드 (촬영할 때마다)

`POST /api/grading-sessions/{id}/pages`

버저가 울려 캡처될 때마다 프론트가 즉시 호출한다. multipart/form-data:

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `image` | file (jpeg) | O | 캡처 1장 |
| `seq` | int | O | 촬영 순서 (1부터) |

응답 `200`: `{ "seq": 3 }` — 수신 확인만. 채점·분석은 complete 시점에.

- **같은 `seq` 재업로드는 덮어쓴다** (프론트가 실패 시 재시도하므로 멱등이어야 함)
- `404 SESSION_NOT_FOUND`

## 3. 채점 완료 요청

`POST /api/grading-sessions/{id}/complete`

촬영 종료 시 호출. 수신된 페이지 전체를 채점하고 결과를 동기 반환한다.

응답 `200` → **GradingRecord** (아래 공통 스키마)

에러:
- `400 NO_PAGES` — 수신된 페이지 0장
- `422 UNREADABLE_IMAGE` — 판독 불가 (문제지가 아니거나 심하게 흐림). `message`에 몇 번째 장인지 포함 권장
- `404 SESSION_NOT_FOUND`

## 4. 채점 내역 조회

`GET /api/gradings`

응답 `200`:

```json
{ "items": [GradingRecord, ...] }
```

- 정렬: 최신순 고정
- 페이지네이션 없음 (필요해지면 `?cursor=` + `meta.next_cursor`로 확장)

## 5. 채점 결과 상세

`GET /api/gradings/{id}`

응답 `200` → **GradingRecord** / `404 NOT_FOUND`

## 공통 스키마: GradingRecord

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "examType": "BOOK",
  "bookName": "쎈 2-1",
  "title": "오답 점검 1회차",
  "range": "p.12 ~ p.18",
  "date": "2026-08-25",
  "score": 82,
  "correctCount": 16,
  "totalCount": 20,
  "wrongAnswers": [{ "page": 1, "number": 3 }]
}
```

| 필드 | 설명 |
| --- | --- |
| `range` | 서버가 이미지에서 자동 추출한 문제 범위 문자열 |
| `date` | 채점일 `YYYY-MM-DD` (KST) |
| `score` | 0~100 정수 |
| `wrongAnswers[].page` | 촬영한 몇 번째 장인지 (1부터, `seq`와 동일 기준) |
| `wrongAnswers[].number` | 문항 번호 |
| `bookName` | `examType`이 `EXAM`이면 `null` |

## 확장 예정 (지금은 구현하지 않음)

- complete가 10초를 넘으면: `202` + 프론트가 `GET /api/gradings/{id}` 폴링 (`status: "PENDING" | "DONE"` 필드 추가)
- 세션 만료 정책 (미완료 세션 정리)
- 사용자 인증 / 사용자별 내역 분리
