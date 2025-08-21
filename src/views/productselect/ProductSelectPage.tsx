import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'
import { ConditionTip } from '@/components/ConditionTip/ConditionTip'
import { useFullScreenLoading } from '@/components/FullScreenLoading/useFullScreenLoading'
import { MainViewer } from '@/components/MainViewer/MainViewer'
import ProductSidebar from '@/components/ProductSidebar/ProductSidebar'
import ProgressDots from '@/components/ProgressDots/ProgressDots'
import { StepHeader } from '@/components/StepHeader/StepHeader'
import { ThumbnailBar } from '@/components/ThumbnailBar/ThumbnailBar'
import { ViewerControl } from '@/components/ViewerControl/ViewerControl'
import { PhotoViewerContext } from '@/contexts/PhotoViewerContext'
import { useAutoSync } from '@/hooks/useAutoSync'
import { syncProductPhotos } from '@/services/photoSyncService'
import { FILTER_TYPE, usePhotosStore } from '@/stores/usePhotosStore'
import { usePhotoViewerStore } from '@/stores/usePhotoViewerStore'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Layout, Tour } from 'antd'
import { Header } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import { motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import ProductSelectConfirmModal from './components/productSelectConfirmModal'
import { getProductSelectTourSteps } from './tourSteps'

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
  const { getProductSelectedPhotos, filter, setCurrentPhoto, currentPhoto } = usePhotosStore()
  const { next, previous, currentIndex, setCurrentIndex } = usePhotoViewerStore()
  const navigate = useNavigate()
  const productSelectedPhotos = getProductSelectedPhotos()
  const { showLoading, hideLoading } = useFullScreenLoading()
  const tourRefs = useRef({})
  const [tourOpen, setTourOpen] = useState(false)
  const { syncNow } = useAutoSync(syncProductPhotos) // 启动产品照片同步

  // 生成产品选片的引导步骤
  const tourSteps = getProductSelectTourSteps(tourRefs.current)

  useEffect(() => {
    const showTour = window.localStorage.getItem('tour_show_product_select_v1') !== 'true'
    if (showTour) {
      setTourOpen(true)
    }
  }, [])

  const filteredPhotos = useMemo(() => {
    const { productId, filterType } = filter

    if (filterType === FILTER_TYPE.SELECTED) {
      if (productId === undefined) {
        return productSelectedPhotos.filter((photo) => {
          return photo.selectedProducts.length > 0
        })
      }
      return productSelectedPhotos.filter((photo) => {
        return photo.selectedProducts.includes(productId)
      })
    }

    // 过滤未选的照片
    if (filterType === FILTER_TYPE.UNSELECTED && productId === undefined) {
      return productSelectedPhotos.filter((photo) => {
        return photo.selectedProducts.length === 0
      })
    }

    return [...productSelectedPhotos]
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
  }, [filteredPhotos, currentPhoto, setCurrentPhoto, setCurrentIndex])

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

  // 处理提交事件
  const handleConfirm = async () => {
    showLoading('正在同步产品选片...')
    await syncNow()
    navigate('/preview')
    hideLoading()
  }

  // 全局按键事件
  useEffect(() => {
    window.addEventListener('keydown', handleKeydown)

    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [handleKeydown])

  return (
    <PhotoViewerContext.Provider
      value={{
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
      <Layout className="relative h-screen overflow-hidden bg-gradient-to-br from-darkBlueGray-950 via-darkBlueGray-900 to-darkBlueGray-950">
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
                <div className="flex items-center gap-4">
                  <Button
                    type="text"
                    icon={<LeftOutlined />}
                    size="large"
                    onClick={() => navigate('/pre-select')} // 返回产品选择页面
                  />
                  <StepHeader stepNumber={3} stepTitle="产品选片" stepDesc="Product Selection" />
                </div>
                <div className="mb-0.5 flex flex-col text-xs text-darkBlueGray-400">
                  <span>最近保存时间</span>
                  <span>2025-07-29 16:27:16</span>
                </div>
              </div>

              <div className="flex gap-4">
                {/* 当前进度 */}
                <ProgressDots currentStep={3} totalSteps={4} />

                <Button
                  type="primary"
                  onClick={() => setConfirmModalOpen(true)}
                  className="bg-blue-500 hover:bg-blue-600 active:bg-blue-800"
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
            <ProductSidebar ref={(el) => {
              if (el) {
                Object.assign(tourRefs.current, {
                  photoFilterBarRef: el.photoFilterBarRef,
                  productBarRef: el.productBarRef,
                })
              }
            }}
            />
          </Sider>

          {/* 主视图区域 */}
          <Content className="relative">
            <ViewerControl
              transformRef={transformRef}
              next={handleNextPhoto}
              previous={handlePreviousPhoto}
              ref={(el) => {
                if (el) {
                  Object.assign(tourRefs.current, {
                    actionBarRef: el.actionBarRef,
                    addToProductRef: el.addToProductRef,
                    remarkRef: el.remarkRef,
                  })
                }
              }}
            />
            <MainViewer transformRef={transformRef} />
            <ThumbnailBar
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

      {/* 提交选片结果Modal */}
      <ProductSelectConfirmModal
        open={confirmModalOpen}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmModalOpen(false)}
      />

      <Tour
        open={tourOpen}
        steps={tourSteps}
        onClose={() => {
          setTourOpen(false)
          window.localStorage.setItem('tour_show_product_select_v1', 'true')
        }}
      />
    </PhotoViewerContext.Provider>
  )
}

export default ProductSelectPage
