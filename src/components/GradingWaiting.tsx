import waitAnimation from '@/assets/grading-wait.svg'

// 채점 대기 화면 — 디자이너의 애니메이션 SVG 원본 (대기.md, 상태바만 제거)
export default function GradingWaiting() {
  return (
    <div role="status" className="absolute inset-0 z-30 bg-white">
      <img src={waitAnimation} alt="채점 중입니다" className="size-full object-cover" />
    </div>
  )
}
