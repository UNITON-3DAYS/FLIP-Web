// TODO(ui): Frame 2 - 채점 내역 목록 (날짜/이름/학년/문제지 유형/타이틀/상세 채점 결과, 검색/최신순 정렬)
function GradingLogPage() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">채점 내역</h1>
        <div className="h-9 w-40 rounded-full bg-gray-300" /> {/* TODO(ui): 검색 / 최신순 정렬 */}
      </div>
      <div className="rounded-2xl bg-gray-200 p-6">
        <div className="mb-4 grid grid-cols-6 text-sm font-medium text-gray-600">
          <span>날짜</span>
          <span>이름</span>
          <span>학년</span>
          <span>문제지 유형</span>
          <span>타이틀</span>
          <span>상세 채점 결과</span>
        </div>
        <div className="h-72" />
      </div>
    </section>
  )
}

export default GradingLogPage
