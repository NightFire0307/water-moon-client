import type { Photo } from '@/stores/usePhotosStore'
import useMouseOver from '@/hooks/useMouseOver'
import { usePhotoViewerStore } from '@/stores/usePhotoViewerStore'
import { motion } from 'framer-motion'
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList, type ListChildComponentProps } from 'react-window'
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

// 列表项组件
function Column({ index, style, data }: ListChildComponentProps<Omit<ThumbnailBarProps, 'currentIndex' | 'visible' | 'onVisibleChange'>>) {
  const { photos, extra, onClickThumbnail } = data
  const { currentIndex } = usePhotoViewerStore()

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

  return (
    <div style={style} className="flex justify-center items-center">
      <Thumbnail
        index={index}
        extra={extraContent(photos[index], index)}
        isSelected={currentIndex === index}
        thumbnailUrl={photos[index].thumbnailUrl}
        thumbnailClick={() => handleThumbnailClick(photos[index], index)}
      />
    </div>
  )
}

export const ThumbnailBar = forwardRef<HTMLDivElement, ThumbnailBarProps>(({ photos, visible, extra, onClickThumbnail }, ref) => {
  const { isHover, handleMouseEnter, handleMouseLeave } = useMouseOver({ delay: 150 })
  const listRef = useRef<FixedSizeList | null>(null)
  const scrollOffset = useRef(0)
  const [initialVisible, setInitialVisible] = useState(false)

  // 判断是否为受控组件
  const isControlled = visible !== undefined

  const thumbnailVisible = useMemo(() => {
    return isControlled ? visible : initialVisible
  }, [isControlled, visible, initialVisible])

  // 自定义滚条处理
  function handleOnWheel({ deltaY, currentTarget }: React.WheelEvent<HTMLDivElement>) {
    const container = listRef.current
    if (!container)
      return

    const maxScroll = photos.length * 125 - currentTarget.clientWidth // 最大滚动距离, 125 是每个缩略图的宽度
    scrollOffset.current = Math.max(
      0,
      Math.min(scrollOffset.current + deltaY, maxScroll),
    )
    container.scrollTo(scrollOffset.current)
  }

  const outerElementType = forwardRef<HTMLDivElement>((props, ref) => (
    <div ref={ref} onWheel={handleOnWheel} {...props} />
  ))

  useEffect(() => {
    setInitialVisible(isHover)
  }, [isHover, setInitialVisible])

  return (
    <div
      className="absolute bottom-0 left-0 right-0 h-20 shadow-md"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={ref}
    >
      <motion.div
        key="thumbnail-bar"
        initial={false}
        animate={{ translateY: thumbnailVisible ? '0%' : '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="px-4 h-full bg-darkBlueGray-900/80 backdrop-blur-md border-t border-darkBlueGray-700/30"
        style={{ pointerEvents: thumbnailVisible ? 'auto' : 'none' }}

      >
        {photos.length > 0
          ? (
              <AutoSizer>
                {({ width, height }) => (
                  <FixedSizeList
                    ref={listRef}
                    itemCount={photos.length}
                    itemSize={125}
                    width={width}
                    height={height}
                    layout="horizontal"
                    itemData={{ photos, onClickThumbnail, extra }}
                    outerElementType={outerElementType}
                    style={{ overflow: 'hidden' }}
                  >
                    {Column}
                  </FixedSizeList>
                )}
              </AutoSizer>
            )
          : (
              <div className="flex items-center justify-center w-full h-full text-darkBlueGray-300">
                <span>没有可用的缩略图</span>
              </div>
            )}
      </motion.div>
    </div>
  )
})
