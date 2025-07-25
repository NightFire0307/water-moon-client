import { usePhotoViewerStore } from '@/stores/usePhotoViewerStore'

import cs from 'classnames'

interface ThumbnailProps {
  index: number
  thumbnailUrl: string
  extra?: React.ReactNode // 额外内容
  isSelected?: boolean
  thumbnailClick?: (index: number) => void
  style?: React.CSSProperties
}

export function Thumbnail({ index, thumbnailUrl, isSelected, extra, thumbnailClick, style }: ThumbnailProps) {
  const setCurrentIndex = usePhotoViewerStore(state => state.setCurrentIndex)

  function handleClick() {
    setCurrentIndex(index)
    thumbnailClick?.(index)
  }

  return (
    <div
      className={
        cs(
          'relative flex justify-center flex-shrink-0 w-24 h-16  hover:bg-darkBlueGray-600 active:bg-darkBlueGray-500 transition-all rounded-md border-2 box-content select-none',
          isSelected ? 'border-blue-400 bg-darkBlueGray-600' : 'border-transparent bg-darkBlueGray-700',
        )
      }
      onClick={handleClick}
      style={style}
    >
      <img src={thumbnailUrl} alt="Thumbnail" className="max-w-full max-h-full object-contain" />
      <div className="absolute top-0.5 right-0.5">
        { extra }
      </div>
    </div>
  )
}
