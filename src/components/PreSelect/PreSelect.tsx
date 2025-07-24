import type { FC } from 'react'
import { HeartOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Layout, Progress, Typography } from 'antd'
import { motion } from 'framer-motion'
import { useState } from 'react'

const { Content } = Layout
const { Text, Title } = Typography

interface PreSelectProps {
  // 这里可以添加需要的props
}

export const PreSelect: FC<PreSelectProps> = () => {
  const [isProgressHovered, setIsProgressHovered] = useState(false)

  return (
    <Layout className="h-screen relative bg-gradient-to-br from-darkBlueGray-950 via-darkBlueGray-900 to-darkBlueGray-950 overflow-hidden">
      {/* 顶部标题栏 */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="absolute top-0 left-0 right-0 z-30 bg-darkBlueGray-900/70 backdrop-blur-md border-b border-darkBlueGray-700/30"
      >
        <div
          className="flex items-center justify-between px-8 py-4 cursor-pointer"
          onMouseEnter={() => setIsProgressHovered(true)}
          onMouseLeave={() => setIsProgressHovered(false)}
        >
          <div className="flex items-center gap-3">
            <HeartOutlined className="text-blue-400 text-xl" />
            <Title level={4} className="text-white">
              预选照片
            </Title>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Text className="text-darkBlueGray-300">
              当前：
              <span className="text-blue-400 font-semibold mx-1">3</span>
              /
              <span className="text-white font-semibold mx-1">120</span>
            </Text>
            <motion.div className="relative">
              <div className="w-32">
                <Progress
                  percent={25}
                  size="small"
                  strokeColor="#3b82f6"
                  trailColor="#334155"
                  showInfo={false}
                />
              </div>

              {/* 筛选统计悬浮窗 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: isProgressHovered ? 1 : 0,
                  scale: isProgressHovered ? 1 : 0.8,
                  y: isProgressHovered ? 0 : 10,
                }}
                transition={{
                  duration: 0.3,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="absolute top-8 right-0 z-50 pointer-events-none"
                style={{ display: isProgressHovered ? 'block' : 'none' }}
              >
                <div className="bg-darkBlueGray-800/95 backdrop-blur-lg rounded-xl border border-darkBlueGray-700/50 shadow-2xl p-4 min-w-[240px]">
                  <div className="text-center pb-3 border-b border-darkBlueGray-700/30">
                    <Text className="text-darkBlueGray-300 text-xs font-medium tracking-wide uppercase">
                      筛选统计
                    </Text>
                  </div>

                  <div className="space-y-3 mt-3">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                      className="flex items-center justify-between gap-6"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/30"></div>
                        <Text className="text-darkBlueGray-300 text-sm font-medium">已选择</Text>
                      </div>
                      <div className="px-3 py-1 bg-green-600/20 border border-green-600/30 rounded-lg">
                        <Text className="text-green-400 font-bold text-sm">68</Text>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: 0.15 }}
                      className="flex items-center justify-between gap-6"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/30"></div>
                        <Text className="text-darkBlueGray-300 text-sm font-medium">已排除</Text>
                      </div>
                      <div className="px-3 py-1 bg-red-600/20 border border-red-600/30 rounded-lg">
                        <Text className="text-red-400 font-bold text-sm">15</Text>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: 0.2 }}
                      className="flex items-center justify-between gap-6"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/30"></div>
                        <Text className="text-darkBlueGray-300 text-sm font-medium">待处理</Text>
                      </div>
                      <div className="px-3 py-1 bg-blue-600/20 border border-blue-600/30 rounded-lg">
                        <Text className="text-blue-400 font-bold text-sm">37</Text>
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.25 }}
                    className="pt-3 mt-3 border-t border-darkBlueGray-700/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Text className="text-darkBlueGray-400 text-xs">总进度</Text>
                      <Text className="text-white text-xs font-semibold">69%</Text>
                    </div>
                    <div className="w-full bg-darkBlueGray-700 rounded-full h-2 relative overflow-hidden">
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: '69%' }}
                        transition={{
                          duration: 0.8,
                          delay: 0.3,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                        className="absolute top-0 left-0 bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full shadow-sm"
                      />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* 主视图区域 */}
      <Content className="relative flex-1 pt-20 pb-16">
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
                <Text className="text-darkBlueGray-400 text-lg">照片预览区域</Text>
              </div>

              {/* 照片信息覆盖层 */}
              <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                <Text className="text-white text-xs">IMG_2024_001.jpg</Text>
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
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="absolute bottom-0 left-0 right-0 bg-darkBlueGray-900/80 backdrop-blur-md border-t border-darkBlueGray-700/30"
      >
        <div className="flex items-center justify-center gap-8 px-6 py-4">
          <div className="flex items-center gap-2">
            <kbd className="px-3 py-1 bg-darkBlueGray-700 border border-darkBlueGray-600 rounded-md text-xs text-darkBlueGray-200 font-mono">←</kbd>
            <kbd className="px-3 py-1 bg-darkBlueGray-700 border border-darkBlueGray-600 rounded-md text-xs text-darkBlueGray-200 font-mono">→</kbd>
            <Text className="text-darkBlueGray-300 text-sm font-medium">切换照片</Text>
          </div>

          <div className="w-px h-5 bg-darkBlueGray-600"></div>

          <div className="flex items-center gap-2">
            <kbd className="px-3 py-1 bg-green-700/50 border border-green-600/50 rounded-md text-xs text-green-300 font-mono">Enter</kbd>
            <Text className="text-green-300 text-sm font-medium">要这张</Text>
          </div>

          <div className="flex items-center gap-2">
            <kbd className="px-3 py-1 bg-red-700/50 border border-red-600/50 rounded-md text-xs text-red-300 font-mono">Del</kbd>
            <Text className="text-red-300 text-sm font-medium">不要这张</Text>
          </div>

        </div>
      </motion.div>
    </Layout>
  )
}

export default PreSelect
