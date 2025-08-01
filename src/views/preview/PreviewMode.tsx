import { Button, Layout, Modal } from 'antd'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { StepHeader } from '@/components/StepHeader/StepHeader'
import { usePhotosStore } from '@/stores/usePhotosStore'
import { useProductsStore } from '@/stores/useProductsStore'
import ProductGroup from './components/ProductGroup'

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

export default function PreviewMode() {
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const { products } = useProductsStore()
  const { productSelectedPhotos } = usePhotosStore()

  /**
   * 生成产品组数据
   */
  const productGroups = useMemo(() => {
    return products.map((product) => {
      const selectedPhotos = productSelectedPhotos.filter(photo => photo.selectedProducts.includes(product.productId))
      return {
        productId: product.productId,
        name: product.name,
        type: product.productType,
        items: selectedPhotos.map(photo => ({
          id: photo.photoId,
          name: photo.name,
          url: photo.thumbnail_url,
          selectedProducts: photo.selectedProducts.map(productId => {
            const productInfo = products.find(p => p.productId === productId)
            return {
              productId: productInfo?.productId || 0,
              name: productInfo?.name || '',
              type: productInfo?.productType || '',
            }
          })
        })),
      }
    })
  }, [products, productSelectedPhotos])

  const handleSubmit = () => {
    setShowSubmitModal(false)
    // 这里可以添加提交逻辑
    // 提交选片结果到服务器
  }

  return (
    <Layout className="h-screen bg-gradient-to-br from-darkBlueGray-950 via-darkBlueGray-900 to-darkBlueGray-950">
      {/* 顶部标题栏 */}
      <Header className="border-b border-darkBlueGray-700/50 bg-darkBlueGray-900/90 px-8 py-3 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex h-full items-center justify-between"
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
              className="border-blue-500 bg-gradient-to-r from-blue-600 to-cyan-600 font-medium text-white hover:border-blue-600 hover:from-blue-700 hover:to-cyan-700"
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
          className="h-full overflow-y-auto p-8 flex flex-col gap-8"
        >
          {
            productGroups.map((product, index) => (
              <ProductGroup
                key={product.productId}
                position={index}
                name={product.name}
                type={product.type}
                items={product.items}
              />
            ))
          }
        </motion.div>
      </Content>

      {/* 最终提交确认弹窗 */}
      <Modal
        title={(
          <div className="flex items-center gap-2">
            <div className="h-5 w-1 rounded-full bg-gradient-to-b from-blue-400 to-cyan-400"></div>
            <span className="font-bold text-white">确认最终提交</span>
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
            className="border-blue-500 bg-gradient-to-r from-blue-600 to-cyan-600 hover:border-blue-600 hover:from-blue-700 hover:to-cyan-700"
          >
            确认提交
          </Button>,
        ]}
        className="submit-modal"
        centered
      >
        <div className="py-6">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
              <svg className="h-8 w-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-bold text-white">即将提交选片结果</h3>
            <p className="text-sm text-darkBlueGray-300">您即将提交最终的选片结果，提交后将无法修改</p>
          </div>

          <div className="mb-4 rounded-lg bg-darkBlueGray-800/50 p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-darkBlueGray-400">总照片数：</span>
                <span className="font-medium text-white">
                  {photos.length}
                  {' '}
                  张
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-darkBlueGray-400">产品数量：</span>
                <span className="font-medium text-white">
                  {products.length}
                  {' '}
                  个
                </span>
              </div>
              <div className="col-span-2 flex justify-between">
                <span className="text-darkBlueGray-400">共享照片：</span>
                <span className="font-medium text-white">
                  {photos.filter(photo => photo.selectedProducts.length > 1).length}
                  {' '}
                  张
                </span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-darkBlueGray-400">请确认所有选片结果无误后再提交</p>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}
