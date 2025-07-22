import { usePhotoViewerContext } from '@/contexts/PhotoViewerContext'
import { usePhotosStore } from '@/stores/usePhotosStore'
import { usePhotoViewerStore } from '@/stores/usePhotoViewerStore'

export function MainViewer() {
  const { viewerControlVisible, setViewerControlVisible } = usePhotoViewerContext()
  const currentPhoto = usePhotosStore(state => state.currentPhoto)
  const { rotate, scale } = usePhotoViewerStore()

  return (
    <div
      className="h-screen select-none overflow-hidden"
      onClick={() => setViewerControlVisible(!viewerControlVisible)}
    >
      <img
        src={currentPhoto?.thumbnail_url}
        alt={currentPhoto?.name}
        className="w-full h-full object-contain transition-transform duration-300 ease-in-out"
        style={{
          transform: `rotate(${rotate}deg) scale(${scale})`,
        }}
      />
    </div>
  )
}
