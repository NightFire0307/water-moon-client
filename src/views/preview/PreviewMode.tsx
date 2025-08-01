import { StepHeader } from '@/components/StepHeader/StepHeader'
import { usePhotosStore } from '@/stores/usePhotosStore'
import { useProductsStore } from '@/stores/useProductsStore'
import { LockOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Layout, message } from 'antd'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import SimpleBar from 'simplebar-react'
import ConfirmSelResModal from './components/ConfirmSelResModal'
import ProductGroup from './components/ProductGroup'

const { Content, Header } = Layout

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

  const handleSubmit = () => {
    setShowSubmitModal(false)
    // 这里可以添加提交逻辑
    // 提交选片结果到服务器
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
          <StepHeader stepNumber={4} stepTitle="选片结果预览" stepDesc="Selection Result Preview" />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Button
              type="primary"
              onClick={() => setShowSubmitModal(true)}
              className="bg-blue-500 hover:bg-blue-600 active:bg-blue-800 font-medium text-white"
            >
              下一步：提交选片结果
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
        onConfirm={() => {
          setShowSubmitModal(false)
          message.success('选片结果已提交成功！')
        }}
        onCancel={() => setShowSubmitModal(false)}
      />
    </Layout>
  )
}
