import { StepHeader } from '@/components/StepHeader/StepHeader'
import { Button, ConfigProvider, Layout } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { motion } from 'framer-motion'
import { useState } from 'react'
import PreviewSidebar from './PreviewSidebar'

const { Sider, Content, Header } = Layout

// 假数据
const photos = [
  { id: 101, url: '/public/vite.svg', name: '照片1', selectedProducts: [1, 2] },
  { id: 102, url: '/public/vite.svg', name: '照片2', selectedProducts: [2] },
  { id: 103, url: '/public/vite.svg', name: '照片3', selectedProducts: [1, 3] },
  { id: 104, url: '/public/vite.svg', name: '照片4', selectedProducts: [3] },
]

export default function PreviewMode() {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const filteredPhotos = selectedProductId === null
    ? photos
    : photos.filter(photo => photo.selectedProducts.includes(selectedProductId))

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorBgElevated: '#334155',
          colorText: '#f8fafc',
          colorTextDisabled: '#64748b',
          colorTextDescription: '#94a3b8',
          controlItemBgHover: '#475569',
          colorBgContainer: '#1e293b',
          colorBorder: '#475569',
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
      <Layout className="h-screen bg-gradient-to-br from-darkBlueGray-950 via-darkBlueGray-900 to-darkBlueGray-950">
        {/* 顶部标题栏 */}
        <Header className="bg-darkBlueGray-900/90 backdrop-blur-md border-b border-darkBlueGray-700/50 px-8 py-3">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between h-full"
          >
            <StepHeader stepNumber={4} stepTitle="选片结果预览" stepDesc="Selection Result Preview" />

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Button
                type="primary"
                disabled
                className="bg-emerald-600/20 border-emerald-500/50 text-emerald-200 cursor-not-allowed"
              >
                已提交
              </Button>
            </motion.div>
          </motion.div>
        </Header>

        <Layout>
          {/* 侧边栏 */}
          <Sider
            width={280}
            className="bg-darkBlueGray-900"
          >
            <PreviewSidebar
              selectedProductId={selectedProductId}
              setSelectedProductId={setSelectedProductId}
            />
          </Sider>

          {/* 主内容区域 */}
          <Content className="relative overflow-hidden bg-darkBlueGray-900">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="h-full p-8 overflow-y-auto"
            >
              {/* 页面标题 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="mb-8"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full"></div>
                  <h2 className="text-xl font-bold text-white">已分配照片</h2>
                </div>
                <p className="text-darkBlueGray-300 text-sm">
                  {selectedProductId === null
                    ? `共 ${filteredPhotos.length} 张照片`
                    : `筛选结果：${filteredPhotos.length} 张照片`}
                </p>
              </motion.div>

              {/* 照片网格 */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                {filteredPhotos.length === 0
                  ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="col-span-full flex flex-col items-center justify-center py-16"
                      >
                        <div className="w-20 h-20 rounded-full bg-darkBlueGray-800/50 flex items-center justify-center mb-4">
                          <svg className="w-8 h-8 text-darkBlueGray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="text-darkBlueGray-400 text-lg font-medium">该产品暂未分配照片</div>
                        <div className="text-darkBlueGray-500 text-sm mt-1">请选择其它产品查看</div>
                      </motion.div>
                    )
                  : (
                      filteredPhotos.map((photo, index) => (
                        <motion.div
                          key={photo.id}
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{
                            delay: index * 0.05,
                            duration: 0.4,
                            ease: 'easeOut',
                          }}
                          whileHover={{
                            scale: 1.05,
                            y: -5,
                            transition: { duration: 0.2 },
                          }}
                          className="group"
                        >
                          <div className="bg-gradient-to-br from-darkBlueGray-600/90 via-darkBlueGray-800/95 to-darkBlueGray-900/90 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-darkBlueGray-700/50 hover:border-darkBlueGray-600/70">
                            {/* 图片容器 */}
                            <div className="relative aspect-square overflow-hidden">
                              <img
                                src={photo.url}
                                alt={photo.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                              {/* 悬浮遮罩 */}
                              <div className="absolute inset-0 bg-gradient-to-t from-darkBlueGray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                              {/* ID标签 */}
                              <div className="absolute top-2 right-2 bg-darkBlueGray-900/90 backdrop-blur-sm px-2 py-1 rounded-md">
                                <span className="text-xs text-darkBlueGray-300 font-mono">
                                  #
                                  {photo.id}
                                </span>
                              </div>
                            </div>

                            {/* 信息区域 */}
                            <div className="p-4">
                              <div className="text-slate-100 font-medium text-sm mb-2 truncate">
                                {photo.name}
                              </div>

                              {/* 统计信息 */}
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-darkBlueGray-400">
                                  ID:
                                  {' '}
                                  {photo.id}
                                </span>
                                <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                  <span className="text-darkBlueGray-300">已分配</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
              </div>
            </motion.div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}
