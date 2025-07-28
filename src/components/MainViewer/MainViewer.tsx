import { LoadingOutlined } from '@ant-design/icons'
import { Typography } from 'antd'
import { type ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { usePhotoViewerContext } from '@/contexts/PhotoViewerContext'
import { usePhotosStore } from '@/stores/usePhotosStore'
import { usePhotoViewerStore } from '@/stores/usePhotoViewerStore'

const { Text } = Typography

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
      className="h-full bg-gradient-to-br from-darkBlueGray-700 to-darkBlueGray-800 select-none flex items-center justify-center transition-all rounded-xl"
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
              <>
                <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                  <Text className="text-white text-md font-medium">{ currentPhoto?.name ?? '' }</Text>
                </div>
                <TransformWrapper
                  initialScale={1}
                  minScale={1}
                  maxScale={2}
                  doubleClick={{ disabled: true }}
                  ref={transformRef}
                >
                  <TransformComponent
                    wrapperStyle={{ width: '100%', height: '100%' }}
                    contentStyle={{ width: '100%', height: '100%' }}
                  >
                    <img
                      src={currentPhoto?.thumbnail_url}
                      alt={currentPhoto?.name}
                      className="w-full h-full object-contain"
                    />
                  </TransformComponent>
                </TransformWrapper>
              </>
            )
      }
    </div>
  )
}
