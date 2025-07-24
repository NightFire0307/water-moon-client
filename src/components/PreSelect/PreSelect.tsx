import type { FC } from 'react'
import { usePhotosStore } from '@/stores/usePhotosStore'
import { usePhotoViewerStore } from '@/stores/usePhotoViewerStore'
import { FullscreenExitOutlined, FullscreenOutlined, HeartOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Layout, Progress, Typography } from 'antd'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { PreSelectStatsTooltip } from './PreSelectStatsTooltip'

const { Content } = Layout
const { Text } = Typography

interface PreSelectProps {
}

export const PreSelect: FC<PreSelectProps> = () => {
  const [isProgressHovered, setIsProgressHovered] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { photos, currentPhoto, fetchPhotos, togglePreSelected, getPreSelectedStats } = usePhotosStore()
  const { next, previous } = usePhotoViewerStore()

  const { selectedCount, excludedCount } = getPreSelectedStats()

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

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // 键盘快捷键
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      e.preventDefault()
      switch (e.key) {
        case 'F11':
          toggleFullscreen()
          break
        case 'ArrowLeft':
          previous()
          break
        case 'ArrowRight':
          next()
          break
        case ' ':
          togglePreSelected(true)
          next()
          break
        case 'Delete':
          togglePreSelected(false)
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  useEffect(() => {
    fetchPhotos()
  }, [])

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
          className="flex items-center justify-between px-8 py-4 cursor-pointer"
        >
          <div className="flex items-center gap-3 ">
            <HeartOutlined className="text-blue-400 text-xl" />
            <h2 className="text-white text-xl font-medium">
              预选照片
            </h2>
          </div>
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
              className="flex items-center gap-6 text-sm "
              onMouseEnter={() => setIsProgressHovered(true)}
              onMouseLeave={() => setIsProgressHovered(false)}
            >
              <Text className="text-darkBlueGray-300">
                当前：
                <span className="text-blue-400 font-semibold mx-1">{selectedCount + excludedCount}</span>
                /
                <span className="text-white font-semibold mx-1">{ photos.length}</span>
              </Text>
              <motion.div className="relative">

                {/* 筛选统计悬浮窗 */}
                <PreSelectStatsTooltip isProgressHovered={isProgressHovered} />

              </motion.div>
            </div>
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
            <span className="text-white font-semibold">{photos.length}</span>
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
      <Content className={`relative flex-1 ${isFullscreen ? 'pt-0 pb-0' : 'pt-20 pb-16'}`}>
        <div className="h-full flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: 10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative w-full h-full max-w-none max-h-none"
          >
            {/* 照片容器 */}
            <div className="relative bg-darkBlueGray-800 rounded-2xl shadow-2xl overflow-hidden border border-darkBlueGray-700/50 w-full h-full">
              <div className="w-full h-full bg-gradient-to-br from-darkBlueGray-700 to-darkBlueGray-800 flex items-center justify-center">
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
            </div>

            {/* 左右导航按钮 - 更靠近照片 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute left-[-80px] top-1/2 transform -translate-y-1/2"
            >
              <Button
                type="text"
                size="large"
                icon={<LeftOutlined />}
                className="w-16 h-16 rounded-full bg-darkBlueGray-800/80 hover:bg-darkBlueGray-700 border border-darkBlueGray-600 text-white hover:text-blue-400 backdrop-blur-sm transition-all duration-300 hover:scale-110"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute right-[-80px] top-1/2 transform -translate-y-1/2"
            >
              <Button
                type="text"
                size="large"
                icon={<RightOutlined />}
                className="w-16 h-16 rounded-full bg-darkBlueGray-800/80 hover:bg-darkBlueGray-700 border border-darkBlueGray-600 text-white hover:text-blue-400 backdrop-blur-sm transition-all duration-300 hover:scale-110"
              />
            </motion.div>
          </motion.div>
        </div>
      </Content>

      {/* 底部快捷键提示栏 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{
          opacity: isFullscreen ? 0 : 1,
          y: isFullscreen ? 30 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-0 left-0 right-0 bg-darkBlueGray-900/80 backdrop-blur-md border-t border-darkBlueGray-700/30"
      >
        <div className="flex items-center justify-center gap-8 px-6 py-4">
          <div className="flex items-center gap-2">
            <kbd className="px-3 py-1 bg-darkBlueGray-700 border border-darkBlueGray-600 rounded-md text-xs text-darkBlueGray-200 font-mono">F11</kbd>
            <Text className="text-darkBlueGray-300 text-sm font-medium">全屏</Text>
          </div>

          <div className="w-px h-5 bg-darkBlueGray-600"></div>

          <div className="flex items-center gap-2">
            <kbd className="px-3 py-1 bg-darkBlueGray-700 border border-darkBlueGray-600 rounded-md text-xs text-darkBlueGray-200 font-mono">←</kbd>
            <kbd className="px-3 py-1 bg-darkBlueGray-700 border border-darkBlueGray-600 rounded-md text-xs text-darkBlueGray-200 font-mono">→</kbd>
            <Text className="text-darkBlueGray-300 text-sm font-medium">切换照片</Text>
          </div>

          <div className="w-px h-5 bg-darkBlueGray-600"></div>

          <div className="flex items-center gap-2">
            <kbd className="px-3 py-1 bg-green-700/50 border border-green-600/50 rounded-md text-xs text-green-300 font-mono">Space</kbd>
            <Text className="text-green-300 text-sm font-medium">要这张</Text>
          </div>

          <div className="flex items-center gap-2">
            <kbd className="px-3 py-1 bg-red-700/50 border border-red-600/50 rounded-md text-xs text-red-300 font-mono">Del</kbd>
            <Text className="text-red-300 text-sm font-medium">不要这张</Text>
          </div>

        </div>
      </motion.div>

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
    </Layout>
  )
}

export default PreSelect
