import type { CellComponentProps } from 'react-window'
import { motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState, type WheelEventHandler } from 'react'
import { Grid, useGridRef } from 'react-window'
import useMouseOver from '@/hooks/useMouseOver'
import { type Photo, usePhotosStore } from '@/stores/usePhotosStore'
import { usePhotoViewerStore } from '@/stores/usePhotoViewerStore'
import { Thumbnail } from './Thumbnail'
import 'simplebar-react/dist/simplebar.min.css'

interface HorizontalListProps {
  photos: Photo[] // 照片列表
  currentIndex?: number // 当前选中的缩略图索引
  visible?: boolean // 是否可见
  renderExtra?: React.ReactNode | ((item: Photo, index: number) => React.ReactNode) // 额外内容，可以是 ReactNode 或函数
  onVisibleChange?: (visible: boolean) => void // 可见性变化回调
  onClickThumbnail?: (item: Photo, index: number,) => void // 缩略图Bar点击回调
  isPhotoSelected?: (photo: Photo, index: number) => boolean // 自定义照片选中状态的函数
}

function CellComponent({
  columnIndex,
  style,
  photos,
  extra,
  isPhotoSelected,
  handleThumbnailClick,
}: CellComponentProps<{
  photos: Photo[]
  extra: (item: Photo, index: number) => React.ReactNode
  isPhotoSelected?: (photo: Photo, index: number) => boolean
  handleThumbnailClick: (photo: Photo, index: number) => void
}>) {
  const { currentIndex } = usePhotoViewerStore()

  return (
    <div
      className="flex items-center mx-2"
      style={style}
    >
      <Thumbnail
        index={photos[columnIndex].photoId}
        thumbnailUrl={photos[columnIndex].thumbnailUrl}
        isSelected={isPhotoSelected ? isPhotoSelected(photos[columnIndex], columnIndex) : currentIndex === columnIndex}
        extra={extra(photos[columnIndex], columnIndex)}
        thumbnailClick={() => handleThumbnailClick(photos[columnIndex], columnIndex)}
      />
    </div>
  )
}

export function HorizontalList(props: HorizontalListProps) {
  const { photos, visible, renderExtra, onClickThumbnail, isPhotoSelected } = props
  const { isHover, handleMouseEnter, handleMouseLeave } = useMouseOver({ delay: 150 })
  const [initialVisible, setInitialVisible] = useState(false)
  const gridRef = useGridRef(null)
  const isLoading = useRef(false)
  const hasMoreRef = useRef(true)
  const nextPageRef = useRef<() => Promise<{ hasMore: boolean }>>(null)
  const columnWidth = useRef(108)
  const { fetchPhotos } = usePhotosStore()
  const { currentIndex } = usePhotoViewerStore()

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
    if (typeof renderExtra === 'function') {
      return renderExtra(item, index)
    }

    return renderExtra ?? null
  }, [renderExtra])

  // 让鼠标滚轮纵向滚动转为横向滚动
  const handleOnWheel: WheelEventHandler = (e) => {
    const grid = gridRef.current
    if (!grid || !grid.element)
      return
    grid.element.scrollLeft += e.deltaY
  }

  const handleOnScroll = async (e) => {
    const threshold = columnWidth.current * 10 // 设置一个阈值用于加载下一批数据

    if (e.target.scrollLeft + e.target.clientWidth >= e.target.scrollWidth - threshold
      && !isLoading.current
      && hasMoreRef.current
      && nextPageRef.current
    ) {
      isLoading.current = true
      try {
        const result = await nextPageRef.current()
        hasMoreRef.current = result.hasMore
      }
      catch (error) {
        console.error('加载失败:', error)
      }
      finally {
        isLoading.current = false
      }
    }
  }

  useEffect(() => {
    if (isLoading.current)
      return

    const initLoad = async () => {
      const result = await fetchPhotos()
      nextPageRef.current = result.nextPage
      hasMoreRef.current = result.hasMore
    }
    initLoad()
  }, [fetchPhotos])

  useEffect(() => {
    setInitialVisible(isHover)
  }, [isHover, setInitialVisible])

  useEffect(() => {
    if (
      typeof currentIndex === 'number'
      && gridRef.current
      && gridRef.current.element
      && photos.length > 0
    ) {
      const gridEl = gridRef.current.element
      const itemLeft = currentIndex * 108
      const itemRight = itemLeft + 108
      const visibleLeft = gridEl.scrollLeft
      const visibleRight = gridEl.scrollLeft + gridEl.clientWidth

      // 只有当当前缩略图不在可视区域时才滚动
      if (itemLeft < visibleLeft || itemRight > visibleRight) {
        gridRef.current.scrollToColumn({
          behavior: 'smooth',
          index: currentIndex,
          align: itemLeft < visibleLeft ? 'start' : 'end',
        })
      }
    }
  }, [currentIndex, photos.length, gridRef])

  return (
    <div
      className="absolute bottom-0 left-0 right-0 shadow-md"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        animate={{ translateY: thumbnailVisible ? '0%' : '100%', opacity: thumbnailVisible ? 1 : 0, display: thumbnailVisible ? 'block' : 'none' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="px-2 h-full bg-darkBlueGray-900/60 backdrop-blur-md border-t border-darkBlueGray-700/30"
      >
        <Grid
          gridRef={gridRef}
          cellComponent={CellComponent}
          cellProps={{
            photos,
            extra: extraContent,
            handleThumbnailClick,
            isPhotoSelected,
          }}
          columnCount={photos.length}
          columnWidth={columnWidth.current}
          rowCount={1}
          rowHeight={76}
          style={{
            flexGrow: 0,
            height: 'auto',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255, 255, 255, 0.5) transparent',
          }}
          onScroll={handleOnScroll}
          onWheel={handleOnWheel}
        />

      </motion.div>
    </div>

  )
}
