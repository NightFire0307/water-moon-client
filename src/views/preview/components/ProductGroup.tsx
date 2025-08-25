import { PictureOutlined, ShareAltOutlined, UpOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useState } from 'react'
import SimpleBar from 'simplebar-react'

interface ProductItem {
  id: number
  name: string
  url: string
  selectedProducts: {
    productId: number
    name: string
    type: string
  }[]
}

interface ProductGroupProps {
  name: string // 产品组名称
  type: string // 产品组类型
  position: number // 产品组序号
  items: ProductItem[] // 产品组内的照片列表
}

function ProductGroup({ position, name, type, items }: ProductGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: position * 0.1, duration: 0.5 }}
      className="overflow-hidden rounded-2xl border border-darkBlueGray-700/50 bg-gradient-to-br from-darkBlueGray-800/40 to-darkBlueGray-900/40 backdrop-blur-sm"
    >
      {/* 产品标题栏 */}
      <div className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="border-b border-darkBlueGray-700/30 bg-darkBlueGray-800/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-darkBlueGray-500/50 bg-gradient-to-br from-darkBlueGray-600 to-darkBlueGray-700 shadow-lg">
                <span className="text-lg font-bold text-white">{position + 1}</span>
              </div>
              <div>
                <h3 className="mb-1 text-xl font-bold text-white">{name}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-darkBlueGray-300">{type}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* 照片数量徽章 */}
              <div className="rounded-lg border border-blue-500/30 bg-blue-600/20 px-4 py-2">
                <span className="font-semibold text-blue-200">
                  {items.length}
                  {' '}
                  张
                </span>
              </div>

              {/* 展开/收起箭头 */}
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-darkBlueGray-700/50">
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <UpOutlined />
                </motion.div>
              </div>
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
        <div className="p-4">
          {
            // eslint-disable-next-line style/multiline-ternary
            items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-darkBlueGray-800/50">
                  <PictureOutlined className="text-darkBlueGray-400 text-2xl" />
                </div>
                <div className="text-lg font-medium text-darkBlueGray-400">该产品尚未分配照片</div>
              </motion.div>
            ) : (
              <SimpleBar className="h-[300px]">
                <div className="grid grid-cols-[repeat(auto-fill,_minmax(_auto,256px))] gap-4">
                  {items.map((photo, photoIndex) => (
                    <motion.div
                      key={photo.id}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        delay: photoIndex * 0.05,
                        duration: 0.4,
                        ease: 'easeOut',
                      }}

                    >
                      <div className="max-w-full overflow-hidden rounded-xl border border-darkBlueGray-700/50 bg-gradient-to-br from-darkBlueGray-600/90 via-darkBlueGray-800/95 to-darkBlueGray-900/90 shadow-lg transition-all duration-300 hover:border-darkBlueGray-600/70 hover:shadow-2xl">
                        {/* 图片容器 */}
                        <div className="relative aspect-square overflow-hidden flex items-center justify-center">
                          <img
                            src={photo.url}
                            alt={photo.name}
                            className="max-h-full max-w-full object-container transition-transform duration-300 group-hover:scale-110 mx-auto"
                          />
                          {/* 悬浮遮罩 */}
                          <div className="absolute inset-0 bg-gradient-to-t from-darkBlueGray-900/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                          {/* 多产品共享标记 */}
                          {photo.selectedProducts.length > 1 && (
                            <div className="absolute left-2 top-2">
                              <div className="group/tooltip relative">
                                <div className="flex cursor-help items-center gap-1 rounded-md border border-blue-500/50 bg-blue-600/90 px-2 py-1 backdrop-blur-sm transition-colors duration-200 hover:bg-blue-500/90">
                                  <ShareAltOutlined />
                                  <span className="text-xs font-semibold text-white">
                                    {photo.selectedProducts.length}
                                    个产品
                                  </span>
                                </div>

                                {/* 悬浮提示框 */}
                                <div className="invisible absolute right-0 left-0 mt-2 w-40 z-50 rounded-lg border border-darkBlueGray-600/50 bg-darkBlueGray-800/95 p-3 opacity-0 shadow-xl backdrop-blur-sm transition-all duration-200 group-hover/tooltip:visible group-hover/tooltip:opacity-100">
                                  <div className="mb-2 text-xs font-medium text-darkBlueGray-200">
                                    该照片已分配到：
                                  </div>
                                  <div className="space-y-1">
                                    {photo.selectedProducts.map(selectedProduct => (
                                      <div key={selectedProduct.productId} className="flex items-center gap-2 text-xs">
                                        <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                                        <span className="text-darkBlueGray-300">{selectedProduct.name}</span>
                                        <span className="text-darkBlueGray-400">
                                          {selectedProduct.type}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                  {/* 小箭头 */}
                                  <div className="absolute -top-1 left-3 h-2 w-2 rotate-45 transform border-l border-t border-darkBlueGray-600/50 bg-darkBlueGray-800" />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 信息区域 - 简化显示 */}
                        <div className="p-3">
                          <div className="truncate text-xs font-medium text-slate-100">{photo.name}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </SimpleBar>
            )
          }
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProductGroup
