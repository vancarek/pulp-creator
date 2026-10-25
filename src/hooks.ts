import { useEffect, useState } from 'react'

export type Async<T> = { status: 'loading' } | { status: 'ok'; data: T } | { status: 'error'; error: string }

export function useAsync<T>(load: () => Promise<T>, deps: unknown[]): Async<T> {
  const [state, setState] = useState<Async<T>>({ status: 'loading' })
  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })
    load().then(
      (data) => !cancelled && setState({ status: 'ok', data }),
      (e: unknown) => !cancelled && setState({ status: 'error', error: String(e) }),
    )
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return state
}
