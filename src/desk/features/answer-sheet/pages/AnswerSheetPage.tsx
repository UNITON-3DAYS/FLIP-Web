import { Link } from 'react-router-dom'

import { ANSWER_SHEETS } from '@/desk/mock'

function AnswerSheetPage() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">답안지</h1>
        <Link
          to="/answer-sheets/input"
          className="rounded-full bg-primary-300 px-4 py-2 text-sm font-bold text-white"
        >
          + 답안지 만들기
        </Link>
      </div>
      <div className="overflow-hidden rounded-[10px] bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-600">
              <th className="px-6 py-3 font-medium">문제지 유형</th>
              <th className="px-6 py-3 font-medium">타이틀</th>
              <th className="px-6 py-3 text-right font-medium">답안</th>
            </tr>
          </thead>
          <tbody>
            {ANSWER_SHEETS.map((sheet) => (
              <tr key={sheet.id} className="border-b border-gray-100 last:border-0">
                <td className="px-6 py-4 text-gray-700">{sheet.examType}</td>
                <td className="px-6 py-4 font-bold text-gray-800">{sheet.title}</td>
                <td className="px-6 py-4 text-right">
                  {sheet.filled ? (
                    <span className="text-gray-600">입력 완료</span>
                  ) : (
                    <Link to="/answer-sheets/input" className="font-bold text-primary-400">
                      답안 입력 ›
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default AnswerSheetPage
