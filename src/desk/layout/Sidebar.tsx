import { NavLink } from 'react-router-dom'

import Logo from '@/components/Logo'

const NAV_ITEMS = [
  { to: '/students', label: '학생 관리' },
  { to: '/grading', label: '채점 내역' },
  { to: '/answer-sheets', label: '답안지' },
] as const

function Sidebar() {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 shrink-0 items-center px-6">
        <Logo className="text-2xl" />
      </div>
      <nav className="mt-2 flex flex-1 flex-col gap-1 px-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `rounded-xl px-4 py-2.5 text-sm ${
                isActive
                  ? 'bg-primary-50 font-bold text-primary-400'
                  : 'font-medium text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="flex items-center gap-3 border-t border-gray-200 p-4">
        <div className="flex size-9 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-400">
          김
        </div>
        <div>
          <p className="text-sm font-bold text-gray-800">김채킷 선생님</p>
          <p className="text-xs text-gray-600">채킷 수학학원</p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
