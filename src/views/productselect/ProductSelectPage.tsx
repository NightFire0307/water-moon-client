import type { IOrder } from '@/types/order.ts'
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'
import { getOrderInfo } from '@/apis/order.ts'
import { ConditionTip } from '@/components/ConditionTip/ConditionTip'
import { MainViewer } from '@/components/MainViewer/MainViewer'
import { PhotoStatusBar } from '@/components/PhotoStatusBar/PhotoStatusBar'
import ProductSidebar from '@/components/ProductSidebar/ProductSidebar'
import { StepHeader } from '@/components/StepHeader/StepHeader'
import { ThumbnailBar } from '@/components/ThumbnailBar/ThumbnailBar'
import { ViewerControl } from '@/components/ViewerControl/ViewerControl'
import { OrderInfoContext } from '@/contexts/OrderInfoContext.ts'
import { PhotoViewerContext } from '@/contexts/PhotoViewerContext'
import { usePhotosStore } from '@/stores/usePhotosStore.tsx'
import { usePhotoViewerStore } from '@/stores/usePhotoViewerStore'
import { useProductsStore } from '@/stores/useProductsStore.tsx'
import { RightOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Layout } from 'antd'
import { Header } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import zhCN from 'antd/locale/zh_CN'
import { motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'

const { Content } = Layout

function ProductSelectPage() {
  const [thumbnailVisible, setThumbnailVisible] = useState(false)
  const [viewerControlVisible, setViewerControlVisible] = useState(true)
  const [productSidebarVisible, setProductSidebarVisible] = useState(false)
  const [keyboardDisabled, setKeyboardDisabled] = useState(false)
  const [conditionTipState, setConditionTipState] = useState({
    visible: false,
    msg: '',
  })
  const transformRef = useRef<ReactZoomPanPinchRef>(null)
  const [orderInfo, setOrderInfo] = useState<IOrder>({} as IOrder)
  const generateProducts = useProductsStore(state => state.generateProducts)
  const { fetchPhotos, getCurrentPhotoInfo, productSelectedPhotos } = usePhotosStore()
  const { next, previous } = usePhotoViewerStore()

  // 控制提示信息显示
  // 例如：当切换到最后一张照片时，显示提示信息
  const showConditionTip = useCallback((msg: string) => {
    setConditionTipState({
      visible: true,
      msg,
    })
    setTimeout(() => {
      setConditionTipState({ visible: false, msg: '' })
    }, 1500)
  }, [])

  const handleKeydown = useCallback((e: KeyboardEvent) => {
    // 如果键盘被禁用，则不处理按键事件
    if (keyboardDisabled) {
      return
    }

    // 避免在输入框中触发
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return
    }

    const { currentIndex, totalCount } = getCurrentPhotoInfo()

    switch (e.key) {
      case 'ArrowLeft':
        if (currentIndex === 0) {
          showConditionTip('已经是第一张了')
        }
        else {
          previous()
        }
        break
      case 'ArrowRight':
        if (currentIndex === totalCount - 1) {
          showConditionTip('已是最后一张照片')
        }
        else {
          next()
        }
        break
      default:
        break
    }
  }, [keyboardDisabled, previous, next, getCurrentPhotoInfo, showConditionTip])

  // 获取订单信息和照片
  const fetchOrderInfoAndPhotos = async () => {
    const { data } = await getOrderInfo()
    setOrderInfo(data)
    generateProducts(data.order_products)
    fetchPhotos()
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
  }, [handleKeydown])

  return (
    <OrderInfoContext.Provider value={orderInfo}>
      <PhotoViewerContext.Provider value={{
        thumbnailVisible,
        setThumbnailVisible,
        viewerControlVisible,
        setViewerControlVisible,
        productSidebarVisible,
        setProductSidebarVisible,
        keyboardDisabled,
        setKeyboardDisabled,
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
            },
          }}
        >
          <Layout className={`h-screen relative bg-gradient-to-br from-darkBlueGray-950 via-darkBlueGray-900 to-darkBlueGray-950 overflow-hidden `}>
            <Header>
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{ duration: 0.3 }}
                className="absolute top-0 left-0 right-0 z-30 bg-darkBlueGray-900/70 backdrop-blur-md border-b border-darkBlueGray-700/30"
              >
                <div
                  className="flex items-center justify-between px-4 py-2"
                >
                  <StepHeader stepNumber={3} stepTitle="产品选片" stepDesc="Product Selection" />
                  <Button type="primary">
                    下一步：提交选片结果
                    <RightOutlined />
                  </Button>
                </div>

              </motion.div>
            </Header>

            <Layout className="bg-darkBlueGray-900">
              <Sider width={320} className="bg-darkBlueGray-900">
                {/* 产品侧边栏 */}
                <ProductSidebar />
              </Sider>

              {/* 主视图区域 */}
              <Content className="relative top-0 bottom-0 w-full h-[calc(100% - 64px)] p-4 ">
                <ViewerControl transformRef={transformRef} />
                <MainViewer transformRef={transformRef} />
                <PhotoStatusBar />
                <ThumbnailBar photos={productSelectedPhotos} />
              </Content>
            </Layout>

            <ConditionTip visible={conditionTipState.visible} msg={conditionTipState.msg} centered />
          </Layout>
        </ConfigProvider>

      </PhotoViewerContext.Provider>
    </OrderInfoContext.Provider>
  )
}

export default ProductSelectPage
