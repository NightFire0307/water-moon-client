import { useEffect, useRef, useState } from 'react'

interface UseMouseOverProps {
  delay?: number
}

/**
 * 鼠标悬停状态的自定义 Hook
 * @param options 配置选项
 * @returns 返回悬停状态和事件处理函数
 */
function useMouseOver(
  options: UseMouseOverProps = {
    delay: 300,
  },
) {
  const { delay } = options
  const [isHover, setIsHover] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsHover(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHover(false)
    }, delay)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [])

  return { isHover, handleMouseEnter, handleMouseLeave }
}

export default useMouseOver
