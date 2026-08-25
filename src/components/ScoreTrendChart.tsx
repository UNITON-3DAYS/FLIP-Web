const W = 560
const H = 200
const PAD_X = 28
const PAD_TOP = 34
const PAD_BOTTOM = 38

// 점수 추이 라인 차트 — 의존성 없이 인라인 SVG (y축 0~100 고정)
// x축 라벨은 호출부가 정한다 (현재 정책: 시간순 정렬된 타이틀)
function ScoreTrendChart({ points }: { points: { label: string; score: number }[] }) {
  const sorted = points
  const innerW = W - PAD_X * 2
  const innerH = H - PAD_TOP - PAD_BOTTOM

  const x = (i: number) =>
    sorted.length === 1 ? W / 2 : PAD_X + (i * innerW) / (sorted.length - 1)
  const y = (score: number) => PAD_TOP + innerH * (1 - score / 100)
  // 긴 타이틀은 자르지 않고 어절 기준 두 줄로 감싼다
  const splitLabel = (label: string) => {
    const words = label.split(' ')
    if (words.length < 2) return [label]
    const mid = Math.ceil(words.length / 2)
    return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
  }

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
          {/* 양 끝 라벨은 차트 밖으로 잘리지 않게 안쪽 정렬 */}
          <text
            x={i === 0 ? 8 : i === sorted.length - 1 ? W - 8 : x(i)}
            y={H - 20}
            textAnchor={i === 0 ? 'start' : i === sorted.length - 1 ? 'end' : 'middle'}
            fontSize="11"
            fill="var(--color-gray-600)"
          >
            {splitLabel(p.label).map((line, lineIndex) => (
              <tspan
                key={lineIndex}
                x={i === 0 ? 8 : i === sorted.length - 1 ? W - 8 : x(i)}
                dy={lineIndex === 0 ? 0 : 14}
              >
                {line}
              </tspan>
            ))}
          </text>
        </g>
      ))}
    </svg>
  )
}

export default ScoreTrendChart
