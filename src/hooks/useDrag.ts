import type { MouseEvent } from 'react'
import { useEffect, useRef, useState } from 'react'

function UseDrag() {
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState<number>(1)
  const [bounds, setBounds] = useState({ width: 0, height: 0 })
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 })

  const resetPosition = () => {
    setPosition({ x: 0, y: 0 })
  }

  useEffect(() => {
    if (containerRef.current && imgRef.current) {
      const container = containerRef.current.getBoundingClientRect()
      const img = imgRef.current.getBoundingClientRect()
      setBounds({
        width: container.width,
        height: container.height,
      })
      setImgSize({
        width: img.width,
        height: img.height,
      })

      // 当缩放比例为 1 时重置位置
      if (scale === 1) {
        resetPosition()
      }
    }
  }, [scale])

  const getBoundedPosition = (x: number, y: number) => {
    const maxX = (imgSize.width * scale - bounds.width) / 2
    const maxY = (imgSize.height * scale - bounds.height) / 2

    // 确保图片不超出容器的可视范围
    return {
      x: Math.max(Math.min(x, maxX), -maxX),
      y: Math.max(Math.min(y, maxY), -maxY),
    }
  }

  const onMouseDown = (e: MouseEvent<HTMLImageElement>) => {
    if (!imgRef.current)
      return
    setIsDragging(true)
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
    e.preventDefault()
  }

  const onMouseMove = (e: MouseEvent<HTMLImageElement>) => {
    if (!isDragging || !containerRef.current || !imgRef.current)
      return

    const dx = e.clientX - startPos.x
    const dy = e.clientY - startPos.y
    const boundedPosition = getBoundedPosition(dx, dy)
    setPosition(boundedPosition)
  }

  const onMouseUp = (e: MouseEvent<HTMLImageElement>) => {
    e.stopPropagation()
    setIsDragging(false)
    // setTimeout(() => setIsDragging(false), 0)
  }

  const onZoomIn = () => {
    setScale(prev => Math.min(prev * 1.5, 4))
  }

  const onZoomOut = () => {
    setScale(prev => Math.max(prev / 2, 1))
  }

  const reset = () => {
    setScale(1)
    setStartPos({ x: 0, y: 0 })
    setPosition({ x: 0, y: 0 })
    setBounds({ width: 0, height: 0 })
    setImgSize({ width: 0, height: 0 })
  }

  return {
    onZoomIn,
    onZoomOut,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    scale,
    startPos,
    position,
    imgRef,
    containerRef,
    isDragging,
    reset,
  }
}

export default UseDrag
