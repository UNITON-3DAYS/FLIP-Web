import { Link } from 'react-router-dom'

// 대시보드 표의 '보기' 버튼 — primary/50 배경, 라운딩 100 chip
function ViewChip({ to }: { to: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1 rounded-full bg-primary-50 py-1.5 pr-2.5 pl-3.5 text-sm font-bold text-primary-400"
    >
      보기
      <svg className="size-4" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M6 3.5 10.5 8 6 12.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  )
}

export default ViewChip
