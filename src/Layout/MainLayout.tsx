import type { IOrder } from '@/types/order.ts'
import { getOrderInfo } from '@/apis/order.ts'
import { MainViewer } from '@/components/MainViewer/MainViewer'
import Navbar from '@/components/Navbar'
import { PhotoStatusBar } from '@/components/PhotoStatusBar/PhotoStatusBar'
import PreviewAlert from '@/components/PreviewAlert/PreviewAlert.tsx'
import Sidebar from '@/components/Sidebar'
import { ThumbnailBar } from '@/components/ThumbnailBar/ThumbnailBar'
import { ViewerControl } from '@/components/ViewerControl/ViewerControl'
import { OrderInfoContext } from '@/contexts/OrderInfoContext.ts'
import { PhotoViewerContext } from '@/contexts/PhotoViewerContext'
import { ThumbnailContext } from '@/contexts/ThumbnailContext'
import { useAuthStore } from '@/stores/useAuthStore.tsx'
import { usePhotosStore } from '@/stores/usePhotosStore.tsx'
import { useProductsStore } from '@/stores/useProductsStore.tsx'
import { ConfigProvider, Layout } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import cs from 'classnames'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import { Thumbnail } from '../components/ThumbnailBar/Thumbnail'

const { Sider, Content, Header } = Layout

function MainLayout() {
  const [thumbnailVisible, setThumbnailVisible] = useState(false)
  const [viewerControlVisible, setViewerControlVisible] = useState(false)
  const [orderInfo, setOrderInfo] = useState<IOrder>({} as IOrder)
  const fetchPhotos = usePhotosStore(state => state.fetchPhotos)
  const generateProducts = useProductsStore(state => state.generateProducts)

  return (
    <OrderInfoContext.Provider value={orderInfo}>
      <PhotoViewerContext.Provider value={{
        thumbnailVisible,
        setThumbnailVisible,
        viewerControlVisible,
        setViewerControlVisible,
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
          <Layout className="h-screen relative bg-darkBlueGray-950 overflow-hidden ">

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
