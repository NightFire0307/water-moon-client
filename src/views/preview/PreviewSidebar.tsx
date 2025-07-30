import { Button } from 'antd'
import { motion } from 'framer-motion'

// 假数据
const products = [
  { id: 1, name: '相册A' },
  { id: 2, name: '摆台B' },
  { id: 3, name: '挂画C' },
]

export default function PreviewSidebar({ selectedProductId, setSelectedProductId }: {
  selectedProductId: number | null
  setSelectedProductId: (id: number | null) => void
}) {
  const buttonVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    hover: { scale: 1.02, x: 4 },
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 h-full border-r border-darkBlueGray-700/30"
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
          <h3 className="text-lg font-bold text-white">产品筛选</h3>
        </div>
        <p className="text-darkBlueGray-400 text-sm">选择产品查看对应照片</p>
      </motion.div>

      {/* 筛选按钮组 */}
      <div className="space-y-3">
        {/* 全部照片按钮 */}
        <motion.div
          variants={buttonVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          transition={{ duration: 0.2 }}
        >
          <Button
            type={selectedProductId === null ? 'primary' : 'default'}
            size="large"
            className={`w-full !h-auto !p-4 !text-left border-0 rounded-xl transition-all duration-300 ${
              selectedProductId === null
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25'
                : 'bg-darkBlueGray-800/60 hover:bg-darkBlueGray-700/80 text-darkBlueGray-200 border border-darkBlueGray-600/30'
            }`}
            onClick={() => setSelectedProductId(null)}
          >
            <div className="w-full">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  selectedProductId === null
                    ? 'bg-white/20'
                    : 'bg-darkBlueGray-600/50'
                }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">所有照片</div>
                  <div className={`text-xs mt-1 ${
                    selectedProductId === null
                      ? 'text-blue-100'
                      : 'text-darkBlueGray-400'
                  }`}
                  >
                    查看全部分配结果
                  </div>
                </div>
              </div>
            </div>
          </Button>
        </motion.div>

        {/* 分隔线 */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-darkBlueGray-600 to-transparent"></div>
          <span className="text-xs text-darkBlueGray-500 px-2">产品分组</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-darkBlueGray-600 to-transparent"></div>
        </div>

        {/* 产品按钮列表 */}
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            transition={{ delay: index * 0.1, duration: 0.2 }}
          >
            <Button
              type={selectedProductId === product.id ? 'primary' : 'default'}
              size="large"
              className={`w-full !h-auto !p-4 !text-left border-0 rounded-xl transition-all duration-300 ${
                selectedProductId === product.id
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-darkBlueGray-800/60 hover:bg-darkBlueGray-700/80 text-darkBlueGray-200 border border-darkBlueGray-600/30'
              }`}
              onClick={() => setSelectedProductId(product.id)}
            >
              <div className="w-full">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    selectedProductId === product.id
                      ? 'bg-white/20'
                      : 'bg-darkBlueGray-600/50'
                  }`}
                  >
                    <div className={`w-6 h-6 rounded-md ${
                      selectedProductId === product.id
                        ? 'bg-white/30'
                        : 'bg-darkBlueGray-500'
                    } flex items-center justify-center`}
                    >
                      <span className="text-xs font-bold">{index + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{product.name}</div>
                    <div className={`text-xs mt-1 ${
                      selectedProductId === product.id
                        ? 'text-emerald-100'
                        : 'text-darkBlueGray-400'
                    }`}
                    >
                      产品专属照片
                    </div>
                  </div>

                  {/* 箭头指示器 */}
                  <div className={`transition-transform duration-200 ${
                    selectedProductId === product.id ? 'rotate-90' : ''
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
      </div>

      {/* 底部统计信息 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="mt-8 p-4 rounded-xl bg-gradient-to-br from-darkBlueGray-800/40 to-darkBlueGray-900/40 border border-darkBlueGray-700/30"
      >
        <div className="text-xs text-darkBlueGray-400 mb-2">统计信息</div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-darkBlueGray-300">总照片数</span>
            <span className="text-sm font-semibold text-white">4</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-darkBlueGray-300">已分配</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span className="text-sm font-semibold text-emerald-400">4</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
