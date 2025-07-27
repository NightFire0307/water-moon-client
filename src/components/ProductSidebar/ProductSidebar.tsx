import type { FC } from 'react'
import { usePhotoViewerContext } from '@/contexts/PhotoViewerContext'
import { FILTER_TYPE, usePhotosStore } from '@/stores/usePhotosStore'
import { useProductsStore } from '@/stores/useProductsStore'
import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import SimpleBar from 'simplebar-react'
import { FixedOptionCard } from './FixedOptionCard'
import { ProductCard } from './ProductCard'
import 'simplebar-react/dist/simplebar.min.css'

const ProductSidebar: FC = () => {
  const { productSidebarVisible, setProductSidebarVisible } = usePhotoViewerContext()
  const { filterPhoto, getPhotoState } = usePhotosStore()
  const { products } = useProductsStore()
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [activeFixedOption, setActiveFixedOption] = useState<number>(0)

  const { totalCount, selectCount, unselectedCount } = getPhotoState()

  // 固定选项数据 - 使用数字ID以匹配FixedOptionCard的接口
  const fixedOptions = useMemo(() => [
    {
      optionId: 0,
      name: '所有照片',
      iconType: 'all' as const,
      photoCount: totalCount,
      description: '查看所有照片',
      filterType: FILTER_TYPE.ALL,
    },
    {
      optionId: 1,
      name: '已选照片',
      iconType: 'selected' as const,
      photoCount: selectCount,
      description: '已添加到产品的照片',
      filterType: FILTER_TYPE.SELECTED,
    },
    {
      optionId: 2,
      name: '未选照片',
      iconType: 'unselected' as const,
      photoCount: unselectedCount,
      description: '尚未添加到产品的照片',
      filterType: FILTER_TYPE.UNSELECTED,
    },
  ], [totalCount, selectCount, unselectedCount])

  const handleFixedOptionClick = (optionId: number) => {
    const option = fixedOptions.find(opt => opt.optionId === optionId)
    console.log(option)
    if (option) {
      setActiveFixedOption(optionId)
      setSelectedProductId(null) // 取消产品选择
      filterPhoto({ productId: undefined, filterType: option.filterType })
    }
  }

  const handleProductClick = (productId: number) => {
    console.log(productId)
    setSelectedProductId(productId)
    setActiveFixedOption(-1) // 取消固定选项选择
    filterPhoto({ productId, filterType: FILTER_TYPE.SELECTED })
  }

  return (
    <div className="relative top-0 z-20">
      <motion.div
        key="product-sidebar"
        initial={{ translateX: '-100%' }}
        animate={{ translateX: '0' }}
        exit={{ translateX: '-100%' }}
        className="w-80 p-2 bg-darkBlueGray-900/70 border-r border-darkBlueGray-700/30 backdrop-blur-md -translate-x-full"
      >
        <div className="text-white text-2xl font-bold mx-4 my-4">产品列表</div>

        <div className="h-full overflow-hidden">
          <SimpleBar style={{ height: 'calc(100vh - 120px)' }}>
            <div className="p-4">
              {/* 固定选项 */}
              {fixedOptions.map(option => (
                <FixedOptionCard
                  key={option.optionId}
                  optionId={option.optionId}
                  name={option.name}
                  iconType={option.iconType}
                  photoCount={option.photoCount}
                  description={option.description}
                  isSelected={activeFixedOption === option.optionId}
                  onClick={handleFixedOptionClick}
                />
              ))}

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
    </div>

  )
}

export default ProductSidebar
