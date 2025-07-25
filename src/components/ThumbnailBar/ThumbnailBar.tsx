import { usePhotoViewerContext } from '@/contexts/PhotoViewerContext'
import useMouseOver from '@/hooks/useMouseOver'
import { type Photo, usePhotosStore } from '@/stores/usePhotosStore'
import { usePhotoViewerStore } from '@/stores/usePhotoViewerStore'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import SimpleBar from 'simplebar-react'
import { Thumbnail } from './Thumbnail'
import 'simplebar-react/dist/simplebar.min.css'

interface ThumbnailBarProps {

}

export function ThumbnailBar() {
  const { isHover, handleMouseEnter, handleMouseLeave } = useMouseOver({ delay: 150 })
  const scrollRef = useRef<HTMLDivElement>(null)
  const { setThumbnailVisible } = usePhotoViewerContext()
  const { currentIndex } = usePhotoViewerStore()
  const preSelectedPhotos = usePhotosStore(state => state.preSelectedPhotos)
  const setCurrentPhoto = usePhotosStore(state => state.setCurrentPhoto)

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
          isHover && (
            <motion.div
              key="thumbnail-bar"
              initial={{ translateY: '100%' }}
              animate={{ translateY: '0%' }}
              exit={{ translateY: '100%' }}
              className="px-4 h-full flex items-center bg-darkBlueGray-800/80 backdrop-blur-md"
            >
              <SimpleBar scrollableNodeProps={{ ref: scrollRef }} className="overflow-y-hidden">
                <div className="h-full flex gap-1 items-center">
                  {
                    preSelectedPhotos.map((photo, index) => (
                      <Thumbnail
                        key={photo.photoId}
                        index={index}
                        isSelected={currentIndex === index}
                        thumbnailUrl={photo.thumbnail_url}
                        thumbnailClick={index => setCurrentPhoto(index)}
                      />
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
