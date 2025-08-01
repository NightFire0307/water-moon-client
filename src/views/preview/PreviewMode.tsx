import { Button, Layout, Modal } from 'antd'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { StepHeader } from '@/components/StepHeader/StepHeader'

const { Content, Header } = Layout

// 假数据
const photos = [
  { id: 101, url: '/public/vite.svg', name: '照片1', selectedProducts: [1, 2] },
  { id: 102, url: '/public/vite.svg', name: '照片2', selectedProducts: [2] },
  { id: 103, url: '/public/vite.svg', name: '照片3', selectedProducts: [1, 3] },
  { id: 104, url: '/public/vite.svg', name: '照片4', selectedProducts: [3] },
  { id: 105, url: '/public/vite.svg', name: '照片5', selectedProducts: [1] },
  { id: 106, url: '/public/vite.svg', name: '照片6', selectedProducts: [2, 3] },
]

const products = [
  { id: 1, name: '相册A', type: '相册产品' },
  { id: 2, name: '摆台B', type: '摆台产品' },
  { id: 3, name: '挂画C', type: '挂画产品' },
]

export default function PreviewMode() {
  const [expandedProducts, setExpandedProducts] = useState<Set<number>>(new Set([1, 2, 3]))
  const [showSubmitModal, setShowSubmitModal] = useState(false)

  const toggleProductExpansion = (productId: number) => {
    const newExpanded = new Set(expandedProducts)
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId)
    }
    else {
      newExpanded.add(productId)
    }
    setExpandedProducts(newExpanded)
  }

  const handleSubmit = () => {
    setShowSubmitModal(false)
    // 这里可以添加提交逻辑
    // 提交选片结果到服务器
  }

  return (
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
              onClick={() => setShowSubmitModal(true)}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 border-blue-500 text-white hover:from-blue-700 hover:to-cyan-700 hover:border-blue-600 font-medium"
            >
              最终提交
            </Button>
          </motion.div>
        </motion.div>
      </Header>

      {/* 主内容区域 */}
      <Content className="relative overflow-hidden bg-darkBlueGray-900">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="h-full p-8 overflow-y-auto"
        >
          {/* 产品分组展示 */}
          <div className="space-y-8">
            {products.map((product, productIndex) => {
              const productPhotos = photos.filter(photo =>
                photo.selectedProducts.includes(product.id),
              )
              const isExpanded = expandedProducts.has(product.id)

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: productIndex * 0.1, duration: 0.5 }}
                  className="bg-gradient-to-br from-darkBlueGray-800/40 to-darkBlueGray-900/40 backdrop-blur-sm rounded-2xl border border-darkBlueGray-700/50 overflow-hidden"
                >
                  {/* 产品标题栏 */}
                  <div
                    className="cursor-pointer"
                    onClick={() => toggleProductExpansion(product.id)}
                  >
                    <div className="p-6 bg-darkBlueGray-800/30 border-b border-darkBlueGray-700/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-darkBlueGray-600 to-darkBlueGray-700 flex items-center justify-center shadow-lg border border-darkBlueGray-500/50">
                            <span className="text-white font-bold text-lg">{productIndex + 1}</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">{product.name}</h3>
                            <div className="flex items-center gap-3">
                              <span className="text-darkBlueGray-300 text-sm">{product.type}</span>
                              <div className="w-1 h-1 bg-darkBlueGray-500 rounded-full"></div>
                              <span className="text-darkBlueGray-300 text-sm">
                                {productPhotos.length}
                                {' '}
                                张照片
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {/* 照片数量徽章 */}
                          <div className="px-4 py-2 rounded-lg bg-blue-600/20 border border-blue-500/30">
                            <span className="text-blue-200 font-semibold">
                              {productPhotos.length}
                              {' '}
                              张
                            </span>
                          </div>

                          {/* 展开/收起箭头 */}
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-8 h-8 rounded-lg bg-darkBlueGray-700/50 flex items-center justify-center"
                          >
                            <svg className="w-4 h-4 text-darkBlueGray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 照片网格 */}
                  <motion.div
                    initial={false}
                    animate={{
                      height: isExpanded ? 'auto' : 0,
                      opacity: isExpanded ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="p-6">
                      {productPhotos.length === 0
                        ? (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="flex flex-col items-center justify-center py-12"
                            >
                              <div className="w-16 h-16 rounded-full bg-darkBlueGray-800/50 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-darkBlueGray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <div className="text-darkBlueGray-400 text-lg font-medium">暂无分配照片</div>
                              <div className="text-darkBlueGray-500 text-sm mt-1">该产品尚未分配照片</div>
                            </motion.div>
                          )
                        : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
                              {productPhotos.map((photo, photoIndex) => (
                                <motion.div
                                  key={photo.id}
                                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  transition={{
                                    delay: photoIndex * 0.05,
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

                                      {/* 多产品共享标记 */}
                                      {photo.selectedProducts.length > 1 && (
                                        <div className="absolute top-2 left-2">
                                          <div className="group/tooltip relative">
                                            <div className="flex items-center gap-1 bg-blue-600/90 backdrop-blur-sm px-2 py-1 rounded-md border border-blue-500/50 hover:bg-blue-500/90 transition-colors duration-200 cursor-help">
                                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                              </svg>
                                              <span className="text-xs text-white font-semibold">
                                                {photo.selectedProducts.length}
                                                个产品
                                              </span>
                                            </div>

                                            {/* 悬浮提示框 */}
                                            <div className="absolute top-full left-0 mt-2 w-48 bg-darkBlueGray-800/95 backdrop-blur-sm border border-darkBlueGray-600/50 rounded-lg p-3 shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 z-20">
                                              <div className="text-xs text-darkBlueGray-200 font-medium mb-2">该照片已分配到：</div>
                                              <div className="space-y-1">
                                                {photo.selectedProducts.map((productId) => {
                                                  const productInfo = products.find(p => p.id === productId)
                                                  return productInfo
                                                    ? (
                                                        <div key={productId} className="flex items-center gap-2 text-xs">
                                                          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                                          <span className="text-darkBlueGray-300">{productInfo.name}</span>
                                                          <span className="text-darkBlueGray-400">
                                                            (
                                                            {productInfo.type}
                                                            )
                                                          </span>
                                                        </div>
                                                      )
                                                    : null
                                                })}
                                              </div>
                                              {/* 小箭头 */}
                                              <div className="absolute -top-1 left-3 w-2 h-2 bg-darkBlueGray-800 border-l border-t border-darkBlueGray-600/50 transform rotate-45"></div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* 信息区域 - 简化显示 */}
                                    <div className="p-3">
                                      <div className="text-slate-100 font-medium text-xs truncate">
                                        {photo.name}
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          )}
                    </div>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </Content>

      {/* 最终提交确认弹窗 */}
      <Modal
        title={(
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full"></div>
            <span className="text-white font-bold">确认最终提交</span>
          </div>
        )}
        open={showSubmitModal}
        onCancel={() => setShowSubmitModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowSubmitModal(false)}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmit}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 border-blue-500 hover:from-blue-700 hover:to-cyan-700 hover:border-blue-600"
          >
            确认提交
          </Button>,
        ]}
        className="submit-modal"
        centered
      >
        <div className="py-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">即将提交选片结果</h3>
            <p className="text-darkBlueGray-300 text-sm">
              您即将提交最终的选片结果，提交后将无法修改
            </p>
          </div>

          <div className="bg-darkBlueGray-800/50 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-darkBlueGray-400">总照片数：</span>
                <span className="text-white font-medium">
                  {photos.length}
                  {' '}
                  张
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-darkBlueGray-400">产品数量：</span>
                <span className="text-white font-medium">
                  {products.length}
                  {' '}
                  个
                </span>
              </div>
              <div className="flex justify-between col-span-2">
                <span className="text-darkBlueGray-400">共享照片：</span>
                <span className="text-white font-medium">
                  {photos.filter(photo => photo.selectedProducts.length > 1).length}
                  {' '}
                  张
                </span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-darkBlueGray-400">
              请确认所有选片结果无误后再提交
            </p>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}
