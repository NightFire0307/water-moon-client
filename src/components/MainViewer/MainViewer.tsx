import { usePhotoViewerContext } from '@/contexts/PhotoViewerContext'
import { usePhotosStore } from '@/stores/usePhotosStore'

export function MainViewer() {
  const { viewerControlVisible, setViewerControlVisible } = usePhotoViewerContext()
  const currentPhoto = usePhotosStore(state => state.currentPhoto)

  return (
    <div className="h-screen w-auto" onClick={() => setViewerControlVisible(!viewerControlVisible)}>
      <img src={currentPhoto?.thumbnail_url} alt={currentPhoto?.name} className="w-full h-full object-contain" />
    </div>
  )
}
