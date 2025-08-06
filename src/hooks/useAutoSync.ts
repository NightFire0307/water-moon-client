import { useEffect, useRef } from 'react'

interface UseAutoSyncOptions {
  delay?: number // 同步间隔时间，默认10秒
}

export function useAutoSync(syncFn: () => Promise<void>, options?: UseAutoSyncOptions) {
  const { delay = 10 } = options || {}
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      syncFn()
    }, delay * 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [])
}
