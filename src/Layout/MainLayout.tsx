import type { IOrder } from '@/types/order.ts'
import { stat } from 'node:fs'
import { getOrderInfo } from '@/apis/order.ts'
import { MainViewer } from '@/components/MainViewer/MainViewer'
import { PhotoStatusBar } from '@/components/PhotoStatusBar/PhotoStatusBar'
import ProductSidebar from '@/components/ProductSidebar/ProductSidebar'
import { ThumbnailBar } from '@/components/ThumbnailBar/ThumbnailBar'
import { ViewerControl } from '@/components/ViewerControl/ViewerControl'
import { OrderInfoContext } from '@/contexts/OrderInfoContext.ts'
import { PhotoViewerContext } from '@/contexts/PhotoViewerContext'
import { usePhotosStore } from '@/stores/usePhotosStore.tsx'
import { usePhotoViewerStore } from '@/stores/usePhotoViewerStore'
import { useProductsStore } from '@/stores/useProductsStore.tsx'
import { ConfigProvider, Layout } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { useEffect, useState } from 'react'

const { Content } = Layout

function MainLayout() {
  const [thumbnailVisible, setThumbnailVisible] = useState(false)
  const [viewerControlVisible, setViewerControlVisible] = useState(true)
  const [productSidebarVisible, setProductSidebarVisible] = useState(false)
  const [orderInfo, setOrderInfo] = useState<IOrder>({} as IOrder)
  const fetchPhotos = usePhotosStore(state => state.fetchPhotos)
  const generateProducts = useProductsStore(state => state.generateProducts)
  const { next, previous } = usePhotoViewerStore()

  function handleKeydown(e: KeyboardEvent) {
    switch (e.key) {
      case 'ArrowLeft':
        previous()
        break
      case 'ArrowRight':
        next()
        break
      default:
        break
    }
  }

  // 获取订单信息和照片
  const fetchOrderInfoAndPhotos = async () => {
    fetchPhotos()
    const { data } = await getOrderInfo()
    setOrderInfo(data)
    generateProducts(data.order_products)
  }

  useEffect(() => {
    fetchOrderInfoAndPhotos()
  }, [])

  // 全局按键事件
  useEffect(() => {
    window.addEventListener('keydown', handleKeydown)

    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [])

  return (
    <OrderInfoContext.Provider value={orderInfo}>
      <PhotoViewerContext.Provider value={{
        thumbnailVisible,
        setThumbnailVisible,
        viewerControlVisible,
        setViewerControlVisible,
        productSidebarVisible,
        setProductSidebarVisible,
      }}
      >
        <ConfigProvider
          locale={zhCN}
          theme={{
            token: {
              colorBgElevated: '#334155',
              colorText: '#f8fafc',
              colorTextDisabled: '#64748b',
              colorTextDescription: '#94a3b8',
              controlItemBgHover: '#475569',
            },
            components: {
              Modal: {
                contentBg: '#1e293b',
              },
              Button: {
                borderColorDisabled: '#475569',
                defaultBg: '#334155',
                defaultColor: '#e2e8f0',
                defaultBorderColor: '#475569',
                defaultActiveBg: '#0f172a',
                defaultActiveBorderColor: '#1e293b',
                defaultActiveColor: '#e2e8f0',
                defaultHoverBg: '#475569',
                defaultHoverBorderColor: '#475569',
                defaultHoverColor: '#ffffff',
                textTextColor: '#94a3b8',
                textHoverBg: '#475569',
                textTextActiveColor: '#cbd5e1',
                textTextHoverColor: '#f8fafc',
              },
              Input: {
                activeBg: '#1e293b',
                activeBorderColor: '#475569',
                activeShadow: '#020617',
                hoverBorderColor: '#94a3b8',
              },
            },
          }}
        >
          <Layout
            className="h-screen relative bg-darkBlueGray-950 overflow-hidden"
          >

            <ProductSidebar />

            <Content>
              <ViewerControl />
              <MainViewer />
            </Content>

            <PhotoStatusBar />
            <ThumbnailBar />

          </Layout>
        </ConfigProvider>

      </PhotoViewerContext.Provider>
    </OrderInfoContext.Provider>
  )
}

export default MainLayout
