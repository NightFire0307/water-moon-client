import { FILTER_TYPE, usePhotosStore } from '@/stores/usePhotosStore'
import { usePhotoViewerStore } from '@/stores/usePhotoViewerStore.ts'
import { useProductsStore } from '@/stores/useProductsStore'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { AnimatePresence, motion } from 'framer-motion'
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

interface ProductSidebarRef {
  photoFilterBarRef: HTMLDivElement | null
  productBarRef: HTMLDivElement | null
}

const ProductSidebar = forwardRef<ProductSidebarRef>((_, ref) => {
  const { setFilter, productSelectedPhotos } = usePhotosStore()
  const { products } = useProductsStore()
  const { setCurrentIndex } = usePhotoViewerStore()
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [activeFilterType, setActiveFilterType] = useState<FILTER_TYPE>(FILTER_TYPE.ALL)
  const photoFilterBarRef = useRef<HTMLDivElement>(null)
  const productBarRef = useRef<HTMLDivElement>(null)

  // 暴露 refs 给父组件
  useImperativeHandle(ref, () => ({
    photoFilterBarRef: photoFilterBarRef.current,
    productBarRef: productBarRef.current,
  }))

  // 统一的选中状态，用于判断当前选中的是固定选项还是产品
  const [selectedType, setSelectedType] = useState<'filter' | 'product'>('filter')

  // 固定选项数据
  const fixedOptions = useMemo(() => {
    const { selectedCount, unSelectedCount } = Array.from(productSelectedPhotos).reduce(
      (acc, [, photo]) => {
        if (photo.selectedProducts.length > 0) {
          acc.selectedCount += 1
        }
        else {
          acc.unSelectedCount += 1
        }
        return acc
      }
      , { selectedCount: 0, unSelectedCount: 0 },
    )

    return [
      {
        id: 'all',
        name: '所有照片',
        description: '查看所有照片',
        photoCount: productSelectedPhotos.size,
        filterType: FILTER_TYPE.ALL,
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        ),
      },
      {
        id: 'selected',
        name: '已选照片',
        description: '已添加到产品的照片',
        photoCount: selectedCount,
        filterType: FILTER_TYPE.SELECTED,
        icon: <CheckOutlined />,
      },
      {
        id: 'unselected',
        name: '未选照片',
        description: '尚未添加到产品的照片',
        photoCount: unSelectedCount,
        filterType: FILTER_TYPE.UNSELECTED,
        icon: <CloseOutlined />,
      },
    ]
  }, [productSelectedPhotos])

  // 固定选项点击处理函数
  const handleFixedOptionClick = (filterType: FILTER_TYPE) => {
    setActiveFilterType(filterType)
    setSelectedProductId(null)
    setSelectedType('filter')
    setFilter({ productId: undefined, filterType })
    setCurrentIndex(0) // 重置当前索引
  }

  // 产品点击处理函数
  const handleProductClick = (productId: number) => {
    setSelectedProductId(productId)
    setActiveFilterType(FILTER_TYPE.SELECTED)
    setSelectedType('product')
    setFilter({ productId, filterType: FILTER_TYPE.SELECTED })
    setCurrentIndex(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 h-full border-r border-darkBlueGray-700/30 flex flex-col"
    >
      {/* 标题区域 */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-5 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full"></div>
          <h3 className="text-lg font-bold text-white">产品选择</h3>
        </div>
        <p className="text-darkBlueGray-400 text-sm">为照片选择合适的产品</p>
      </motion.div>

      {/* 滚动内容区域 */}
      <div className="flex-1 overflow-hidden">
        <SimpleBar style={{ height: '100%' }}>
          <div className="space-y-3">
            {/* 筛选按钮组 */}
            <div ref={photoFilterBarRef} className="flex flex-col gap-3">
              {fixedOptions.map((option, index) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.2 }}
                >
                  <Button
                    type={activeFilterType === option.filterType && selectedType === 'filter' ? 'primary' : 'default'}
                    size="large"
                    className={`w-full !h-auto !p-0 !text-left !border-0 rounded-xl transition-all duration-300 overflow-hidden ${
                      activeFilterType === option.filterType && selectedType === 'filter'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-darkBlueGray-800/60 hover:bg-darkBlueGray-700/80 text-darkBlueGray-200 hover:border-darkBlueGray-600/50'
                    }`}
                    onClick={() => handleFixedOptionClick(option.filterType)}
                  >
                    <div className="w-full p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            activeFilterType === option.filterType && selectedType === 'filter'
                              ? 'bg-white/20'
                              : 'bg-darkBlueGray-600/50'
                          }`}
                        >
                          {option.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm truncate">{option.name}</div>
                          <div
                            className={`text-xs mt-1 truncate ${
                              activeFilterType === option.filterType && selectedType === 'filter'
                                ? 'text-blue-100'
                                : 'text-darkBlueGray-400'
                            }`}
                          >
                            {option.description}
                          </div>
                        </div>
                        <div
                          className={`px-2 py-1 rounded-lg text-xs font-bold min-w-[2rem] text-center ml-2 ${
                            activeFilterType === option.filterType && selectedType === 'filter'
                              ? 'bg-white/20 text-white'
                              : 'bg-darkBlueGray-600/50 text-darkBlueGray-300'
                          }`}
                        >
                          {option.photoCount}
                        </div>
                      </div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* 分隔线 */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-darkBlueGray-600 to-transparent"></div>
              <span className="text-xs text-darkBlueGray-500 px-2">产品分组</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-darkBlueGray-600 to-transparent"></div>
            </div>

            {/* 产品按钮列表 */}
            <div ref={productBarRef} className="flex flex-col gap-3">
              <AnimatePresence mode="popLayout">
                {products.map((product, index) => (
                  <motion.div
                    key={product.productId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: (fixedOptions.length + index) * 0.1, duration: 0.2 }}
                  >
                    <Button
                      type={selectedProductId === product.productId && selectedType === 'product' ? 'primary' : 'default'}
                      size="large"
                      className={`w-full !h-auto !p-0 !text-left !border-0 rounded-xl transition-all duration-300 overflow-hidden ${
                        selectedProductId === product.productId && selectedType === 'product'
                          ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25'
                          : 'bg-darkBlueGray-800/60 hover:bg-darkBlueGray-700/80 text-darkBlueGray-200 hover:border-darkBlueGray-600/50'
                      }`}
                      onClick={() => handleProductClick(product.productId)}
                    >
                      <div className="w-full p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              selectedProductId === product.productId && selectedType === 'product'
                                ? 'bg-white/20'
                                : 'bg-darkBlueGray-600/50'
                            }`}
                          >
                            <div
                              className={`w-6 h-6 rounded-md ${
                                selectedProductId === product.productId && selectedType === 'product'
                                  ? 'bg-white/30'
                                  : 'bg-darkBlueGray-500'
                              } flex items-center justify-center`}
                            >
                              <span className="text-xs font-bold">{index + 1}</span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm truncate">{product.name}</div>
                            <div
                              className={`text-xs mt-1 truncate ${
                                selectedProductId === product.productId && selectedType === 'product'
                                  ? 'text-blue-100'
                                  : 'text-darkBlueGray-400'
                              }`}
                            >
                              <span>{product.productType}</span>
                              <span className="mx-1">•</span>
                              <span>{product.selectedPhotoIds.length}</span>
                              <span>/</span>
                              <span>{product.photoLimit === 0 ? '∞' : product.photoLimit}</span>
                            </div>
                          </div>

                          {/* 状态指示器 */}
                          <div className="flex items-center gap-3 ml-2">
                            {/* 简洁圆点样式 */}
                            <div className="flex items-center gap-2">
                              {/* 状态圆点 */}
                              {product.selectedPhotoIds.length > 0 && (
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    product.selectedPhotoIds.length >= product.photoLimit && product.photoLimit > 0
                                      ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                                      : 'bg-blue-400 animate-pulse shadow-sm shadow-blue-400/50'
                                  }`}
                                />
                              )}

                              {/* 照片数量 */}
                              <div
                                className={`px-2 py-0.5 rounded-full text-xs font-medium min-w-[1.5rem] text-center ${
                                  selectedProductId === product.productId && selectedType === 'product'
                                    ? 'bg-white/15 text-white'
                                    : 'bg-darkBlueGray-600/40 text-darkBlueGray-300'
                                }`}
                              >
                                {product.selectedPhotoIds.length}
                              </div>
                            </div>
                          </div>

                          {/* 箭头指示器 */}
                          <div
                            className={`transition-transform duration-200 ml-2 ${
                              selectedProductId === product.productId && selectedType === 'product' ? 'rotate-90' : ''
                            }`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </SimpleBar>
      </div>
    </motion.div>
  )
})

export default ProductSidebar
