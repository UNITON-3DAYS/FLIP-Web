// TODO(ui): 실제 디자인 확정 전까지는 뼈대용 스타일입니다. (검색/알림/유저 메뉴 등은 디자인 확정 후 추가)
function Topbar() {
  return (
    <header className="flex h-16 shrink-0 items-center border-b border-gray-200 bg-white px-8">
      <span className="text-sm font-medium text-gray-400">FLIP</span>
    </header>
  )
}

export default Topbar
