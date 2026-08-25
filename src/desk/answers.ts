// 답안지(정답) 목 저장소 — 정답 입력 API가 아직 없어 시드 + localStorage로 동작한다.
// BE에 정답 API가 생기면 이 파일만 services 호출로 교체.
export interface AnswerQuestion {
  no: string
  type: 'multiple_choice' | 'subjective'
  answer: string
}

export interface AnswerPage {
  page: string
  questions: AnswerQuestion[]
}

// 쎈-수학-2-1 실제 정답 (팀 제공 데이터, p.12~22)
const SEED: Record<string, AnswerPage[]> = {
  '쎈-수학-2-1': [
  {
    "page": "12",
    "questions": [
      {
        "no": "0046",
        "type": "multiple_choice",
        "answer": "2"
      },
      {
        "no": "0047",
        "type": "subjective",
        "answer": "3"
      },
      {
        "no": "0048",
        "type": "multiple_choice",
        "answer": "2, 3"
      },
      {
        "no": "0049",
        "type": "multiple_choice",
        "answer": "3"
      },
      {
        "no": "0050",
        "type": "multiple_choice",
        "answer": "4"
      },
      {
        "no": "0051",
        "type": "subjective",
        "answer": "5"
      },
      {
        "no": "0052",
        "type": "multiple_choice",
        "answer": "5"
      }
    ]
  },
  {
    "page": "13",
    "questions": [
      {
        "no": "0053",
        "type": "subjective",
        "answer": "3"
      },
      {
        "no": "0054",
        "type": "multiple_choice",
        "answer": "1, 4"
      },
      {
        "no": "0055",
        "type": "multiple_choice",
        "answer": "2"
      },
      {
        "no": "0056",
        "type": "multiple_choice",
        "answer": "3"
      },
      {
        "no": "0057",
        "type": "subjective",
        "answer": "72"
      },
      {
        "no": "0058",
        "type": "subjective",
        "answer": "2"
      }
    ]
  },
  {
    "page": "14",
    "questions": [
      {
        "no": "0059",
        "type": "multiple_choice",
        "answer": "4"
      },
      {
        "no": "0060",
        "type": "subjective",
        "answer": "19"
      },
      {
        "no": "0061",
        "type": "subjective",
        "answer": "181"
      },
      {
        "no": "0062",
        "type": "multiple_choice",
        "answer": "3"
      },
      {
        "no": "0063",
        "type": "multiple_choice",
        "answer": "2, 4"
      },
      {
        "no": "0064",
        "type": "subjective",
        "answer": "91"
      }
    ]
  },
  {
    "page": "15",
    "questions": [
      {
        "no": "0065",
        "type": "multiple_choice",
        "answer": "2, 3"
      },
      {
        "no": "0066",
        "type": "multiple_choice",
        "answer": "3"
      },
      {
        "no": "0067",
        "type": "multiple_choice",
        "answer": "5"
      },
      {
        "no": "0068",
        "type": "multiple_choice",
        "answer": "1"
      },
      {
        "no": "0069",
        "type": "subjective",
        "answer": "1"
      },
      {
        "no": "0070",
        "type": "subjective",
        "answer": "85"
      }
    ]
  },
  {
    "page": "16",
    "questions": [
      {
        "no": "0071",
        "type": "multiple_choice",
        "answer": "3"
      },
      {
        "no": "0072",
        "type": "multiple_choice",
        "answer": "4"
      },
      {
        "no": "0073",
        "type": "subjective",
        "answer": "3"
      },
      {
        "no": "0074",
        "type": "subjective",
        "answer": "94"
      },
      {
        "no": "0075",
        "type": "subjective",
        "answer": "143"
      },
      {
        "no": "0076",
        "type": "multiple_choice",
        "answer": "3"
      }
    ]
  },
  {
    "page": "17",
    "questions": [
      {
        "no": "0077",
        "type": "multiple_choice",
        "answer": "4"
      },
      {
        "no": "0078",
        "type": "subjective",
        "answer": "57"
      },
      {
        "no": "0079",
        "type": "multiple_choice",
        "answer": "2"
      },
      {
        "no": "0080",
        "type": "subjective",
        "answer": "31"
      },
      {
        "no": "0081",
        "type": "subjective",
        "answer": "a=99, b=20"
      },
      {
        "no": "0082",
        "type": "multiple_choice",
        "answer": "3"
      }
    ]
  },
  {
    "page": "18",
    "questions": [
      {
        "no": "0083",
        "type": "multiple_choice",
        "answer": "3, 5"
      },
      {
        "no": "0084",
        "type": "multiple_choice",
        "answer": "2, 4"
      },
      {
        "no": "0085",
        "type": "multiple_choice",
        "answer": "5"
      },
      {
        "no": "0086",
        "type": "subjective",
        "answer": "세영, 강욱"
      },
      {
        "no": "0087",
        "type": "multiple_choice",
        "answer": "2"
      },
      {
        "no": "0088",
        "type": "subjective",
        "answer": "ㄱ, ㄴ"
      }
    ]
  },
  {
    "page": "19",
    "questions": [
      {
        "no": "0089",
        "type": "multiple_choice",
        "answer": "4"
      },
      {
        "no": "0090",
        "type": "multiple_choice",
        "answer": "2, 4"
      },
      {
        "no": "0091",
        "type": "multiple_choice",
        "answer": "5"
      },
      {
        "no": "0092",
        "type": "subjective",
        "answer": "11/9"
      },
      {
        "no": "0093",
        "type": "multiple_choice",
        "answer": "4"
      },
      {
        "no": "0094",
        "type": "multiple_choice",
        "answer": "2"
      }
    ]
  },
  {
    "page": "20",
    "questions": [
      {
        "no": "0095",
        "type": "multiple_choice",
        "answer": "4"
      },
      {
        "no": "0096",
        "type": "multiple_choice",
        "answer": "4"
      },
      {
        "no": "0097",
        "type": "subjective",
        "answer": "900/11"
      },
      {
        "no": "0098",
        "type": "multiple_choice",
        "answer": "1"
      },
      {
        "no": "0099",
        "type": "multiple_choice",
        "answer": "3"
      },
      {
        "no": "0100",
        "type": "subjective",
        "answer": "13"
      },
      {
        "no": "0101",
        "type": "subjective",
        "answer": "55/24"
      }
    ]
  },
  {
    "page": "21",
    "questions": [
      {
        "no": "0102",
        "type": "multiple_choice",
        "answer": "3"
      },
      {
        "no": "0103",
        "type": "multiple_choice",
        "answer": "2"
      },
      {
        "no": "0104",
        "type": "subjective",
        "answer": "7"
      },
      {
        "no": "0105",
        "type": "subjective",
        "answer": "3"
      },
      {
        "no": "0106",
        "type": "multiple_choice",
        "answer": "5"
      },
      {
        "no": "0107",
        "type": "multiple_choice",
        "answer": "4"
      },
      {
        "no": "0108",
        "type": "multiple_choice",
        "answer": "2, 4"
      }
    ]
  },
  {
    "page": "22",
    "questions": [
      {
        "no": "0109",
        "type": "subjective",
        "answer": "11"
      },
      {
        "no": "0110",
        "type": "subjective",
        "answer": "132"
      },
      {
        "no": "0111",
        "type": "multiple_choice",
        "answer": "4, 5"
      },
      {
        "no": "0112",
        "type": "multiple_choice",
        "answer": "5"
      },
      {
        "no": "0113",
        "type": "multiple_choice",
        "answer": "4"
      },
      {
        "no": "0114",
        "type": "multiple_choice",
        "answer": "2"
      }
    ]
  }
],
}

const KEY = 'checkit_answer_keys'

const loadSaved = (): Record<string, AnswerPage[]> => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}') as Record<string, AnswerPage[]>
  } catch {
    return {}
  }
}

// 저장분이 시드보다 우선한다
export const loadAnswerKey = (title: string): AnswerPage[] | null =>
  loadSaved()[title] ?? SEED[title] ?? null

export const hasAnswerKey = (title: string): boolean => loadAnswerKey(title) !== null

export function saveAnswerKey(title: string, pages: AnswerPage[]): void {
  const saved = loadSaved()
  saved[title] = pages
  localStorage.setItem(KEY, JSON.stringify(saved))
}
