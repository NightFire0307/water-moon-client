import cs from 'classnames'
import { motion } from 'framer-motion'
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react'

interface SegmentedProps {
  options: { label: ReactNode, value: string | number }[]
  onChange?: (value: string | number) => void
}

function Segmented({ options, onChange }: SegmentedProps) {
  const [isSelected, setIsSelected] = useState<string | number>(options[0].value)
  const [sliderStyle, setSliderStyle] = useState<{ left: number, width: number }>({ left: 0, width: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const selectedIndex = options.findIndex(option => option.value === isSelected)
    const item = itemsRef.current[selectedIndex]
    if (item) {
      setSliderStyle({
        left: item.offsetLeft - 4,
        width: item.offsetWidth
      })
    }
  }, [isSelected, itemsRef.current, options])

  return (
    <div 
      ref={containerRef} 
      className="relative p-1 h-10 inline-flex items-center bg-darkBlueGray-900/80 backdrop-blur-sm rounded-xl border border-darkBlueGray-700/60 shadow-lg select-none">
      {
        options.map((option, idx) => (
          <div
            ref={el => itemsRef.current[idx] = el}
            className={
              cs('px-4 h-8 text-sm leading-8 font-medium rounded-2xl hover:text-darkBlueGray-100 cursor-pointer transition-all duration-300', isSelected === option.value ? 'text-darkBlueGray-100' : 'text-darkBlueGray-400')
            }
            key={option.value}
            onClick={() => {
              setIsSelected(option.value)
            }}
          >
            {option.label}
          </div>
        ))
      }
      {/* 滑块 */}
      <motion.div
        initial={{ translateX: sliderStyle.left, width: sliderStyle.width }}
        animate={{ translateX: sliderStyle.left, width: sliderStyle.width }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="absolute top-1 bottom-1 rounded-md bg-gradient-to-r from-blue-500/30 to-blue-600/30 border border-blue-500/40 shadow-lg shadow-blue-500/20 -z-10"
      />
    </div>
  )
}

export default Segmented
