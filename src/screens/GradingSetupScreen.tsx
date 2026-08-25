import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { ExamType, GradingSetup } from '@/types'

const EXAM_TYPES: ExamType[] = ['시험지', '외부 교재']
const BOOKS = ['쎈 2-1', '개념원리 2-1', 'RPM 2-1', '일품 2-1']

export default function GradingSetupScreen() {
  const navigate = useNavigate()
  const [examType, setExamType] = useState<ExamType>('시험지')
  const [title, setTitle] = useState('')
  const [bookName, setBookName] = useState('')

  const canSubmit = title.trim() !== '' && (examType === '시험지' || bookName !== '')

  const submit = () => {
    const setup: GradingSetup = {
      examType,
      title: title.trim(),
      bookName: examType === '외부 교재' ? bookName : undefined,
    }
    // replace: 채점 완료 후 뒤로가기 시 설정 화면으로 재진입하지 않게 스택에서 제거
    navigate('/grading/camera', { state: setup, replace: true })
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-white px-6 pt-16 pb-8">
      <h1 className="text-2xl font-bold">문제 유형 입력</h1>

      <p className="mt-10 text-sm font-semibold text-gray-800">문제지 유형</p>
      <div className="mt-2 grid grid-cols-2 gap-3">
        {EXAM_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setExamType(type)}
            className={`rounded-xl border py-3 text-sm font-bold ${
              examType === type
                ? 'border-gray-1000 bg-gray-200 text-gray-1000'
                : 'border-gray-400 bg-gray-100 text-gray-600'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {examType === '외부 교재' && (
        <label className="mt-6 flex flex-col gap-2 text-sm font-semibold text-gray-800">
          교재 선택
          <select
            className="w-full rounded-xl border border-gray-400 bg-gray-100 px-4 py-3 text-base outline-none focus:border-gray-800"
            value={bookName}
            onChange={(e) => setBookName(e.target.value)}
          >
            <option value="" disabled>
              교재를 선택하세요
            </option>
            {BOOKS.map((book) => (
              <option key={book} value={book}>
                {book}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="mt-6 flex flex-col gap-2 text-sm font-semibold text-gray-800">
        타이틀
        <input
          className="w-full rounded-xl border border-gray-400 bg-gray-100 px-4 py-3 text-base outline-none focus:border-gray-800"
          value={title}
          placeholder="예) 오답 점검 1회차"
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      <button
        type="button"
        disabled={!canSubmit}
        onClick={submit}
        className="mt-auto rounded-xl bg-gray-1000 py-4 text-base font-bold text-white disabled:bg-gray-400 disabled:text-gray-600"
      >
        촬영 시작
      </button>
    </main>
  )
}
