import cs from 'classnames'

interface ThumbnailProps {
  id: string | number
  thumbnailUrl: string
  isSelected?: boolean
  thumbnailClick?: (id: string | number) => void
  style?: React.CSSProperties
}

export function Thumbnail({ id, thumbnailUrl, isSelected, thumbnailClick, style }: ThumbnailProps) {
  return (
    <div
      className={
        cs(
          'flex-shrink-0 w-24 h-16  hover:bg-darkBlueGray-600 active:bg-darkBlueGray-500 transition-all rounded-md border-2 box-content select-none',
          isSelected ? 'border-blue-400 bg-darkBlueGray-600' : 'border-transparent bg-darkBlueGray-700',
        )
      }
      onClick={() => thumbnailClick?.(id)}
      style={style}
    >
      <img src={thumbnailUrl} alt="Thumbnail" className="mx-auto max-w-full max-h-full object-contain" />
    </div>
  )
}
