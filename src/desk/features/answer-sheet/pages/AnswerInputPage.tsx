import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Dropdown from '@/components/Dropdown'
import { createDeskWorksheet } from '@/desk/api'
import type { ExamType } from '@/types'

const QUESTION_COUNT = 20
const SOURCE_BY_LABEL: Record<ExamType, 'INHOUSE' | 'EXTERNAL'> = {
  시험지: 'INHOUSE',
  '외부 교재': 'EXTERNAL',
}
const EXAM_TYPES = Object.keys(SOURCE_BY_LABEL) as ExamType[]

function AnswerInputPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [examType, setExamType] = useState<ExamType>('시험지')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const save = async () => {
    if (title.trim() === '') return
    setSaving(true)
    setError(null)
    try {
      // 문항별 정답은 서버 API가 아직 없어 문제지 등록만 반영된다 (BE 정답 API 대기)
      await createDeskWorksheet({ title: title.trim(), source: SOURCE_BY_LABEL[examType] })
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
              className="bg-transparent text-base outline-none placeholder:text-gray-600"
              placeholder="타이틀 입력"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <Dropdown
            value={examType}
            options={EXAM_TYPES}
            onChange={(value) => setExamType(value as ExamType)}
          />
        </div>

        <p className="mt-6 text-sm font-bold text-gray-800">문항별 정답</p>
        <div className="mt-3 grid grid-cols-5 gap-3 lg:grid-cols-10">
          {Array.from({ length: QUESTION_COUNT }, (_, i) => i + 1).map((number) => (
            <label key={number} className="flex flex-col items-center gap-1">
              <span className="text-xs text-gray-600">{number}번</span>
              <input className="h-10 w-full rounded-lg border border-gray-300 text-center text-sm outline-none focus:border-primary-300" />
            </label>
          ))}
        </div>

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
