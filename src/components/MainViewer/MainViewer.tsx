import { usePhotoViewerContext } from '@/contexts/PhotoViewerContext'
import { usePhotosStore } from '@/stores/usePhotosStore'
import { usePhotoViewerStore } from '@/stores/usePhotoViewerStore'
import { useProductsStore } from '@/stores/useProductsStore'
import { InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import { Tooltip, Typography } from 'antd'
import { useEffect, useMemo } from 'react'
import { type ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'

const { Text } = Typography

interface MainViewerProps {
  // 用于控制缩放的引用
  transformRef?: React.RefObject<ReactZoomPanPinchRef>
}

function Loading() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <LoadingOutlined className="text-3xl text-darkBlueGray-600" spin />
      <span className="text-darkBlueGray-400 font-medium text-base">暂无图片</span>
    </div>
  )
}

function Empty() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <span className="text-darkBlueGray-400 font-medium text-base">没有可查看的照片</span>
    </div>
  )
}

export function MainViewer({ transformRef }: MainViewerProps) {
  const { viewerControlVisible, setViewerControlVisible } = usePhotoViewerContext()
  const { rotate } = usePhotoViewerStore()
  const { currentPhoto } = usePhotosStore()
  const isLoading = usePhotosStore(state => state.isLoading)
  const productSelectedPhotos = usePhotosStore(state => state.productSelectedPhotos)
  const { products } = useProductsStore()

  // 当前照片选中的产品名称
  const currentProducts = useMemo(() => {
    if (currentPhoto === null)
      return []

    return currentPhoto.selectedProducts.map((productId) => {
      const product = products.find(p => p.productId === productId)
      return {
        productId: product?.productId,
        name: product ? product.name : '未知产品',
      }
    })
  }, [currentPhoto, products])

  return (
    <div
      className="h-full bg-gradient-to-br from-darkBlueGray-700 to-darkBlueGray-800 select-none flex items-center justify-center rounded-xl"
      onClick={() => setViewerControlVisible(!viewerControlVisible)}
    >
      {
        isLoading
          ? <Loading />
          : productSelectedPhotos.length === 0 || currentPhoto === null
            ? <Empty />
            : (
                <div className="relative w-full h-full">
                  {/* 照片编号 */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-darkBlueGray-900/50 backdrop-blur-sm rounded-lg px-3 py-1 z-50">
                    <Text className="text-darkBlueGray-300 text-base font-medium">{ currentPhoto?.name ?? '' }</Text>
                    {
                      currentPhoto?.remark && (
                        <Tooltip title={currentPhoto.remark} color="#1e293b" placement="bottom">
                          <InfoCircleOutlined className="text-base text-darkBlueGray-300 cursor-pointer" />
                        </Tooltip>
                      )
                    }
                  </div>

                  {/* 选中的产品标签 */}
                  <div className="flex flex-col gap-2 absolute top-4 right-4 z-50">
                    {
                      currentProducts.length > 0 && currentProducts.map(({ productId, name }) => (
                        <div
                          key={productId}
                          className=" bg-darkBlueGray-900/50 backdrop-blur-sm rounded-lg px-3 py-1"
                        >
                          <Text className="text-darkBlueGray-300 text-base font-medium">{name}</Text>
                        </div>
                      ))
                    }
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
                        className="w-full h-full object-contain transition-all"
                        style={{ transform: `rotate(${rotate}deg)` }}
                      />
                    </TransformComponent>
                  </TransformWrapper>
                </div>
              )
      }
    </div>
  )
}
