import { NavLink } from 'react-router-dom'

// TODO(ui): 실제 디자인 확정 전까지는 뼈대용 스타일입니다.
const NAV_ITEMS = [
  { to: '/students', label: '학생 관리' },
  { to: '/grading', label: '채점 내역' },
  { to: '/answer-sheets', label: '답안지' },
] as const

function Sidebar() {
  return (
    <aside className="flex w-48 shrink-0 flex-col gap-1 border-r border-gray-200 bg-gray-50 p-3">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `rounded px-3 py-2 text-sm ${isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-200'}`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </aside>
  )
}

export default Sidebar
