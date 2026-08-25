import { useEffect, useState } from 'react'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

// 화면 4상태(로딩/에러/빈/정상) 처리용 최소 훅
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[]): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null })

  useEffect(() => {
    let alive = true
    fn().then(
      (data) => {
        if (alive) setState({ data, loading: false, error: null })
      },
      (err: Error) => {
        if (alive) setState({ data: null, loading: false, error: err.message })
      },
    )
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
