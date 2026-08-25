// TODO(ui): Frame 1 - 학생 정보 관리 목록 (이름/학년/상세보기 + 추가/삭제 버튼)
function StudentRosterPage() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">학생 정보 관리</h1>
        <div className="h-9 w-32 rounded-full bg-gray-300" /> {/* TODO(ui): 학생 추가/삭제 버튼 */}
      </div>
      <div className="rounded-2xl bg-gray-200 p-6">
        <div className="mb-4 grid grid-cols-3 text-sm font-medium text-gray-600">
          <span>이름</span>
          <span>학년</span>
          <span>상세보기</span>
        </div>
        <div className="h-72" />
      </div>
    </section>
  )
}

export default StudentRosterPage
