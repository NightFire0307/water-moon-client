import { updateOrderStatus } from '@/apis/order'
import ProgressDots from '@/components/ProgressDots/ProgressDots'
import { StepHeader } from '@/components/StepHeader/StepHeader'
import { useOrderStore } from '@/stores/useOrderStore'
import { usePhotosStore } from '@/stores/usePhotosStore'
import { useProductsStore } from '@/stores/useProductsStore'
import { OrderStatus } from '@/types/user/order'
import { CheckOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Layout } from 'antd'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import SimpleBar from 'simplebar-react'
import ConfirmSelResModal from './components/ConfirmSelResModal'
import ProductGroup from './components/ProductGroup'

const { Content, Header } = Layout

export default function PreviewMode() {
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const { products } = useProductsStore()
  const { getProductSelectedPhotos } = usePhotosStore()
  const { order, fetchOrder } = useOrderStore()
  const navigate = useNavigate()
  const productSelectedPhotos = getProductSelectedPhotos()

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
          url: photo.thumbnailUrl,
          remark: photo.remark,
          selectedProducts: photo.selectedProducts.map((productId) => {
            const productInfo = products.find(p => p.productId === productId)
            return {
              productId: productInfo?.productId || 0,
              name: productInfo?.name || '',
              type: productInfo?.productType || '',
            }
          }),
        })),
      }
    })
  }, [products, productSelectedPhotos])

  // 处理提交选片结果
  const handleConfirmSubmit = async () => {
    await updateOrderStatus(OrderStatus.SUBMITTED)
    await fetchOrder()
    setShowSubmitModal(false)
  }

  return (
    <Layout className="h-screen bg-gradient-to-br from-darkBlueGray-950 via-darkBlueGray-900 to-darkBlueGray-950">
      {/* 顶部标题栏 */}
      <Header className="border-b border-darkBlueGray-700/50 bg-darkBlueGray-900/90 px-4 py-3 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex h-full items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Button
              type="text"
              icon={<LeftOutlined />}
              size="large"
              onClick={() => navigate('/product-select')} // 返回产品选择页面
              disabled={order?.status === 'submitted'}
            />
            <StepHeader stepNumber={4} title="选片结果预览" subtitle="Selection Result Preview" />
          </div>

          {/* 中间的成功提示区域 */}
          <div
            className="flex-1 flex justify-center"
          >
            {order?.status === 'submitted' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="bg-darkBlueGray-800/60 backdrop-blur-sm text-darkBlueGray-100 px-4 py-2 rounded-lg border border-darkBlueGray-600/30"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-cyan-500/20 rounded-full flex items-center justify-center">
                    <CheckOutlined className="text-cyan-400 text-xs" />
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-white">选片结果已提交，当前为预览模式</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="flex gap-4"
          >
            <ProgressDots currentStep={4} totalSteps={4} />
            <Button
              type="primary"
              onClick={() => setShowSubmitModal(true)}
              disabled={order?.status === 'submitted'}
            >
              { order?.status === 'submitted' ? '已提交' : '下一步：提交选片结果' }
              <RightOutlined />
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
        >
          <SimpleBar style={{ maxHeight: 'calc(100vh - 64px)' }}>
            <div className="p-4 flex flex-col gap-4">
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
            </div>
          </SimpleBar>
        </motion.div>
      </Content>

      {/* 最终提交确认弹窗 */}
      <ConfirmSelResModal
        open={showSubmitModal}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowSubmitModal(false)}
      />

    </Layout>
  )
}
