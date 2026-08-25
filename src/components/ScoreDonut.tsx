interface ScoreDonutProps {
  score: number
  correctCount: number
  totalCount: number
  fractionOnly?: boolean // 외부 교재: 점수 대신 정답/전체를 메인으로 표시
}

// 상세 채점 결과의 도넛 차트 — 디자인 실측: 링 바깥지름 190, 안쪽 홀 132 (두께 29)
const SIZE = 190
const STROKE = 29
const RADIUS = (SIZE - STROKE) / 2 // 80.5 — 링 중심선

export default function ScoreDonut({
  score,
  correctCount,
  totalCount,
  fractionOnly = false,
}: ScoreDonutProps) {
  const circumference = 2 * Math.PI * RADIUS
  const ratio = fractionOnly ? (totalCount > 0 ? correctCount / totalCount : 0) : score / 100

  return (
    <div className="relative mx-auto w-[190px]">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full">
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--color-gray-100)"
          strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--color-primary-200)"
          strokeWidth={STROKE}
          strokeDasharray={`${ratio * circumference} ${circumference}`}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {fractionOnly ? (
          <p className="text-[32px] leading-[40px] font-semibold text-primary-300">
            {correctCount}/{totalCount}
          </p>
        ) : (
          <>
            <p className="text-[40px] leading-[48px] font-semibold text-primary-300">{score}점</p>
            <p className="text-xl leading-6 font-medium text-gray-800">
              {correctCount}/{totalCount}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
