interface InlineSvgProps {
  raw: string // vite `?raw` import
  className?: string
  label?: string
}

// iOS Safari가 <img>로 불러온 SVG의 mask/filter를 자주 깨뜨려서 DOM에 인라인 렌더한다
export default function InlineSvg({ raw, className, label }: InlineSvgProps) {
  return (
    <div
      role={label ? 'img' : undefined}
      aria-label={label}
      className={className}
      dangerouslySetInnerHTML={{ __html: raw }}
    />
  )
}
