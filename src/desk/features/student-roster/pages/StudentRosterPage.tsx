import { useRef, useState } from 'react'
import type { FormEvent } from 'react'

import Dropdown from '@/components/Dropdown'
import ViewChip from '@/components/ViewChip'
import type { DeskStudentView } from '@/desk/api'
import { getDeskStudents } from '@/desk/api'
import { SCHOOLS } from '@/desk/mock'
import { useAsync } from '@/hooks/useAsync'

const GRADES = ['1학년', '2학년', '3학년'] as const

function StudentRosterPage() {
  const { data: serverStudents, loading, error } = useAsync(getDeskStudents, [])
  // 학생 추가·삭제 API는 서버에 없어 화면 상태로만 반영한다 (데모용)
  const [extra, setExtra] = useState<DeskStudentView[]>([])
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set())
  const students = [...(serverStudents ?? []), ...extra].filter(
    (student) => !removedIds.has(student.id),
  )
  const dialogRef = useRef<HTMLDialogElement>(null)
  const deleteDialogRef = useRef<HTMLDialogElement>(null)
  const [name, setName] = useState('')
  const [school, setSchool] = useState('')
  const [grade, setGrade] = useState<string>(GRADES[0])
  const [deleteTarget, setDeleteTarget] = useState<DeskStudentView | null>(null)

  const addStudent = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !school) return
    setExtra([...extra, { id: `s-${Date.now()}`, name: name.trim(), school, grade }])
    setName('')
    setSchool('')
    dialogRef.current?.close()
  }

  const askRemove = (student: DeskStudentView) => {
    setDeleteTarget(student)
    deleteDialogRef.current?.showModal()
  }

  const confirmRemove = () => {
    if (deleteTarget) setRemovedIds(new Set([...removedIds, deleteTarget.id]))
    deleteDialogRef.current?.close()
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">학생 정보 관리</h1>
        <button
          type="button"
          onClick={() => dialogRef.current?.showModal()}
          className="flex items-center gap-1.5 rounded-full bg-primary-300 py-2 pr-4 pl-3 text-sm font-bold text-white"
        >
          <svg className="size-5" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path
              d="M10 4.5v11M4.5 10h11"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          학생 추가
        </button>
      </div>
      <div className="overflow-hidden rounded-[10px] bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-600">
              <th className="px-6 py-3 font-medium">이름</th>
              <th className="px-6 py-3 font-medium">학교</th>
              <th className="px-6 py-3 font-medium">학년</th>
              <th className="px-6 py-3 text-right font-medium">상세보기</th>
            </tr>
          </thead>
          <tbody>
            {(loading || error || students.length === 0) && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-600">
                  {loading ? '불러오는 중...' : (error ?? '등록된 학생이 없어요.')}
                </td>
              </tr>
            )}
            {students.map((student) => (
              <tr key={student.id} className="border-b border-gray-100 last:border-0">
                <td className="px-6 py-4 font-bold text-gray-800">{student.name}</td>
                <td className="px-6 py-4 text-gray-700">{student.school || '—'}</td>
                <td className="px-6 py-4 text-gray-700">{student.grade}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-3">
                    <ViewChip to={`/students/${student.id}`} />
                    <button
                      type="button"
                      onClick={() => askRemove(student)}
                      aria-label={`${student.name} 삭제`}
                      className="text-gray-600 hover:text-secondary"
                    >
                      <svg className="size-5" viewBox="0 0 20 20" fill="none" aria-hidden>
                        <path
                          d="M4 5.5h12M8 3h4M6.5 5.5 7 16.5a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1l.5-11M8.5 8.5v6M11.5 8.5v6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dialog
        ref={dialogRef}
        className="m-auto w-80 rounded-[10px] bg-white p-6 backdrop:bg-black/40"
      >
        <h2 className="text-lg font-bold text-gray-900">학생 추가</h2>
        <form onSubmit={addStudent} className="mt-4 flex flex-col gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름"
            required
            className="h-10 rounded-[10px] border border-gray-300 px-3 text-sm outline-none placeholder:text-gray-600 focus:border-primary-300"
          />
          <Dropdown value={school} options={SCHOOLS} placeholder="학교 선택" onChange={setSchool} />
          <Dropdown value={grade} options={GRADES} onChange={setGrade} />
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="flex-1 rounded-full bg-gray-200 py-2 text-sm font-bold text-gray-700"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 rounded-full bg-primary-300 py-2 text-sm font-bold text-white"
            >
              추가
            </button>
          </div>
        </form>
      </dialog>

      <dialog
        ref={deleteDialogRef}
        className="m-auto w-80 rounded-[10px] bg-white p-6 backdrop:bg-black/40"
      >
        <h2 className="text-lg font-bold text-gray-900">학생 삭제</h2>
        <p className="mt-3 text-sm text-gray-700">
          <span className="font-bold">{deleteTarget?.name}</span> 학생을 삭제할까요?
          <br />
          채점 기록도 함께 사라집니다.
        </p>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={() => deleteDialogRef.current?.close()}
            className="flex-1 rounded-full bg-gray-200 py-2 text-sm font-bold text-gray-700"
          >
            취소
          </button>
          <button
            type="button"
            onClick={confirmRemove}
            className="flex-1 rounded-full bg-secondary py-2 text-sm font-bold text-white"
          >
            삭제
          </button>
        </div>
      </dialog>
    </section>
  )
}

export default StudentRosterPage
