import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'
import { ConditionTip } from '@/components/ConditionTip/ConditionTip'
import { MainViewer } from '@/components/MainViewer/MainViewer'
import ProductSidebar from '@/components/ProductSidebar/ProductSidebar'
import { StepHeader } from '@/components/StepHeader/StepHeader'
import { ThumbnailBar } from '@/components/ThumbnailBar/ThumbnailBar'
import { ViewerControl } from '@/components/ViewerControl/ViewerControl'
import { PhotoViewerContext } from '@/contexts/PhotoViewerContext'
import { FILTER_TYPE, usePhotosStore } from '@/stores/usePhotosStore.tsx'
import { usePhotoViewerStore } from '@/stores/usePhotoViewerStore'
import { useProductsStore } from '@/stores/useProductsStore'
import { RightOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Layout } from 'antd'
import { Header } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import zhCN from 'antd/locale/zh_CN'
import { motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

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
  const { getCurrentPhotoInfo, productSelectedPhotos, filter, currentPhoto, setCurrentPhoto } = usePhotosStore()
  const { next, previous, currentIndex, setCurrentIndex } = usePhotoViewerStore()
  const { setDropdownMenuStatus, setSelectedPhotoIds } = useProductsStore()

  const filteredPhotos = useMemo(() => {
    const { productId, filterType } = filter

    // 过滤指定产品的照片
    if (filterType === FILTER_TYPE.SELECTED && productId !== undefined) {
      return productSelectedPhotos.filter((photo) => {
        return photo.selectedProducts.includes(productId)
      })
    }

    // 过滤已选的照片
    if (filterType === FILTER_TYPE.SELECTED && productId === undefined) {
      return productSelectedPhotos.filter((photo) => {
        return photo.selectedProducts.length > 0
      })
    }

    // 过滤未选的照片
    if (filterType === FILTER_TYPE.UNSELECTED && productId === undefined) {
      return productSelectedPhotos.filter((photo) => {
        return photo.selectedProducts.length === 0
      })
    }

    return productSelectedPhotos
  }, [filter, productSelectedPhotos])

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
    // 避免在输入框中触发
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return
    }

    const { currentIndex, totalCount } = getCurrentPhotoInfo()

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        if (currentIndex !== 0) {
          const previousPhoto = filteredPhotos[currentIndex - 1]
          setCurrentPhoto(previousPhoto)
          setDropdownMenuStatus(previousPhoto.selectedProducts)
          previous()
        }
        else {
          showConditionTip('已经是第一张照片了')
        }
        break
      case 'ArrowRight':
        e.preventDefault()
        if (currentIndex < filteredPhotos.length - 1) {
          const nextPhoto = filteredPhotos[currentIndex + 1]

          setCurrentPhoto(nextPhoto)
          setDropdownMenuStatus(nextPhoto.selectedProducts)
          next()
        }
        else {
          showConditionTip('已经是最后一张照片了')
        }

        break
      default:
        break
    }
  }, [previous, next, getCurrentPhotoInfo, showConditionTip])

  // 全局按键事件
  useEffect(() => {
    window.addEventListener('keydown', handleKeydown)

    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [handleKeydown])

  useEffect(() => {
    if (currentPhoto === null) {
      setCurrentPhoto(productSelectedPhotos[0])
    }
  }, [productSelectedPhotos, currentPhoto, setDropdownMenuStatus])

  return (
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
            <Content className="relative p-4">
              <ViewerControl transformRef={transformRef} />
              <MainViewer transformRef={transformRef} />
              <ThumbnailBar
                photos={filteredPhotos}
                currentIndex={currentIndex}
                onClickThumbnail={(item, index) => {
                  setCurrentIndex(index)
                  setCurrentPhoto(item)
                }}
              />
              <ConditionTip
                visible={conditionTipState.visible}
                msg={conditionTipState.msg}
                centered
              />
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>

    </PhotoViewerContext.Provider>

  )
}

export default ProductSelectPage
