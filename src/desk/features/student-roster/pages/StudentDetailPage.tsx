import { Link, useParams } from 'react-router-dom'

import { GRADINGS, studentById } from '@/desk/mock'

function StudentDetailPage() {
  const { studentId } = useParams()
  const student = studentById(studentId)
  const gradings = GRADINGS.filter((grading) => grading.studentId === studentId)

  if (!student) {
    return (
      <section className="text-sm text-gray-600">
        학생을 찾을 수 없어요.{' '}
        <Link to="/students" className="font-bold text-primary-400">
          목록으로
        </Link>
      </section>
    )
  }

  const average =
    gradings.length === 0
      ? null
      : Math.round(gradings.reduce((sum, g) => sum + g.score, 0) / gradings.length)

  return (
    <section>
      <Link to="/students" className="text-sm font-medium text-gray-600">
        ‹ 학생 정보 관리
      </Link>

      <div className="mt-4 flex items-center gap-4 rounded-[10px] bg-white p-6">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-400">
          {student.name[0]}
        </div>
        <div className="flex-1">
          <p className="text-lg font-bold text-gray-900">{student.name}</p>
          <p className="text-sm text-gray-600">{student.grade}</p>
        </div>
        {average !== null && (
          <div className="text-right">
            <p className="text-xs text-gray-600">평균 점수</p>
            <p className="text-2xl font-black text-primary-300">{average}점</p>
          </div>
        )}
      </div>

      <h2 className="mt-6 mb-3 text-sm font-bold text-gray-800">채점 기록</h2>
      {gradings.length === 0 ? (
        <p className="rounded-[10px] bg-white p-6 text-sm text-gray-600">
          아직 채점 기록이 없어요.
        </p>
      ) : (
        <div className="overflow-hidden rounded-[10px] bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-600">
                <th className="px-6 py-3 font-medium">날짜</th>
                <th className="px-6 py-3 font-medium">문제지 유형</th>
                <th className="px-6 py-3 font-medium">타이틀</th>
                <th className="px-6 py-3 font-medium">점수</th>
                <th className="px-6 py-3 text-right font-medium">상세</th>
              </tr>
            </thead>
            <tbody>
              {gradings.map((grading) => (
                <tr key={grading.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-6 py-4 text-gray-700">{grading.date.replaceAll('-', '.')}</td>
                  <td className="px-6 py-4 text-gray-700">{grading.examType}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">{grading.title}</td>
                  <td className="px-6 py-4 font-bold text-primary-400">{grading.score}점</td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/grading/${grading.id}`} className="font-bold text-primary-400">
                      보기 ›
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default StudentDetailPage
