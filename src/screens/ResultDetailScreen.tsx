import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import iconBack from '@/assets/icon-back.svg'
import ScoreDonut from '@/components/ScoreDonut'
import { useAsync } from '@/hooks/useAsync'
import { getGrading } from '@/services/api'

const formatKoreanDate = (date: string) => {
  const [year, month, day] = date.split('-')
  return `${year}년 ${Number(month)}월 ${Number(day)}일`
}

export default function ResultDetailScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  // 채점 직후 진입이면 히스토리에 내역 화면이 없으므로 replace로 이동해 핑퐁을 막는다
  const fromGrading = (location.state as { from?: string } | null)?.from === 'grading'
  const { data: record, loading, error } = useAsync(() => getGrading(id ?? ''), [id])

  if (loading) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center bg-white px-6 text-center">
        <p className="text-sm text-gray-600">불러오는 중...</p>
      </main>
    )
  }

  if (error || !record) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center bg-white px-6 text-center">
        <p className="text-sm text-gray-600">{error ?? '채점 결과를 찾을 수 없어요.'}</p>
        <Link to="/results" className="mt-4 font-bold text-primary-300">
          채점 내역으로
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-white px-6 pt-[calc(env(safe-area-inset-top)+16px)] pb-8">
      <button
        type="button"
        onClick={() => (fromGrading ? navigate('/results', { replace: true }) : navigate(-1))}
        className="-m-2 self-start p-2"
        aria-label="뒤로"
      >
        <img src={iconBack} alt="" className="h-6" />
      </button>

      <p className="mt-9 text-lg leading-[21px] font-medium text-gray-700">
        {formatKoreanDate(record.date)}
      </p>
      <h1 className="mt-3 text-2xl leading-[29px] font-semibold text-gray-900">{record.title}</h1>

      <div className="mt-3">
        <ScoreDonut
          score={record.score}
          correctCount={record.correctCount}
          totalCount={record.totalCount}
        />
      </div>

      <h2 className="mt-4 text-base leading-[19px] font-semibold text-gray-1000">
        오답 <span className="text-secondary">{record.wrongAnswers.length}</span>
      </h2>
      {record.wrongAnswers.length === 0 ? (
        <p className="mt-4 text-sm text-gray-600">오답이 없어요. 완벽해요!</p>
      ) : (
        // 디자인은 표가 아니라 행마다 justify-center + 고정 gap(헤더 96/행 124)인 flex 레이아웃
        <div className="mt-3 overflow-hidden rounded-2xl border border-gray-500 bg-white">
          <div className="flex items-center justify-center gap-[96px] border-b border-gray-500 bg-gray-200 py-5 text-base leading-[19px] font-semibold text-gray-800">
            <span>페이지</span>
            <span>문제 번호</span>
          </div>
          {record.wrongAnswers.map((wrong, index) => (
            <div
              key={index}
              className="flex items-center justify-center gap-[124px] border-b border-gray-500 py-5 last:border-0"
            >
              <span className="text-lg leading-[21px] font-semibold text-gray-900">
                {wrong.page != null ? `${wrong.page}p` : '—'}
              </span>
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#FFD6E2] text-lg leading-[21px] font-semibold text-secondary">
                {wrong.number}
              </span>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
