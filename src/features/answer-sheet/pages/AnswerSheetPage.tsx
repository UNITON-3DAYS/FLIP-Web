// TODO(ui): Frame 20 - 답안지 목록 (문제지 유형/타이틀/답안 입력, 검색)
function AnswerSheetPage() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">답안지</h1>
        <div className="h-9 w-40 rounded-full bg-gray-300" /> {/* TODO(ui): 검색 */}
      </div>
      <div className="rounded-2xl bg-gray-200 p-6">
        <div className="mb-4 grid grid-cols-3 text-sm font-medium text-gray-600">
          <span>문제지 유형</span>
          <span>타이틀</span>
          <span>답안 입력</span>
        </div>
        <div className="h-72" />
      </div>
    </section>
  )
}

export default AnswerSheetPage
