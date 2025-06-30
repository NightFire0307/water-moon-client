import { useCallback, useEffect, useRef, useState } from 'react'

interface useCountDownProps {
  initialCount?: number
  manual?: boolean
}

/**
 * 倒计时
 * @param options
 */
export function useCountDown(options?: useCountDownProps) {
  const { initialCount = 5, manual = false } = options || {}
  const [countDown, setCountDown] = useState(initialCount)
  const [isStart, setIsStart] = useState(!manual)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const clear = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const reset = useCallback((newCount = initialCount) => {
    clear()
    setCountDown(newCount)
  }, [initialCount])

  const start = () => {
    setIsStart(true)
  }

  useEffect(() => {
    if (countDown <= 0 || !isStart)
      return

    timerRef.current = setInterval(() => {
      setCountDown((prev) => {
        if (prev <= 1) {
          clear()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return clear
  }, [countDown, isStart])

  return {
    countDown,
    reset,
    start,
  }
}
