# 채킷(CHECKIT) 채점 API 명세 v0.1

테스트용 최소 명세. 프론트는 이 구조로 구현되어 있고, `VITE_API_BASE_URL`이 없으면 목 데이터로 동작한다.

- 인증: 없음 (해커톤 범위)
- Content-Type: 요청은 `multipart/form-data`(업로드) 또는 없음(GET), 응답은 `application/json`
- 에러 공통 형식:

```json
{ "error": { "code": "IMAGE_REQUIRED", "message": "이미지가 없습니다" } }
```

## 1. 채점 요청

`POST /api/gradings`

촬영한 페이지 이미지들을 업로드하면 채점 결과를 반환한다. **동기 처리**(응답까지 수 초).

multipart/form-data 필드:

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `images` | file[] (jpeg) | O | 촬영 순서대로 N장. 1장 이상 |
| `examType` | `EXAM` \| `BOOK` | O | 시험지 / 외부 교재 |
| `title` | string | O | 사용자가 입력한 타이틀 |
| `bookName` | string | BOOK일 때 O | 교재명 (예: 쎈 2-1) |

응답 `201 Created` → **GradingRecord** (아래 공통 스키마)

에러:
- `400 IMAGE_REQUIRED` — 이미지 0장
- `422 UNREADABLE_IMAGE` — 판독 불가 (문제지가 아니거나 심하게 흐림). `message`에 몇 번째 장인지 포함 권장

## 2. 채점 내역 조회

`GET /api/gradings`

응답 `200`:

```json
{ "items": [GradingRecord, ...] }
```

- 정렬: 최신순 고정
- 페이지네이션 없음 (필요해지면 `?cursor=` + `meta.next_cursor`로 확장)

## 3. 채점 결과 상세

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
| `wrongAnswers[].page` | 촬영한 몇 번째 장인지 (1부터) |
| `wrongAnswers[].number` | 문항 번호 |
| `bookName` | `examType`이 `EXAM`이면 `null` |

## 확장 예정 (지금은 구현하지 않음)

- 채점이 10초를 넘으면: `POST`가 `202` + `{ "id" }`만 반환하고 프론트가 `GET /api/gradings/{id}` 폴링 (`status: "PENDING" | "DONE"` 필드 추가)
- 사용자 인증 / 사용자별 내역 분리
