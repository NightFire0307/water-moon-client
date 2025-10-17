import { getOrderInfo, updateOrderStatus } from '@/apis/order'
import { useFullScreenLoading } from '@/components/FullScreenLoading/useFullScreenLoading'
import ProgressDots from '@/components/ProgressDots/ProgressDots'
import { StepHeader } from '@/components/StepHeader/StepHeader'
import { ThumbnailBar } from '@/components/ThumbnailBar/ThumbnailBar'
import { useAutoSync } from '@/hooks/useAutoSync'
import { useHotkeys } from '@/hooks/useHotkeys'
import { syncPreSelectedPhotos } from '@/services/photoSyncService'
import { useOrderStore } from '@/stores/useOrderStore'
import { type Photo, usePhotosStore } from '@/stores/usePhotosStore'
import { usePhotoViewerStore } from '@/stores/usePhotoViewerStore'
import { PreSelectStatus } from '@/types/selection/preSelection'
import { OrderStatus } from '@/types/user/order'
import { LeftOutlined, ReloadOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Checkbox, Divider, Layout, message, Space, Tooltip, Typography } from 'antd'
import { motion } from 'framer-motion'
import { CheckIcon, GalleryThumbnailsIcon, ImageIcon, SquareSplitHorizontalIcon, XIcon } from 'lucide-react'
import { type FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import ComparePhotoView from './components/ComparePhotoView'
import { PreSelectCentralIndicator } from './components/PreSelectCentralIndicator'
import PreSelectionConfirmModal from './components/PreSelectConfirmModal'
import PreSelectStatsTooltip from './components/PreSelectStatsTooltip'

const { Content, Footer } = Layout
const { Text } = Typography

const PreSelectPage: FC = () => {
  useAutoSync(syncPreSelectedPhotos, { delay: 30 })
  const [isProgressHovered, setIsProgressHovered] = useState(false)
  const [preSelectConfirmModalOpen, setPreSelectConfirmModalOpen] = useState(false)
  const [isThumbnailBarVisible, setIsThumbnailBarVisible] = useState(false)

  const {
    preSelectedPhotos,
    currentPhoto,
    togglePreSelected,
    setCurrentPhoto,
    setProductSelectedPhotos,
    viewMode,
    setViewMode,
    setComparePhotos,
    comparePhotos,
  } = usePhotosStore()
  const { next, previous, currentIndex, setCurrentIndex } = usePhotoViewerStore()
  const { setOrderInfo } = useOrderStore()
  const { showLoading, hideLoading } = useFullScreenLoading()
  const navigate = useNavigate()
  const { syncNow } = useAutoSync(syncPreSelectedPhotos, { delay: 30, manualSync: true })
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const preSelectPhotos = useMemo(() => {
    const result = []

    for (const [photoId, value] of preSelectedPhotos.entries()) {
      result.push({
        photoId,
        ...value,
      })
    }

    return result
  }, [preSelectedPhotos])

  // 页面快捷键
  useHotkeys([
    {
      key: 'ArrowLeft',
      cb: () => {
        // 如果当前是第一张照片，则不切换
        if (currentIndex !== 0) {
          const previousPhoto = preSelectPhotos[currentIndex - 1]
          setCurrentPhoto(previousPhoto)
          previous()
        }
      },
    },
    {
      key: 'ArrowRight',
      cb: () => {
        // 如果index不是最后一张则切换到下一张
        if (currentIndex < preSelectPhotos.length - 1) {
          // 如果当前照片为 pending 则自动标记 selected
          if (currentPhoto?.preSelectStatus === PreSelectStatus.PENDING) {
            togglePreSelected(PreSelectStatus.SELECTED)
          }

          const nextPhoto = preSelectPhotos[currentIndex + 1]
          setCurrentPhoto(nextPhoto)

          next()
        }
      },
    },
    {
      key: 'space',
      cb: () => {
        if (currentPhoto?.preSelectStatus === PreSelectStatus.SELECTED) {
          setCurrentPhoto({ ...currentPhoto, preSelectStatus: PreSelectStatus.EXCLUDED })
          togglePreSelected(PreSelectStatus.EXCLUDED)
        }
        else if (currentPhoto?.preSelectStatus === PreSelectStatus.EXCLUDED) {
          setCurrentPhoto({ ...currentPhoto, preSelectStatus: PreSelectStatus.SELECTED })
          togglePreSelected(PreSelectStatus.SELECTED)
        }
        else if (currentPhoto?.preSelectStatus === PreSelectStatus.PENDING) {
          setCurrentPhoto({ ...currentPhoto, preSelectStatus: PreSelectStatus.EXCLUDED })
          togglePreSelected(PreSelectStatus.EXCLUDED)
        }

        // if (currentIndex < preSelectPhotos.length - 1) {
        //   const nextPhoto = preSelectPhotos[currentIndex + 1]
        //   setCurrentPhoto(nextPhoto)
        //   next()
        // }
      },
    },
  ])

  // 处理预选确认
  const handlePreSelectConfirm = async () => {
    showLoading('正在同步预选照片...')

    // 将预选照片所有选中的复制到产品选片
    setProductSelectedPhotos(
      new Map(preSelectPhotos.filter(photo => photo.preSelectStatus === PreSelectStatus.SELECTED)
        .map(({ photoId, ...rest }) => [photoId, rest]),
      ),
    )

    // 设置当前索引为 null
    setCurrentPhoto(null)

    // 重置当前索引
    setCurrentIndex(0)

    try {
      await Promise.all([
        // 同步预选照片
        syncNow(),
        // 更新订单状态
        updateOrderStatus(OrderStatus.PRODUCT_SELECT),
      ])

      // 获取最新订单信息
      const { data } = await getOrderInfo()
      setOrderInfo(data)

      navigate('/product-select')
    }
    catch (err) {
      console.error(err)
    }
    finally {
      hideLoading()
    }
  }

  // 渲染额外内容
  const renderExtra = useCallback((item: Photo) => {
    // 单图模式下的额外内容
    if (viewMode === 'single') {
      return (
        <>
          {
            item.preSelectStatus === PreSelectStatus.SELECTED && (
              <div className="flex justify-center items-center w-4 h-4 rounded-full bg-cyan-500 shadow-md">
                <CheckIcon className="text-xs text-white" />
              </div>
            )
          }
          {
            item.preSelectStatus === PreSelectStatus.EXCLUDED && (
              <div className="flex justify-center items-center w-4 h-4 rounded-full bg-amber-500 shadow-md">
                <XIcon className="text-xs text-white" />
              </div>
            )
          }
        </>
      )
    }

    // 比较模式下的额外内容
    if (viewMode === 'compare') {
      return (
        <Checkbox
          checked={comparePhotos.some(photo => photo.photoId === item.photoId)}
          className="-mt-1"
          onChange={() => {
            if (comparePhotos.some(photo => photo.photoId === item.photoId)) {
              setComparePhotos(comparePhotos.filter(photo => photo.photoId !== item.photoId))
            }
            else {
              if (comparePhotos.length >= 4) {
                message.warning('最多只能同时比较4张照片')
                return
              }
              setComparePhotos([...comparePhotos, structuredClone(item)])
            }
          }}
        />
      )
    }

    return null
  }, [viewMode, comparePhotos, setComparePhotos])

  useEffect(() => {
    if (currentPhoto === null && preSelectPhotos.length > 0) {
      setCurrentPhoto(preSelectPhotos[0])
    }
  }, [currentPhoto, preSelectPhotos, setCurrentPhoto])

  return (
    <Layout
      className={`h-screen relative bg-darkBlueGray-900 overflow-hidden `}
    >
      {/* 顶部标题栏 */}
      <div
        className="absolute top-0 left-0 right-0 z-30 bg-darkBlueGray-900/70 backdrop-blur-md border-b border-darkBlueGray-700/70"
      >
        <div
          className="flex items-center justify-between px-4 py-2"
        >
          <div className="flex items-center gap-4">
            <Button
              icon={<LeftOutlined />}
              type="text"
              size="large"
              onClick={() => navigate('/order-info')}
              className="text-darkBlueGray-200 hover:text-darkBlueGray-50 hover:bg-darkBlueGray-700/50"
            />
            <StepHeader stepNumber={2} title="预选照片" subtitle="Photo PreSelection" />
          </div>

          {/* 快捷键提示 */}
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <kbd className="px-3 py-1 bg-darkBlueGray-700 border border-darkBlueGray-600 rounded-md text-md text-darkBlueGray-200 font-mono">F11</kbd>
              <Text className="text-darkBlueGray-300 text-sm font-medium">全屏</Text>
            </div>

            <div className="w-px h-5 bg-darkBlueGray-600"></div>

            <div className="flex items-center gap-2">
              <kbd className="px-3 py-1 bg-darkBlueGray-700 border border-darkBlueGray-600 rounded-md text-md text-darkBlueGray-200 font-mono">←</kbd>
              <kbd className="px-3 py-1 bg-darkBlueGray-700 border border-darkBlueGray-600 rounded-md text-md text-darkBlueGray-200 font-mono">→</kbd>
              <Text className="text-darkBlueGray-300 text-sm font-medium">切换照片</Text>
            </div>

            <div className="w-px h-5 bg-darkBlueGray-600"></div>

            <div className="flex items-center gap-2">
              <kbd className="px-3 py-1 bg-darkBlueGray-700 border border-darkBlueGray-600 rounded-md text-md text-darkBlueGray-200 font-mono">Space</kbd>
              <Text className="text-darkBlueGray-300 text-sm font-medium">排除 / 还原</Text>
            </div>
          </div>

          {/* 全屏和进度显示 */}
          <div className="flex items-center gap-4">
            <ProgressDots currentStep={2} totalSteps={4} />

            {/* 重置按钮 */}
            <Button

              icon={<ReloadOutlined />}
            >
              重置预选
            </Button>

            {/* 下一步选产品 */}
            <Button
              id="preselect-next-step-button"
              type="primary"
              onClick={() => {
                setPreSelectConfirmModalOpen(true)
              }}
            >
              下一步：选择产品
              <RightOutlined />
            </Button>
          </div>
        </div>
      </div>

      {/* 主视图区域 */}
      <Content className="relative flex-1 mt-16">
        <div className="h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: 10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative w-full h-full"
          >

            {/* 单图视图 */}
            {
              viewMode === 'single' && (
                <div className="relative rounded-md shadow-2xl overflow-hidden border border-darkBlueGray-700/50 w-full h-full">
                  <div className="w-full h-full bg-darkBlueGray-800 flex items-center justify-center">
                    {
                      currentPhoto?.mediumUrl
                        ? (
                            <img
                              src={currentPhoto.mediumUrl}
                              alt={currentPhoto.name}
                              className="object-container max-h-full max-w-full"
                            />
                          )
                        : (<Text className="text-darkBlueGray-400 text-lg">照片预览区域</Text>)
                    }
                  </div>

                  {/* 照片信息覆盖层 - 左上角 */}
                  <div className="absolute top-4 left-4 bg-darkBlueGray-800/90 backdrop-blur-md rounded-md px-4 py-2 select-none border border-darkBlueGray-500/50 shadow-xl">
                    <Text className="text-darkBlueGray-50 text-sm font-medium">{currentPhoto?.name ?? '暂无照片'}</Text>
                  </div>

                  {/* 进度显示和状态标识 - 右上角区域 */}
                  <div className="absolute top-4 right-4 flex flex-col items-end gap-3 select-none">

                    {/* 进度统计 */}
                    <div
                      id="preselect-progress-status"
                      className="relative w-24 bg-darkBlueGray-800/90 backdrop-blur-sm rounded-md px-3 py-2 border border-darkBlueGray-500/50 shadow-xl"
                      onMouseEnter={() => {
                        if (hoverTimeoutRef.current) {
                          clearTimeout(hoverTimeoutRef.current)
                          hoverTimeoutRef.current = null
                        }
                        setIsProgressHovered(true)
                      }}
                      onMouseLeave={() => {
                        hoverTimeoutRef.current = setTimeout(() => {
                          setIsProgressHovered(false)
                          hoverTimeoutRef.current = null
                        }, 200)
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="text-center">
                          <Text className="text-darkBlueGray-200 text-sm font-medium block leading-tight">{currentIndex + 1}</Text>
                          <Text className="text-darkBlueGray-400 text-xs">当前</Text>
                        </div>
                        <div className="w-px h-5 bg-darkBlueGray-500"></div>
                        <div className="text-center">
                          <Text className="text-darkBlueGray-50 text-sm font-medium block leading-tight">{preSelectPhotos.length}</Text>
                          <Text className="text-darkBlueGray-400 text-xs">总数</Text>
                        </div>
                      </div>

                      {/* 筛选统计悬浮窗 */}
                      <PreSelectStatsTooltip isProgressHovered={isProgressHovered} />
                    </div>
                  </div>

                  {/* 大型中央状态指示器 */}
                  {
                    currentPhoto && (
                      <PreSelectCentralIndicator status={currentPhoto.preSelectStatus} />
                    )
                  }

                </div>
              )
            }

            {/* 多图比较视图 */}
            <div className="h-full px-6 bg-darkBlueGray-800">
              { viewMode === 'compare' && <ComparePhotoView /> }
            </div>

          </motion.div>
        </div>

        {/* 缩略图栏 */}
        <ThumbnailBar
          visible={isThumbnailBarVisible}
          photos={preSelectPhotos}
          extra={renderExtra}
          onClickThumbnail={(item, index) => {
            setCurrentIndex(index)
            setCurrentPhoto(item)
          }}
          isPhotoSelected={({ photoId }) => {
            if (viewMode === 'compare') {
              return comparePhotos.find(photo => photo.photoId === photoId) !== undefined
            }
            else if (viewMode === 'single') {
              return currentPhoto?.photoId === photoId
            }
            return false
          }}
        />
      </Content>

      {/* 底部操作栏 */}
      <Footer className="flex items-center h-12 px-4 bg-darkBlueGray-900 border-t border-darkBlueGray-700/70 z-10">
        <Space>
          <Tooltip title="" placement="topRight" mouseEnterDelay={1}>
            <Button
              type="text"
              icon={<GalleryThumbnailsIcon size={18} />}
              onClick={() => { setIsThumbnailBarVisible(v => !v) }}
            />
          </Tooltip>
          <Divider type="vertical" className="bg-darkBlueGray-600" />
          <Button
            type={viewMode === 'single' ? 'primary' : 'text'}
            icon={<ImageIcon size={18} />}
            onClick={() => {
              setViewMode('single')
              setComparePhotos([])
            }}
          />
          <Button
            type={viewMode === 'compare' ? 'primary' : 'text'}
            icon={<SquareSplitHorizontalIcon size={18} />}
            onClick={() => {
              if (viewMode === 'compare')
                return

              if (!isThumbnailBarVisible) {
                setIsThumbnailBarVisible(true)
              }
              setViewMode('compare')
              setComparePhotos(currentPhoto ? [structuredClone(currentPhoto)] : [])
            }}
          />
        </Space>
      </Footer>

      {/* 预选确认弹窗 */}
      <PreSelectionConfirmModal
        open={preSelectConfirmModalOpen}
        onConfirm={handlePreSelectConfirm}
        onCancel={() => setPreSelectConfirmModalOpen(false)}
      />

    </Layout>
  )
}

export default PreSelectPage
