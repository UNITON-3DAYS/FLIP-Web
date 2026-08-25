import { useState } from 'react'

import ViewChip from '@/components/ViewChip'
import { GRADINGS, studentById } from '@/desk/mock'

function GradingLogPage() {
  const [query, setQuery] = useState('')

  const rows = GRADINGS.map((grading) => ({
    ...grading,
    student: studentById(grading.studentId),
  })).filter(
    (row) => row.title.includes(query.trim()) || (row.student?.name ?? '').includes(query.trim()),
  )

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">채점 내역</h1>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="이름·타이틀 검색"
          className="h-9 w-56 rounded-full border border-gray-300 bg-white px-4 text-sm outline-none placeholder:text-gray-600 focus:border-primary-300"
        />
      </div>
      <div className="overflow-hidden rounded-[10px] bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-600">
              <th className="px-6 py-3 font-medium">날짜</th>
              <th className="px-6 py-3 font-medium">이름</th>
              <th className="px-6 py-3 font-medium">학년</th>
              <th className="px-6 py-3 font-medium">문제지 유형</th>
              <th className="px-6 py-3 font-medium">타이틀</th>
              <th className="px-6 py-3 text-right font-medium">상세 채점 결과</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-600">
                  검색 결과가 없어요.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-6 py-4 text-gray-700">{row.date.replaceAll('-', '.')}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">{row.student?.name}</td>
                  <td className="px-6 py-4 text-gray-700">{row.student?.grade}</td>
                  <td className="px-6 py-4 text-gray-700">{row.examType}</td>
                  <td className="px-6 py-4 text-gray-700">{row.title}</td>
                  <td className="px-6 py-4 text-right">
                    <ViewChip to={`/grading/${row.id}`} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default GradingLogPage
