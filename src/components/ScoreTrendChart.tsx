const W = 560
const H = 200
const PAD_X = 28
const PAD_TOP = 34
const PAD_BOTTOM = 30

// 점수 추이 라인 차트 — 의존성 없이 인라인 SVG (y축 0~100 고정)
// x축 라벨은 호출부가 정한다 (현재 정책: 시간순 정렬된 타이틀)
function ScoreTrendChart({ points }: { points: { label: string; score: number }[] }) {
  const sorted = points
  const innerW = W - PAD_X * 2
  const innerH = H - PAD_TOP - PAD_BOTTOM

  const x = (i: number) =>
    sorted.length === 1 ? W / 2 : PAD_X + (i * innerW) / (sorted.length - 1)
  const y = (score: number) => PAD_TOP + innerH * (1 - score / 100)
  const shorten = (label: string) => (label.length > 8 ? `${label.slice(0, 8)}…` : label)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
      {[0, 50, 100].map((score) => (
        <line
          key={score}
          x1={PAD_X}
          y1={y(score)}
          x2={W - PAD_X}
          y2={y(score)}
          stroke="var(--color-gray-200)"
        />
      ))}
      {sorted.length > 1 && (
        <polyline
          points={sorted.map((p, i) => `${x(i)},${y(p.score)}`).join(' ')}
          fill="none"
          stroke="var(--color-primary-300)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {sorted.map((p, i) => (
        <g key={p.label + i}>
          <circle
            cx={x(i)}
            cy={y(p.score)}
            r="5"
            fill="white"
            stroke="var(--color-primary-300)"
            strokeWidth="2.5"
          />
          <text
            x={x(i)}
            y={y(p.score) - 14}
            textAnchor="middle"
            fontSize="13"
            fontWeight="700"
            fill="var(--color-primary-400)"
          >
            {p.score}
          </text>
          <text
            x={x(i)}
            y={H - 8}
            textAnchor="middle"
            fontSize="12"
            fill="var(--color-gray-600)"
          >
            {shorten(p.label)}
          </text>
        </g>
      ))}
    </svg>
  )
}

export default ScoreTrendChart
