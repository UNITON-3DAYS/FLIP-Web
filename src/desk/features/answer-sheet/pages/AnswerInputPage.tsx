import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import Dropdown from '@/components/Dropdown'
import type { AnswerPage } from '@/desk/answers'
import { loadAnswerKey, saveAnswerKey } from '@/desk/answers'
import { createDeskWorksheet } from '@/desk/api'
import type { ExamType } from '@/types'

const SOURCE_BY_LABEL: Record<ExamType, 'INHOUSE' | 'EXTERNAL'> = {
  시험지: 'INHOUSE',
  '외부 교재': 'EXTERNAL',
}
const EXAM_TYPES = Object.keys(SOURCE_BY_LABEL) as ExamType[]

// 정답 데이터가 없는 문제지용 빈 틀 (1~20번 단일 페이지)
const emptyPages = (): AnswerPage[] => [
  {
    page: '',
    questions: Array.from({ length: 20 }, (_, i) => ({
      no: String(i + 1),
      type: 'subjective' as const,
      answer: '',
    })),
  },
]

// "0046" → "46번" 표기
const questionLabel = (no: string) => `${Number.parseInt(no, 10) || no}번`

function AnswerInputPage() {
  const navigate = useNavigate()
  // 목록에서 진입하면 title 쿼리가 있고(기존 문제지), 만들기로 오면 새 문제지 등록 흐름
  const existingTitle = useSearchParams()[0].get('title')
  const [title, setTitle] = useState(existingTitle ?? '')
  const [examType, setExamType] = useState<ExamType>('시험지')
  const [pages, setPages] = useState<AnswerPage[]>(
    () => (existingTitle ? loadAnswerKey(existingTitle) : null) ?? emptyPages(),
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setAnswer = (pageIndex: number, questionIndex: number, answer: string) => {
    setPages((prev) =>
      prev.map((page, pi) =>
        pi === pageIndex
          ? {
              ...page,
              questions: page.questions.map((q, qi) =>
                qi === questionIndex ? { ...q, answer } : q,
              ),
            }
          : page,
      ),
    )
  }

  const save = async () => {
    if (title.trim() === '') return
    setSaving(true)
    setError(null)
    try {
      // 새 문제지는 서버에 등록, 정답 자체는 API가 없어 로컬(목)에 저장 (BE 정답 API 대기)
      if (!existingTitle)
        await createDeskWorksheet({ title: title.trim(), source: SOURCE_BY_LABEL[examType] })
      saveAnswerKey(title.trim(), pages)
      navigate('/answer-sheets')
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장에 실패했어요.')
      setSaving(false)
    }
  }

  return (
    <section>
      <Link to="/answer-sheets" className="text-sm font-medium text-gray-600">
        ‹ 답안지
      </Link>

      <div className="mt-4 rounded-[10px] bg-white p-6">
        <h1 className="text-lg font-bold text-gray-900">답안 입력</h1>
        <div className="mt-4 flex max-w-sm flex-col gap-3">
          <label className="flex flex-col gap-1 rounded-xl bg-gray-200 px-5 py-4">
            <span className="text-xs font-medium text-gray-700">타이틀</span>
            <input
              className="bg-transparent text-base outline-none placeholder:text-gray-600 disabled:text-gray-700"
              placeholder="타이틀 입력"
              value={title}
              disabled={existingTitle != null}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          {!existingTitle && (
            <Dropdown
              value={examType}
              options={EXAM_TYPES}
              onChange={(value) => setExamType(value as ExamType)}
            />
          )}
        </div>

        {pages.map((page, pageIndex) => (
          <div key={page.page || pageIndex}>
            <p className="mt-6 text-sm font-bold text-gray-800">
              {page.page !== '' ? `${page.page}p 문항별 정답` : '문항별 정답'}
            </p>
            <div className="mt-3 grid grid-cols-5 gap-3 lg:grid-cols-7">
              {page.questions.map((question, questionIndex) => (
                <label key={question.no} className="flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-600">
                    {questionLabel(question.no)}
                    {question.type === 'multiple_choice' ? ' (객관식)' : ''}
                  </span>
                  <input
                    className="h-10 w-full rounded-lg border border-gray-300 text-center text-sm outline-none focus:border-primary-300"
                    value={question.answer}
                    onChange={(e) => setAnswer(pageIndex, questionIndex, e.target.value)}
                  />
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            disabled={saving || title.trim() === ''}
            onClick={() => void save()}
            className="rounded-full bg-primary-300 px-6 py-2.5 text-sm font-bold text-white disabled:bg-gray-400"
          >
            {saving ? '저장 중...' : '저장'}
          </button>
          {error && <span className="text-sm font-medium text-secondary">{error}</span>}
        </div>
      </div>
    </section>
  )
}

export default AnswerInputPage
