import { NavLink } from 'react-router-dom'

// TODO(ui): 실제 디자인 확정 전까지는 뼈대용 스타일입니다.
const NAV_ITEMS = [
  { to: '/students', label: '학생 관리' },
  { to: '/grading', label: '채점 내역' },
  { to: '/answer-sheets', label: '답안지' },
] as const

function Sidebar() {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-gray-200 bg-gray-50">
      <div className="flex h-16 shrink-0 items-center px-5">
        <div className="size-8 rounded-md bg-gray-300" /> {/* TODO(ui): 로고 */}
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `rounded-lg px-4 py-2.5 text-sm font-medium ${isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-200'}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="flex items-center gap-3 border-t border-gray-200 p-4">
        <div className="size-9 rounded-full bg-gray-300" /> {/* TODO(ui): 프로필 */}
      </div>
    </aside>
  )
}

export default Sidebar
