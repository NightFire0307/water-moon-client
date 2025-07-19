interface ThumbnailProps {
  thumbnailClick?: () => void
}

export function Thumbnail({ thumbnailClick }: ThumbnailProps) {
  return (
    <div
      className="flex-shrink-0 w-24 h-16 bg-darkBlueGray-700 hover:bg-darkBlueGray-600 transition-all rounded-sm"
      onClick={() => thumbnailClick?.()}
    >
      <img src="/src/assets/placeholder.svg" alt="Thumbnail" className=" mx-auto max-w-full max-h-full object-contain" />
    </div>
  )
}
