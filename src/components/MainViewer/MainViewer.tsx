import { usePhotoViewerContext } from '@/contexts/PhotoViewerContext'
import { usePhotosStore } from '@/stores/usePhotosStore'
import { usePhotoViewerStore } from '@/stores/usePhotoViewerStore'
import { LoadingOutlined } from '@ant-design/icons'

export function MainViewer() {
  const { viewerControlVisible, setViewerControlVisible } = usePhotoViewerContext()
  const currentPhoto = usePhotosStore(state => state.currentPhoto)
  const isLoading = usePhotosStore(state => state.isLoading)
  const { rotate, scale } = usePhotoViewerStore()

  return (
    <div
      className="h-screen select-none overflow-hidden"
      onClick={() => setViewerControlVisible(!viewerControlVisible)}
    >
      {
        isLoading
          ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                <LoadingOutlined className="text-3xl text-darkBlueGray-600" spin />
                <span className="text-darkBlueGray-400 font-medium">图片载入中...</span>
              </div>
            )
          : (
              <img
                src={currentPhoto?.thumbnail_url}
                alt={currentPhoto?.name}
                className="w-full h-full object-contain transition-transform duration-300 ease-in-out"
                style={{
                  transform: `rotate(${rotate}deg) scale(${scale})`,
                }}
              />
            )
      }
    </div>
  )
}
