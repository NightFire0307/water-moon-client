import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'
import { RightOutlined } from '@ant-design/icons'
import { Button, Layout } from 'antd'
import { Header } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import { motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ConditionTip } from '@/components/ConditionTip/ConditionTip'
import { MainViewer } from '@/components/MainViewer/MainViewer'
import ProductSidebar from '@/components/ProductSidebar/ProductSidebar'
import ProgressDots from '@/components/ProgressDots/ProgressDots'
import { StepHeader } from '@/components/StepHeader/StepHeader'
import { ThumbnailBar } from '@/components/ThumbnailBar/ThumbnailBar'
import { ViewerControl } from '@/components/ViewerControl/ViewerControl'
import { PhotoViewerContext } from '@/contexts/PhotoViewerContext'
import { FILTER_TYPE, usePhotosStore } from '@/stores/usePhotosStore'
import { usePhotoViewerStore } from '@/stores/usePhotoViewerStore'
import { useProductsStore } from '@/stores/useProductsStore'
import ProductSelectConfirmModal from './components/productSelectConfirmModal'

const { Content } = Layout

function ProductSelectPage() {
  const [thumbnailVisible, setThumbnailVisible] = useState(false)
  const [viewerControlVisible, setViewerControlVisible] = useState(true)
  const [productSidebarVisible, setProductSidebarVisible] = useState(false)
  const [keyboardDisabled, setKeyboardDisabled] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [conditionTipState, setConditionTipState] = useState({
    visible: false,
    msg: '',
  })
  const transformRef = useRef<ReactZoomPanPinchRef>(null)
  const { productSelectedPhotos, filter, setCurrentPhoto } = usePhotosStore()
  const { next, previous, currentIndex, setCurrentIndex } = usePhotoViewerStore()
  const { setDropdownMenuStatus } = useProductsStore()

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

  // 监听过滤后的照片变化，自动设置当前第一张照片
  useEffect(() => {
    if (filteredPhotos.length > 0) {
      const firstPhoto = filteredPhotos[0]
      setCurrentPhoto(firstPhoto)
    }
    else {
      setCurrentPhoto(null)
    }
  }, [filteredPhotos, setCurrentPhoto])

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

  // 上一张照片
  const handlePreviousPhoto = useCallback(() => {
    if (currentIndex !== 0) {
      const previousPhoto = filteredPhotos[currentIndex - 1]
      setCurrentPhoto(previousPhoto)
      setDropdownMenuStatus(previousPhoto.selectedProducts)
      previous()
    }
    else {
      showConditionTip('已经是第一张照片了')
    }
  }, [currentIndex, filteredPhotos, previous, setCurrentPhoto, setDropdownMenuStatus, showConditionTip])

  // 下一张照片
  const handleNextPhoto = useCallback(() => {
    if (currentIndex < filteredPhotos.length - 1) {
      const nextPhoto = filteredPhotos[currentIndex + 1]
      setCurrentPhoto(nextPhoto)
      setDropdownMenuStatus(nextPhoto.selectedProducts)
      next()
    }
    else {
      showConditionTip('已经是最后一张照片了')
    }
  }, [currentIndex, filteredPhotos, next, setCurrentPhoto, setDropdownMenuStatus, showConditionTip])

  const handleKeydown = useCallback((e: KeyboardEvent) => {
    // 避免在输入框中触发
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return
    }

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        handlePreviousPhoto()
        break
      case 'ArrowRight':
        e.preventDefault()
        handleNextPhoto()
        break
      default:
        break
    }
  }, [handleNextPhoto, handlePreviousPhoto])

  // 全局按键事件
  useEffect(() => {
    window.addEventListener('keydown', handleKeydown)

    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [handleKeydown])

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
              <div className="flex items-end gap-4">
                <StepHeader stepNumber={3} stepTitle="产品选片" stepDesc="Product Selection" />
                <div className="flex flex-col text-xs text-darkBlueGray-400 mb-0.5">
                  <span>最近保存时间</span>
                  <span>2025-07-29 16:27:16</span>
                </div>
              </div>

              <div className="flex gap-4">
                {/* 当前进度 */}
                <ProgressDots currentStep={3} totalSteps={4} />

                <Button type="primary" onClick={() => setConfirmModalOpen(true)}>
                  下一步：提交选片结果
                  <RightOutlined />
                </Button>
              </div>
            </div>

          </motion.div>
        </Header>

        <Layout className="bg-darkBlueGray-900">
          <Sider width={320} className="bg-darkBlueGray-900 ">
            {/* 产品侧边栏 */}
            <ProductSidebar />
          </Sider>

          {/* 主视图区域 */}
          <Content className="relative p-4">
            <ViewerControl transformRef={transformRef} next={handleNextPhoto} previous={handlePreviousPhoto} />
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

      {/* 提交选片结果Modal */}
      <ProductSelectConfirmModal
        open={confirmModalOpen}
        onCancel={() => setConfirmModalOpen(false)}
      />

    </PhotoViewerContext.Provider>

  )
}

export default ProductSelectPage
