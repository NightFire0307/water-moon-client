import type { Photo } from '@/stores/usePhotosStore'
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'
import { updateOrderStatus } from '@/apis/order'
import { ConditionTip } from '@/components/ConditionTip/ConditionTip'
import CustomModal from '@/components/CustomModal/CustomModal.tsx'
import { useFullScreenLoading } from '@/components/FullScreenLoading/useFullScreenLoading'
import { MainViewer } from '@/components/MainViewer/MainViewer'
import ProgressDots from '@/components/ProgressDots/ProgressDots'
import { StepHeader } from '@/components/StepHeader/StepHeader'
import { ThumbnailBar } from '@/components/ThumbnailBar/ThumbnailBar'
import { ViewerControl } from '@/components/ViewerControl/ViewerControl'
import { PhotoViewerContext } from '@/contexts/PhotoViewerContext'
import { useAutoSync } from '@/hooks/useAutoSync'
import { syncProductPhotos } from '@/services/photoSyncService'
import { useOrderStore } from '@/stores/useOrderStore'
import { FILTER_TYPE, usePhotosStore } from '@/stores/usePhotosStore'
import { usePhotoViewerStore } from '@/stores/usePhotoViewerStore.ts'
import { OrderStatus } from '@/types/user/order'
import ProductSidebar from '@/views/productselect/components/ProductSidebar'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Layout } from 'antd'
import { Header } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import { motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
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
  const [preSelectConfirmOpen, setPreSelectConfirmOpen] = useState(false) // 返回预选确认框
  const transformRef = useRef<ReactZoomPanPinchRef>(null)
  const { fetchOrder } = useOrderStore()
  const { fetchPhotos } = usePhotosStore()
  const { filter, setCurrentPhoto, currentPhoto, productSelectedPhotos } = usePhotosStore()
  const { next, previous, currentIndex, setCurrentIndex } = usePhotoViewerStore()
  const navigate = useNavigate()
  const { showLoading, hideLoading } = useFullScreenLoading()
  const { syncNow, syncDate } = useAutoSync(syncProductPhotos, { delay: 30 }) // 启动产品照片同步

  const filteredPhotos = useMemo(() => {
    const { productId, filterType } = filter
    const cachedPhotos: Photo[] = []

    for (const [photoId, value] of productSelectedPhotos.entries()) {
      cachedPhotos.push({
        photoId,
        ...value,
      })
    }

    if (filterType === FILTER_TYPE.SELECTED) {
      if (productId === undefined) {
        return cachedPhotos.filter((photo) => {
          return photo.selectedProducts.length > 0
        })
      }
      return cachedPhotos.filter((photo) => {
        return photo.selectedProducts.includes(productId)
      })
    }

    // 过滤未选的照片
    if (filterType === FILTER_TYPE.UNSELECTED && productId === undefined) {
      return cachedPhotos.filter((photo) => {
        return photo.selectedProducts.length === 0
      })
    }

    return [...cachedPhotos]
  }, [filter, productSelectedPhotos])

  useEffect(() => {
    if (filteredPhotos.length === 0) {
      setCurrentPhoto(null)
      setCurrentIndex(0)
      return
    }

    // 当前照片不在新列表里时，自动切换到第一张
    const exist = filteredPhotos.find(photo => photo.photoId === currentPhoto?.photoId)
    if (!exist) {
      setCurrentPhoto({ ...filteredPhotos[0] })
      setCurrentIndex(0)
    }
  }, [filteredPhotos])

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
      previous()
    }
    else {
      showConditionTip('已经是第一张照片了')
    }
  }, [currentIndex, filteredPhotos, previous, setCurrentPhoto, showConditionTip])

  // 下一张照片
  const handleNextPhoto = useCallback(() => {
    if (currentIndex < filteredPhotos.length - 1) {
      const nextPhoto = filteredPhotos[currentIndex + 1]
      setCurrentPhoto(nextPhoto)
      next()
    }
    else {
      showConditionTip('已经是最后一张照片了')
    }
  }, [currentIndex, filteredPhotos, next, setCurrentPhoto, showConditionTip])

  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      // 避免在输入框中触发
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.code) {
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
    },
    [handleNextPhoto, handlePreviousPhoto],
  )

  // 处理返回预选页面操作
  const handleBackToPreSelect = async () => {
    showLoading('正在返回预选页面...')

    try {
      await updateOrderStatus(OrderStatus.PRE_SELECT)
      await fetchOrder(true)
      navigate('/pre-select')
    }
    finally {
      hideLoading()
    }
  }

  // 处理提交事件
  const handleConfirm = async () => {
    showLoading('正在同步产品选片...')
    await syncNow()
    navigate('/preview')
    hideLoading()
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown)

    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [handleKeydown])

  useEffect(() => {
    fetchPhotos()
  }, [])

  const photoViewerContextValue = useMemo(() => ({
    thumbnailVisible,
    setThumbnailVisible,
    viewerControlVisible,
    setViewerControlVisible,
    productSidebarVisible,
    setProductSidebarVisible,
    keyboardDisabled,
    setKeyboardDisabled,
  }), [
    thumbnailVisible,
    viewerControlVisible,
    productSidebarVisible,
    keyboardDisabled,
    setThumbnailVisible,
    setViewerControlVisible,
    setProductSidebarVisible,
    setKeyboardDisabled,
  ])

  return (
    <PhotoViewerContext.Provider value={photoViewerContextValue}>
      <Layout
        className="relative h-screen overflow-hidden bg-gradient-to-br from-darkBlueGray-950 via-darkBlueGray-900 to-darkBlueGray-950"
      >
        <Header>
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 right-0 top-0 z-30 border-b border-darkBlueGray-700/30 bg-darkBlueGray-900/70 backdrop-blur-md"
          >
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-end gap-4">
                <div className="flex items-center gap-4 bg-gree bg-te">
                  <Button
                    type="text"
                    icon={<LeftOutlined />}
                    size="large"
                    onClick={() => setPreSelectConfirmOpen(true)} // 返回产品选择页面
                  />
                  <StepHeader stepNumber={3} title="产品选片" subtitle="Product Selection" />
                </div>
                {
                  syncDate && (
                    <div className="mb-0.5 flex flex-col text-xs text-darkBlueGray-400">
                      <span>最近保存时间</span>
                      <span>{syncDate}</span>
                    </div>
                  )
                }
              </div>

              <div className="flex gap-4">
                {/* 当前进度 */}
                <ProgressDots currentStep={3} totalSteps={4} />

                <Button
                  type="primary"
                  onClick={() => setConfirmModalOpen(true)}
                >
                  下一步：最终预览
                  <RightOutlined />
                </Button>
              </div>
            </div>
          </motion.div>
        </Header>

        <Layout className="bg-darkBlueGray-900">
          <Sider width={320} className="bg-darkBlueGray-900">
            {/* 产品侧边栏 */}
            <ProductSidebar />
          </Sider>

          {/* 主视图区域 */}
          <Content className="relative">
            <ViewerControl
              transformRef={transformRef}
              next={handleNextPhoto}
              previous={handlePreviousPhoto}
            />
            <MainViewer transformRef={transformRef} />

            <ThumbnailBar
              visible
              photos={filteredPhotos}
              currentIndex={currentIndex}
              onClickThumbnail={(item, index) => {
                setCurrentIndex(index)
                setCurrentPhoto(item)
              }}
            />
            <ConditionTip visible={conditionTipState.visible} msg={conditionTipState.msg} centered />
          </Content>
        </Layout>
      </Layout>

      {/* 返回预选确认框 */}
      <CustomModal
        title="确认返回预选页面吗？"
        desc="注：返回预选页面后，当前产品选片的修改将会被保存。"
        onOk={handleBackToPreSelect}
        onCancel={() => setPreSelectConfirmOpen(false)}
        open={preSelectConfirmOpen}
        centered
      />

      {/* 提交选片结果Modal */}
      <ProductSelectConfirmModal
        open={confirmModalOpen}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmModalOpen(false)}
      />

    </PhotoViewerContext.Provider>
  )
}

export default ProductSelectPage
