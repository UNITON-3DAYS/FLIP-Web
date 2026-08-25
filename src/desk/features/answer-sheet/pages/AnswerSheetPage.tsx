import { Link } from 'react-router-dom'

import { EXAM_TYPE_BY_SOURCE } from '@/desk/api'
import { useAsync } from '@/hooks/useAsync'
import { getWorksheets } from '@/services/api'

function AnswerSheetPage() {
  const { data: worksheets, loading, error } = useAsync(getWorksheets, [])

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
            {(loading || error || (worksheets ?? []).length === 0) && (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-gray-600">
                  {loading ? '불러오는 중...' : (error ?? '등록된 문제지가 없어요.')}
                </td>
              </tr>
            )}
            {(worksheets ?? []).map((sheet) => (
              <tr key={sheet.worksheetId} className="border-b border-gray-100 last:border-0">
                <td className="px-6 py-4 text-gray-700">
                  {EXAM_TYPE_BY_SOURCE[sheet.source] ?? sheet.source}
                </td>
                <td className="px-6 py-4 font-bold text-gray-800">{sheet.title}</td>
                <td className="px-6 py-4 text-right">
                  <Link to="/answer-sheets/input" className="font-bold text-primary-400">
                    답안 입력 ›
                  </Link>
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
