import { useState } from 'react'

function UseDrag() {
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.clientX - offsetX)
    setStartY(e.clientY - offsetY)
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging)
      return
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    setOffsetX(dx)
    setOffsetY(dy)
  }

  const onMouseUp = (e: MouseEvent) => {
    e.stopPropagation()
    setIsDragging(false)
  }

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    offsetX,
    offsetY,
  }
}

export default UseDrag
