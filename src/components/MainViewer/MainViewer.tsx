import { usePhotoViewerContext } from '@/contexts/PhotoViewerContext'
import { usePhotosStore } from '@/stores/usePhotosStore'
import { usePhotoViewerStore } from '@/stores/usePhotoViewerStore'
import { LoadingOutlined } from '@ant-design/icons'
import { type ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'

interface MainViewerProps {
  // 用于控制缩放的引用
  transformRef?: React.RefObject<ReactZoomPanPinchRef>
}

export function MainViewer({ transformRef }: MainViewerProps) {
  const { viewerControlVisible, setViewerControlVisible } = usePhotoViewerContext()
  const { rotate } = usePhotoViewerStore()
  const currentPhoto = usePhotosStore(state => state.currentPhoto)
  const isLoading = usePhotosStore(state => state.isLoading)

  return (
    <div
      className="h-full bg-darkBlueGray-800 select-none flex items-center justify-center transition-all rounded-xl"
      style={{ transform: `rotate(${rotate}deg)` }}
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
              <TransformWrapper
                initialScale={1}
                minScale={1}
                maxScale={2}
                doubleClick={{ disabled: true }}
                ref={transformRef}
              >
                <TransformComponent>
                  <img
                    src={currentPhoto?.thumbnail_url}
                    alt={currentPhoto?.name}
                  />
                </TransformComponent>
              </TransformWrapper>
            )
      }
    </div>
  )
}
