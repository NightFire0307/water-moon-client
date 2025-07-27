import type { Photo } from '@/stores/usePhotosStore'
import useMouseOver from '@/hooks/useMouseOver'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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

export function ThumbnailBar({ photos, visible, currentIndex, extra, onClickThumbnail }: ThumbnailBarProps) {
  const { isHover, handleMouseEnter, handleMouseLeave } = useMouseOver({ delay: 150 })
  const scrollRef = useRef<HTMLDivElement | null>(null)
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
    const el = scrollRef.current

    isHover ? setInitialVisible(true) : setInitialVisible(false)

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
  }, [isHover, setInitialVisible])

  return (
    <div
      className="absolute bottom-0 left-0 right-0 h-20 shadow-md"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence>
        {
          thumbnailVisible && (
            <motion.div
              key="thumbnail-bar"
              initial={{ translateY: '100%' }}
              animate={{ translateY: '0%' }}
              exit={{ translateY: '100%' }}
              className="px-4 h-full flex items-center bg-darkBlueGray-900/80 backdrop-blur-md border-t border-darkBlueGray-700/30"
            >
              {
                photos.length > 0
                  ? (
                      <SimpleBar scrollableNodeProps={{ ref: scrollRef }} className="overflow-y-hidden">
                        <div className="h-full flex gap-1 items-center">
                          {
                            photos.map((photo, index) => (
                              <Thumbnail
                                key={photo.photoId}
                                index={index}
                                isSelected={currentIndex === index}
                                thumbnailUrl={photo.thumbnail_url}
                                thumbnailClick={() => handleThumbnailClick(photo, index)}
                                extra={extraContent(photo, index)}
                              />
                            ))
                          }
                        </div>
                      </SimpleBar>
                    )
                  : (
                      <div className="flex items-center justify-center w-full h-full text-darkBlueGray-300">
                        <span>没有可用的缩略图</span>
                      </div>
                    )
              }

            </motion.div>
          )
        }
      </AnimatePresence>
    </div>
  )
}
