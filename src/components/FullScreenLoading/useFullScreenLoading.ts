import { useLayoutEffect, useState } from 'react'

interface LoadingState {
  isLoading: boolean
  message?: string
}

let isLoading: boolean = false
const listeners = new Set<(val: LoadingState) => void>()

function showLoading(message?: string) {
  isLoading = true
  listeners.forEach(fn => fn({ isLoading, message }))
}

function hideLoading() {
  isLoading = false
  listeners.forEach(fn => fn({ isLoading }))
}

export function useFullScreenLoading() {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    message: '订单数据加载中...',
  })

  // 注：这里使用 useLayoutEffect 而不是 useEffect
  // 避免在某些情况下，loading 状态更新后，组件未及时响应
  useLayoutEffect(() => {
    const listener = (val: LoadingState) => setLoadingState(val)
    listeners.add(listener)

    return () => {
      listeners.delete(listener)
    }
  }, [])

  return { loadingState, showLoading, hideLoading }
}
