interface ScoreDonutProps {
  score: number
  correctCount: number
  totalCount: number
}

// 상세 채점 결과의 도넛 차트 (연민트 링 + 중앙 점수)
export default function ScoreDonut({ score, correctCount, totalCount }: ScoreDonutProps) {
  const radius = 80
  const circumference = 2 * Math.PI * radius

  return (
    <div className="relative mx-auto w-56">
      <svg viewBox="0 0 220 220" className="w-full">
        <circle cx="110" cy="110" r={radius} fill="none" stroke="var(--color-gray-100)" strokeWidth="42" />
        <circle
          cx="110"
          cy="110"
          r={radius}
          fill="none"
          stroke="var(--color-primary-200)"
          strokeWidth="42"
          strokeDasharray={`${(score / 100) * circumference} ${circumference}`}
          transform="rotate(-90 110 110)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-4xl font-black text-primary-300">{score}점</p>
        <p className="mt-1 text-lg font-bold text-gray-800">
          {correctCount}/{totalCount}
        </p>
      </div>
    </div>
  )
}
