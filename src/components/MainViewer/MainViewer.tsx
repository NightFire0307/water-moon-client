import { usePhotoViewerContext } from '@/contexts/PhotoViewerContext'

export function MainViewer() {
  const { viewerControlVisible, setViewerControlVisible } = usePhotoViewerContext()

  return (
    <div className="h-screen w-auto" onClick={() => setViewerControlVisible(!viewerControlVisible)}>
      <img src="/src/assets/placeholder.svg" alt="Main Viewer" className="w-full h-full object-contain" />
    </div>
  )
}
