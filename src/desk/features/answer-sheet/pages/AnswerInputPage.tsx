import { useState } from 'react'
import { Link } from 'react-router-dom'

const QUESTION_COUNT = 20

function AnswerInputPage() {
  const [saved, setSaved] = useState(false)

  return (
    <section>
      <Link to="/answer-sheets" className="text-sm font-medium text-gray-600">
        ‹ 답안지
      </Link>

      <div className="mt-4 rounded-[10px] bg-white p-6">
        <h1 className="text-lg font-bold text-gray-900">답안 입력</h1>
        <label className="mt-4 flex max-w-sm flex-col gap-1 rounded-xl bg-gray-200 px-5 py-4">
          <span className="text-xs font-medium text-gray-700">타이틀</span>
          <input
            className="bg-transparent text-base outline-none placeholder:text-gray-600"
            placeholder="타이틀 입력"
            onChange={() => setSaved(false)}
          />
        </label>

        <p className="mt-6 text-sm font-bold text-gray-800">문항별 정답</p>
        <div className="mt-3 grid grid-cols-5 gap-3 lg:grid-cols-10">
          {Array.from({ length: QUESTION_COUNT }, (_, i) => i + 1).map((number) => (
            <label key={number} className="flex flex-col items-center gap-1">
              <span className="text-xs text-gray-600">{number}번</span>
              <input
                className="h-10 w-full rounded-lg border border-gray-300 text-center text-sm outline-none focus:border-primary-300"
                onChange={() => setSaved(false)}
              />
            </label>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSaved(true)}
            className="rounded-full bg-primary-300 px-6 py-2.5 text-sm font-bold text-white"
          >
            저장
          </button>
          {saved && <span className="text-sm font-medium text-primary-400">저장되었습니다</span>}
        </div>
      </div>
    </section>
  )
}

export default AnswerInputPage
