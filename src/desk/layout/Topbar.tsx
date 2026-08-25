function Topbar() {
  const today = new Date()
  const dateLabel = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(
    today.getDate(),
  ).padStart(2, '0')}`

  return (
    <header className="flex h-16 shrink-0 items-center justify-between rounded-[10px] bg-white px-6">
      <p className="font-bold text-gray-800">오늘도 채점은 채킷이 할게요</p>
      <span className="rounded-full border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700">
        {dateLabel}
      </span>
    </header>
  )
}

export default Topbar
