import { usePhotoViewerContext } from '@/contexts/PhotoViewerContext'
import useMouseOver from '@/hooks/useMouseOver'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import SimpleBar from 'simplebar-react'
import { Thumbnail } from './Thumbnail'
import 'simplebar-react/dist/simplebar.min.css'

export function ThumbnailBar() {
  const { isHover, handleMouseEnter, handleMouseLeave } = useMouseOver({ delay: 150 })
  const scrollRef = useRef<HTMLDivElement>(null)
  const { setThumbnailVisible } = usePhotoViewerContext()

  useEffect(() => {
    const el = scrollRef.current

    isHover ? setThumbnailVisible(true) : setThumbnailVisible(false)

    if (!el)
      return

    const scrollWheel = (e: WheelEvent) => {
      el.scrollTo({
        left: el.scrollLeft + e.deltaY,
        behavior: 'auto',
      })
    }

    el.addEventListener('wheel', scrollWheel, { passive: true })

    return () => {
      el.removeEventListener('wheel', scrollWheel)
    }
  }, [isHover, setThumbnailVisible])

  return (
    <div
      className="absolute bottom-0 left-0 right-0 h-20"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence>
        {
          true && (
            <motion.div
              key="thumbnail-bar"
              initial={{ translateY: '100%' }}
              animate={{ translateY: '0%' }}
              exit={{ translateY: '100%' }}
              className="px-4 h-full flex items-center bg-darkBlueGray-800"
            >

              <SimpleBar scrollableNodeProps={{ ref: scrollRef }} className="overflow-y-hidden">
                <div className="h-full flex gap-1 items-center">
                  {
                    Array.from({ length: 30 }).map((_, index) => (
                      <Thumbnail key={index} id={index.toString()} isSelected={index === 3} />
                    ))
                  }
                </div>
              </SimpleBar>
            </motion.div>
          )
        }

      </AnimatePresence>

    </div>
  )
}
