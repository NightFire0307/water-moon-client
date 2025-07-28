import type { FC } from 'react'
import { PreSelectStatus, usePhotosStore } from '@/stores/usePhotosStore'
import { usePhotoViewerStore } from '@/stores/usePhotoViewerStore'
import { CheckOutlined, CloseOutlined, FullscreenExitOutlined, FullscreenOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Layout, Typography } from 'antd'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { StepHeader } from '../StepHeader/StepHeader'
import { ThumbnailBar } from '../ThumbnailBar/ThumbnailBar'
import PreSelectionConfirmModal from './PreSelectionConfirmModal'
import { PreSelectStatsTooltip } from './PreSelectStatsTooltip'

const { Content } = Layout
const { Text } = Typography

interface PreSelectProps {
}

export const PreSelect: FC<PreSelectProps> = () => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isProgressHovered, setIsProgressHovered] = useState(false)
  const [preSelectConfirmModalOpen, setPreSelectConfirmModalOpen] = useState(false)
  const { preSelectedPhotos, currentPhoto, togglePreSelected, setCurrentPhoto, copyPreSelectedPhotos, setMode } = usePhotosStore()
  const { next, previous, currentIndex, setCurrentIndex } = usePhotoViewerStore()
  const navigate = useNavigate()

  // 全屏切换处理
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    }
    else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // 处理预选确认
  const handlePreSelectConfirm = () => {
    // 处理预选边界情况，当下一步时，如果当前照片是 pending 状态，则自动标记为 selected
    if (currentPhoto?.preSelectStatus === PreSelectStatus.PENDING) {
      togglePreSelected(PreSelectStatus.SELECTED)
    }

    // 拷贝预选照片到产品选片
    copyPreSelectedPhotos()

    // 设置当前索引为 null
    setCurrentPhoto(null)

    // 重置当前索引
    setCurrentIndex(0)

    // 设置当前模式为产品选择
    setMode('productSelect')

    // 跳转到产品选择页面
    navigate('/product-select')
  }

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // 键盘快捷键
  const handleKeyPress = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'F11':
        e.preventDefault()
        toggleFullscreen()
        break
      case 'ArrowLeft':
        e.preventDefault()

        // 如果当前是第一张照片，则不切换
        if (currentIndex !== 0) {
          const previousPhoto = preSelectedPhotos[currentIndex - 1]
          setCurrentPhoto(previousPhoto)
          previous()
        }
        break
      case 'ArrowRight':
        e.preventDefault()

        // 如果index不是最后一张则切换到下一张
        if (currentIndex < preSelectedPhotos.length - 1) {
          // 如果当前照片为 pending 则自动标记 selected
          if (currentPhoto?.preSelectStatus === PreSelectStatus.PENDING) {
            togglePreSelected(PreSelectStatus.SELECTED)
          }

          const nextPhoto = preSelectedPhotos[currentIndex + 1]
          setCurrentPhoto(nextPhoto)

          next()
        }

        break
      case ' ':
        e.preventDefault()
        togglePreSelected(PreSelectStatus.EXCLUDE)
        if (currentIndex < preSelectedPhotos.length - 1) {
          const nextPhoto = preSelectedPhotos[currentIndex + 1]
          setCurrentPhoto(nextPhoto)
          next()
        }

        break
      default:
        break
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentPhoto, currentIndex])

  useEffect(() => {
    if (currentPhoto === null && preSelectedPhotos.length > 0) {
      setCurrentPhoto(preSelectedPhotos[0])
    }
  }, [currentPhoto, preSelectedPhotos])

  return (
    <Layout className={`h-screen relative bg-gradient-to-br from-darkBlueGray-950 via-darkBlueGray-900 to-darkBlueGray-950 overflow-hidden ${isFullscreen ? 'cursor-none' : ''}`}>
      {/* 顶部标题栏 */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{
          opacity: isFullscreen ? 0 : 1,
          y: isFullscreen ? -50 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="absolute top-0 left-0 right-0 z-30 bg-darkBlueGray-900/70 backdrop-blur-md border-b border-darkBlueGray-700/30"
      >
        <div
          className="flex items-center justify-between px-4 py-2"
        >
          <StepHeader stepNumber={2} stepTitle="预选照片" stepDesc="Photo PreSelection" />

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
            {/* 全屏按钮 */}
            <Button
              type="text"
              icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
              onClick={toggleFullscreen}
              className="text-darkBlueGray-300 hover:text-white"
              title={isFullscreen ? '退出全屏 (F11)' : '进入全屏 (F11)'}
            />

            {/* 原有的进度显示 */}
            <div
              className="flex items-center gap-6 text-sm select-none relative"
              onMouseEnter={() => setIsProgressHovered(true)}
              onMouseLeave={() => setIsProgressHovered(false)}
            >
              <Text className="text-darkBlueGray-300">
                当前：
                <span className="text-blue-400 font-semibold mx-1">{currentIndex + 1}</span>
                /
                <span className="text-white font-semibold mx-1">{ preSelectedPhotos.length }</span>
              </Text>

              {/* 筛选统计悬浮窗 */}
              <PreSelectStatsTooltip isProgressHovered={isProgressHovered} />
            </div>

            {/* 下一步选产品 */}
            <Button
              type="primary"
              onClick={() => setPreSelectConfirmModalOpen(true)}
            >
              下一步：选择产品
              <RightOutlined />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* 全屏模式下的浮动控制栏 */}
      {isFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-4 right-4 z-50 bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-4"
        >
          <Text className="text-white text-sm">
            <span className="text-blue-400 font-semibold">3</span>
            <span className="text-darkBlueGray-300 mx-1">/</span>
            <span className="text-white font-semibold">{preSelectedPhotos.length}</span>
          </Text>
          <Button
            type="text"
            size="small"
            icon={<FullscreenExitOutlined />}
            onClick={toggleFullscreen}
            className="text-white hover:text-blue-400"
          />
        </motion.div>
      )}

      {/* 主视图区域 */}
      <Content className={`relative flex-1 ${isFullscreen ? 'pt-0 pb-0 px-0' : 'pt-20 pb-4 px-4'}`}>
        <div className="h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: 10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative w-full h-full"
          >
            {/* 照片容器 */}
            <div className="relative bg-darkBlueGray-800 rounded-xl shadow-2xl overflow-hidden border border-darkBlueGray-700/50 w-full h-full">
              <div className="w-full h-full bg-gradient-to-br from-darkBlueGray-700 to-darkBlueGray-800 flex items-center justify-center px-16">
                {
                  currentPhoto?.thumbnail_url
                    ? (
                        <img
                          src={currentPhoto.thumbnail_url}
                          alt={currentPhoto.name}
                          className="object-container h-full"
                        />
                      )
                    : (<Text className="text-darkBlueGray-400 text-lg">照片预览区域</Text>)
                }
              </div>

              {/* 照片信息覆盖层 */}
              <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                <Text className="text-white text-md font-medium">{ currentPhoto?.name ?? '' }</Text>
              </div>

              {/* 状态标识 */}
              {currentPhoto?.preSelectStatus === PreSelectStatus.SELECTED && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="absolute top-3 right-3 bg-green-600/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 shadow-lg"
                >
                  <div className="w-3 h-3 rounded-full bg-green-400 shadow-lg shadow-green-400/50"></div>
                  <Text className="text-white text-sm font-semibold">已选择</Text>
                </motion.div>
              )}

              {currentPhoto?.preSelectStatus === PreSelectStatus.EXCLUDE && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="absolute top-3 right-3 bg-red-600/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 shadow-lg"
                >
                  <div className="w-3 h-3 rounded-full bg-red-400 shadow-lg shadow-red-400/50"></div>
                  <Text className="text-white text-sm font-semibold">已排除</Text>
                </motion.div>
              )}

              {/* 大型中央状态指示器 */}
              {currentPhoto?.preSelectStatus === PreSelectStatus.SELECTED && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{ opacity: 0.8, scale: 1 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div className="bg-green-600/20 border-4 border-green-500/60 rounded-full p-8 backdrop-blur-sm">
                    <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-2xl shadow-green-500/40">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentPhoto?.preSelectStatus === PreSelectStatus.EXCLUDE && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{ opacity: 0.8, scale: 1 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div className="bg-red-600/20 border-4 border-red-500/60 rounded-full p-8 backdrop-blur-sm">
                    <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-2xl shadow-red-500/40">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </Content>

      {/* 全屏模式下的浮动操作提示 */}
      {isFullscreen && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/60 backdrop-blur-sm rounded-lg px-6 py-3"
        >
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-green-700/50 border border-green-600/50 rounded text-xs text-green-300 font-mono">Enter</kbd>
              <Text className="text-green-300 font-medium">要这张</Text>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-red-700/50 border border-red-600/50 rounded text-xs text-red-300 font-mono">Del</kbd>
              <Text className="text-red-300 font-medium">不要这张</Text>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-darkBlueGray-700 border border-darkBlueGray-600 rounded text-xs text-darkBlueGray-200 font-mono">F11</kbd>
              <Text className="text-darkBlueGray-300 font-medium">退出全屏</Text>
            </div>
          </div>
        </motion.div>
      )}

      {/* 缩略图栏 */}
      <ThumbnailBar
        photos={preSelectedPhotos}
        currentIndex={currentIndex}
        extra={item => (
          <>
            {
              item.preSelectStatus === PreSelectStatus.SELECTED && (
                <div className="flex justify-center items-center w-4 h-4 rounded-full bg-green-500">
                  <CheckOutlined className="text-xs text-white" />
                </div>
              )
            }
            {
              item.preSelectStatus === PreSelectStatus.EXCLUDE && (
                <div className="flex justify-center items-center w-4 h-4 rounded-full bg-red-500">
                  <CloseOutlined className="text-xs text-white" />
                </div>
              )
            }
          </>
        )}
        onClickThumbnail={(item, index) => {
          setCurrentIndex(index)
          setCurrentPhoto(item)
        }}
      />

      <PreSelectionConfirmModal
        open={preSelectConfirmModalOpen}
        onConfirm={() => handlePreSelectConfirm()}
        onCancel={() => setPreSelectConfirmModalOpen(false)}
      />
    </Layout>
  )
}

export default PreSelect
