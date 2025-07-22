import type { FC } from 'react'
import { usePhotoViewerContext } from '@/contexts/PhotoViewerContext'
import { useProductsStore } from '@/stores/useProductsStore'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import SimpleBar from 'simplebar-react'
import { ProductCard } from './ProductCard'
import 'simplebar-react/dist/simplebar.min.css'

const ProductSidebar: FC = () => {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(0) // 默认选中"所有照片"
  const { productSidebarVisible, setProductSidebarVisible } = usePhotoViewerContext()
  const products = useProductsStore(state => state.products)

  // "所有照片"固定选项
  const allPhotosOption = {
    productId: 0,
    name: '所有照片',
    type: '全部类型',
    selectedCount: 25, // 所有产品的总和
    limitCount: 43, // 所有产品限制的总和
    allowOverLimit: true,
    remark: '',
  }

  // 模拟产品数据
  // const mockProducts = [
  //   {
  //     productId: 1,
  //     name: '6寸照片',
  //     type: '标准尺寸',
  //     selectedCount: 5,
  //     limitCount: 10,
  //     allowOverLimit: false,
  //     remark: '适合家庭聚会，朋友合影等场景使用',
  //   },
  //   {
  //     productId: 2,
  //     name: '5寸照片',
  //     type: '经典尺寸',
  //     selectedCount: 8,
  //     limitCount: 8,
  //     allowOverLimit: true,
  //     remark: '经典尺寸，适合各种场合，支持超张制作',
  //   },
  //   {
  //     productId: 3,
  //     name: '7寸照片',
  //     type: '大尺寸',
  //     selectedCount: 12,
  //     limitCount: 10,
  //     allowOverLimit: true,
  //     remark: '大尺寸照片，适合重要场合纪念',
  //   },
  //   {
  //     productId: 4,
  //     name: '4寸照片',
  //     type: '迷你尺寸',
  //     selectedCount: 0,
  //     limitCount: 15,
  //     allowOverLimit: false,
  //     remark: '小巧精致，适合制作相册或礼品',
  //   },
  // ]

  const handleProductClick = (productId: number) => {
    // 设置选中状态
    setSelectedProductId(productId)

    // TODO: 实现产品选择逻辑
    // eslint-disable-next-line no-console
    console.log('点击产品:', productId)
  }

  return (
    <div
      className="absolute top-0 left-0 bottom-0 w-4 z-20"
      onMouseEnter={() => setProductSidebarVisible(true)}
      onMouseLeave={() => setProductSidebarVisible(false)}
    >
      <AnimatePresence>
        {
          productSidebarVisible
          && (
            <motion.div
              key="product-sidebar"
              initial={{ translateX: '-100%' }}
              animate={{ translateX: '0' }}
              exit={{ translateX: '-100%' }}
              className="absolute top-0 left-0 bottom-0 w-80 p-2 bg-darkBlueGray-800/70 backdrop-blur-md -translate-x-full"
            >
              <div className="text-white text-2xl font-bold mx-4 my-4">产品列表</div>

              <div className="h-full overflow-hidden">
                <SimpleBar style={{ height: 'calc(100vh - 120px)' }}>
                  <div className="p-4">
                    {/* 所有照片选项 - 固定在第一位 */}
                    <ProductCard
                      key={allPhotosOption.productId}
                      productId={allPhotosOption.productId}
                      name={allPhotosOption.name}
                      type={allPhotosOption.type}
                      selectedCount={allPhotosOption.selectedCount}
                      limitCount={allPhotosOption.limitCount}
                      allowOverLimit={allPhotosOption.allowOverLimit}
                      remark={allPhotosOption.remark}
                      isSelected={selectedProductId === allPhotosOption.productId}
                      onClick={handleProductClick}
                    />

                    {/* 分隔线 */}
                    <div className="mx-2 mb-4 border-t border-darkBlueGray-600/50"></div>

                    {/* 其他产品选项 */}
                    {products.map(product => (
                      <ProductCard
                        key={product.productId}
                        productId={product.productId}
                        name={product.name}
                        type={product.productType}
                        selectedCount={product.selectedPhotoIds.length}
                        limitCount={product.photoLimit}
                        allowOverLimit={product.allowOverLimit}
                        remark={product.remark}
                        isSelected={selectedProductId === product.productId}
                        onClick={handleProductClick}
                      />
                    ))}
                  </div>
                </SimpleBar>
              </div>
            </motion.div>
          )
        }
      </AnimatePresence>
    </div>

  )
}

export default ProductSidebar
