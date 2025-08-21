import type { Photo } from '@/stores/usePhotosStore'
import useMouseOver from '@/hooks/useMouseOver'
import { usePhotoViewerStore } from '@/stores/usePhotoViewerStore'
import { motion } from 'framer-motion'
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState, type WheelEvent } from 'react'
import SimpleBar from 'simplebar-react'
import { Thumbnail } from './Thumbnail'
import 'simplebar-react/dist/simplebar.min.css'

interface ThumbnailBarProps {
  photos: Photo[] // 照片列表
  currentIndex?: number // 当前选中的缩略图索引
  visible?: boolean // 是否可见
  extra?: React.ReactNode | ((item: Photo, index: number) => React.ReactNode) // 额外内容，可以是 ReactNode 或函数
  onVisibleChange?: (visible: boolean) => void // 可见性变化回调
  onClickThumbnail?: (item: Photo, index: number,) => void // 缩略图Bar点击回调
}

export const ThumbnailBar = forwardRef<HTMLDivElement, ThumbnailBarProps>(({ photos, visible, extra, onClickThumbnail }, ref) => {
  const { isHover, handleMouseEnter, handleMouseLeave } = useMouseOver({ delay: 150 })
  const { currentIndex } = usePhotoViewerStore()
  const simpleBarRef = useRef<HTMLDivElement | null>(null)
  const [initialVisible, setInitialVisible] = useState(false)

  // 判断是否为受控组件
  const isControlled = visible !== undefined

  const thumbnailVisible = useMemo(() => {
    return isControlled ? visible : initialVisible
  }, [isControlled, visible, initialVisible])

  // 处理缩略图点击
  const handleThumbnailClick = useCallback((photo: Photo, index: number) => {
    onClickThumbnail?.(photo, index)
  }, [onClickThumbnail])

  // 额外内容处理
  const extraContent = useCallback((item: Photo, index: number) => {
    if (typeof extra === 'function') {
      return extra(item, index)
    }

    return extra ?? null
  }, [extra])

  useEffect(() => {
    const el = simpleBarRef.current
    if (!el)
      return

    const wheelHandler = (e: WheelEvent<HTMLDivElement>) => {
      el.scrollLeft += e.deltaY || e.deltaX
      e.preventDefault()
    }

    el.addEventListener('wheel', wheelHandler, { passive: false })
    return () => el.removeEventListener('wheel', wheelHandler)
  }, [])

  useEffect(() => {
    setInitialVisible(isHover)
  }, [isHover, setInitialVisible])

  return (
    <div
      className="absolute bottom-0 left-0 right-0 shadow-md"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={ref}
    >
      <motion.div
        animate={{ translateY: thumbnailVisible ? '0%' : '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="px-2 h-full bg-darkBlueGray-900/60 backdrop-blur-md border-t border-darkBlueGray-700/30"
      >
        <SimpleBar
          scrollableNodeProps={{ ref: simpleBarRef }}
          style={{ overflowX: 'auto', overflowY: 'hidden', whiteSpace: 'nowrap' }}
        >
          <div className="flex items-center gap-2 h-20">
            {photos.length > 0
              ? (
                  photos.map((photo, index) => (
                    <Thumbnail
                      key={photo.photoId}
                      index={index}
                      extra={extraContent(photos[index], index)}
                      isSelected={currentIndex === index}
                      thumbnailUrl={photos[index].thumbnailUrl}
                      thumbnailClick={() => handleThumbnailClick(photos[index], index)}
                    />
                  ))
                )
              : (
                  <div className="flex items-center justify-center w-full h-full text-darkBlueGray-300">
                    <span>没有可用的缩略图</span>
                  </div>
                )}
          </div>

        </SimpleBar>
      </motion.div>
    </div>
  )
})
