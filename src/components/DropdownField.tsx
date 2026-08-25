import { useState } from 'react'

import iconChevronDown from '@/assets/icon-chevron-down.svg'

interface DropdownFieldProps {
  label: string
  placeholder: string
  value: string
  options: string[]
  onChange: (value: string) => void
}

// 학교/학년/교재 선택용 커스텀 드롭다운 — OS 네이티브 픽커 대신 서비스 UI로 통일
export default function DropdownField({
  label,
  placeholder,
  value,
  options,
  onChange,
}: DropdownFieldProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="relative flex w-full flex-col gap-1 rounded-xl bg-gray-200 px-5 py-4 text-left"
      >
        <span className="text-xs font-medium text-gray-700">{label}</span>
        <span className={`text-base ${value === '' ? 'text-gray-600' : ''}`}>
          {value === '' ? placeholder : value}
        </span>
        <img
          src={iconChevronDown}
          alt=""
          className={`absolute top-1/2 right-4 w-4 -translate-y-1/2 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="선택 닫기"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <ul className="absolute top-full right-0 left-0 z-20 mt-2 overflow-hidden rounded-xl bg-white py-1 shadow-lg">
            {options.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option)
                    setOpen(false)
                  }}
                  className={`w-full px-5 py-3 text-left text-base ${
                    option === value ? 'bg-[#EDFFFD] font-bold text-primary-400' : 'text-gray-900'
                  }`}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
