import cs from 'classnames'

interface ThumbnailProps {
  id: string
  isSelected?: boolean
  thumbnailClick?: (id: string) => void
}

export function Thumbnail({ id, isSelected, thumbnailClick }: ThumbnailProps) {
  return (
    <div
      className={
        cs(
          'flex-shrink-0 w-24 h-16 bg-darkBlueGray-700 hover:bg-darkBlueGray-600 active:bg-darkBlueGray-500 transition-all rounded-md border-2 box-content select-none',
          isSelected ? 'border-blue-400' : 'border-transparent',
        )
      }
      onClick={() => thumbnailClick?.(id)}
    >
      <img src="/src/assets/placeholder.svg" alt="Thumbnail" className=" mx-auto max-w-full max-h-full object-contain" />
    </div>
  )
}
