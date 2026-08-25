import { useState } from 'react'

interface DropdownProps {
  value: string
  options: readonly string[]
  placeholder?: string
  onChange: (value: string) => void
}

// 대시보드 톤의 커스텀 드롭다운 (네이티브 select 대체)
export default function Dropdown({ value, options, placeholder, onChange }: DropdownProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-full items-center justify-between rounded-[10px] border border-gray-300 bg-white px-3 text-sm outline-none focus:border-primary-300"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-600'}>{value || placeholder}</span>
        <svg
          className={`size-4 text-gray-600 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
        >
          <path
            d="m4 6 4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <button
          type="button"
          aria-label="닫기"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-10 cursor-default"
        />
      )}
      {/* in-flow + grid-rows 트랜지션: 모달이 잘리지 않고 부드럽게 함께 늘어난다 */}
      <div
        className={`grid transition-all duration-200 ease-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'pointer-events-none grid-rows-[0fr] opacity-0'
        }`}
      >
        <ul className="relative z-20 mt-1 min-h-0 overflow-hidden rounded-[10px] border border-gray-200 bg-white shadow-lg">
          {options.map((option) => (
            <li key={option}>
              <button
                type="button"
                tabIndex={open ? 0 : -1}
                onClick={() => {
                  onChange(option)
                  setOpen(false)
                }}
                className={`w-full px-3 py-2 text-left text-sm ${
                  option === value
                    ? 'bg-primary-50 font-bold text-primary-400'
                    : 'text-gray-800 hover:bg-gray-100'
                }`}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
