import waitAnimationRaw from '@/assets/grading-wait.svg?raw'
import InlineSvg from '@/components/InlineSvg'

// 채점 대기 화면 — 디자이너 애니메이션 SVG 원본 그대로 (돋보기 모션 포함, 상태바만 제거)
export default function GradingWaiting() {
  return (
    <div role="status" className="absolute inset-0 z-30 bg-white">
      <InlineSvg raw={waitAnimationRaw} label="채점 중입니다" className="size-full" />
    </div>
  )
}
