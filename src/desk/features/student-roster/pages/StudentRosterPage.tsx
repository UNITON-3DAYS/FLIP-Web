import { useState } from 'react'
import { Link } from 'react-router-dom'

import { STUDENTS } from '@/desk/mock'

function StudentRosterPage() {
  const [students, setStudents] = useState(STUDENTS)

  const addStudent = () => {
    setStudents([
      ...students,
      { id: `s-${Date.now()}`, name: `새 학생 ${students.length + 1}`, grade: '중1' },
    ])
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">학생 정보 관리</h1>
        <button
          type="button"
          onClick={addStudent}
          className="rounded-full bg-primary-300 px-4 py-2 text-sm font-bold text-white"
        >
          + 학생 추가
        </button>
      </div>
      <div className="overflow-hidden rounded-[10px] bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-600">
              <th className="px-6 py-3 font-medium">이름</th>
              <th className="px-6 py-3 font-medium">학년</th>
              <th className="px-6 py-3 text-right font-medium">상세보기</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b border-gray-100 last:border-0">
                <td className="px-6 py-4 font-bold text-gray-800">{student.name}</td>
                <td className="px-6 py-4 text-gray-700">{student.grade}</td>
                <td className="px-6 py-4 text-right">
                  <Link to={`/students/${student.id}`} className="font-bold text-primary-400">
                    보기 ›
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

export default StudentRosterPage
