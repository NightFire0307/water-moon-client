import type { IOrder, IOrderProduct } from '@/types/order'
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  RightOutlined,
} from '@ant-design/icons'
import { Badge, ConfigProvider, Layout, Progress } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { motion } from 'framer-motion'
import { type FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { getOrderInfo } from '@/apis/order'
import { useFullScreenLoading } from '@/components/FullScreenLoading/useFullScreenLoading'
import { useProductsStore } from '@/stores/useProductsStore'

const { Content } = Layout

// 选片状态枚举
enum SelectionStatus {
  PENDING = 'pending', // 待开始
  PRE_SELECTING = 'pre_selecting', // 预选完成
  PRODUCT_SELECTING = 'product_selecting', // 产品选择完成
  SUBMITTED = 'submitted', // 已提交
}

const OrderInfoPage: FC = () => {
  const [orderInfo, setOrderInfo] = useState<IOrder | null>(null)
  const navigate = useNavigate()
  const { generateProducts } = useProductsStore()

  // 获取订单信息
  const fetchOrderInfo = async () => {
    const { data } = await getOrderInfo()
    setOrderInfo(data)
    generateProducts(data.order_products)
  }

  useEffect(() => {
    fetchOrderInfo()
  }, [])

  // 获取选片状态显示信息
  const getSelectionStatusInfo = (status: SelectionStatus) => {
    switch (status) {
      case SelectionStatus.PENDING:
        return { text: '待开始', color: 'orange', icon: <ClockCircleOutlined /> }
      case SelectionStatus.PRE_SELECTING:
        return { text: '预选完成', color: 'blue', icon: <CheckCircleOutlined /> }
      case SelectionStatus.PRODUCT_SELECTING:
        return { text: '产品选择完成', color: 'green', icon: <CheckCircleOutlined /> }
      case SelectionStatus.SUBMITTED:
        return { text: '已提交', color: 'green', icon: <CheckCircleOutlined /> }
      default:
        return { text: '未知状态', color: 'default', icon: <ExclamationCircleOutlined /> }
    }
  }

  // 获取产品选择状态
  const getProductSelectionStatus = (orderProduct: IOrderProduct) => {
    const requiredCount = orderProduct.product.photo_limit * orderProduct.count
    const selectedCount = orderProduct.selected_photos.length

    if (selectedCount === 0) {
      return { text: '未开始', color: 'oklch(70.5% 0.213 47.604)' }
    }
    else if (selectedCount < requiredCount) {
      return { text: `已选 ${selectedCount}/${requiredCount}`, color: 'processing' }
    }
    else {
      return { text: '已完成', color: 'oklch(72.3% 0.219 149.579)' }
    }
  }

  const statusInfo = getSelectionStatusInfo(SelectionStatus.PENDING)

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
      }}
    >
      <Layout className="min-h-screen bg-gradient-to-br from-darkBlueGray-950 via-darkBlueGray-900 to-darkBlueGray-950 flex flex-col text-base md:text-lg">
        {/* 顶部导航栏 - 与流程对应 */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-darkBlueGray-900/95 backdrop-blur-sm border-b border-darkBlueGray-700/50 h-16"
        >
          <div className="max-w-4xl mx-auto py-2">
            <div className="flex items-center justify-between">
              {/* 左侧 - 当前步骤信息 */}
              <div className="flex items-center space-x-4">
                {/* 步骤编号 */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg font-bold">1</span>
                </div>

                {/* 步骤信息 */}
                <div>
                  <h1 className="text-white text-lg font-bold my-0">信息确认</h1>
                  <p className="text-darkBlueGray-300 text-sm">Info Confirmation</p>
                </div>
              </div>

              {/* 右侧 - 进度和品牌 */}
              <div className="flex items-center space-x-6">
                {/* 进度显示 */}
                <div className="hidden md:flex items-center space-x-2">
                  <span className="text-darkBlueGray-400 text-sm">进度</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <div className="w-2 h-2 rounded-full bg-darkBlueGray-600"></div>
                    <div className="w-2 h-2 rounded-full bg-darkBlueGray-600"></div>
                    <div className="w-2 h-2 rounded-full bg-darkBlueGray-600"></div>
                  </div>
                  <span className="text-darkBlueGray-300 text-sm font-medium">1/4</span>
                </div>

                {/* 分隔线 */}
                <div className="hidden md:block h-6 w-px bg-darkBlueGray-600"></div>

                {/* 品牌信息 */}
                <div className="text-right">
                  <p className="text-darkBlueGray-300 text-sm font-medium">WATER MOON</p>
                </div>
              </div>
            </div>

            {/* 移动端进度条 */}
            <div className="md:hidden mt-4 pt-4 border-t border-darkBlueGray-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-darkBlueGray-400 text-sm">选片进度</span>
                <span className="text-darkBlueGray-300 text-sm font-medium">第 1 步，共 4 步</span>
              </div>
              <div className="w-full bg-darkBlueGray-800 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 w-1/4"></div>
              </div>
            </div>
          </div>
        </motion.header>

        <Content className="flex-1 px-4 md:px-6 py-8 flex flex-col items-center pb-36">
          <div className="w-full max-w-4xl space-y-12">
            {/* 核心订单信息卡片 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {/* 订单编号 - 最突出 */}
              <div className="mb-8">
                <p className="text-darkBlueGray-300 mb-3 font-medium tracking-wide">订单编号</p>
                <div className="inline-block px-8 py-4 bg-gradient-to-r from-darkBlueGray-800 to-darkBlueGray-700 rounded-2xl border border-darkBlueGray-600 shadow-2xl">
                  <span className="text-white font-mono text-3xl md:text-4xl font-black tracking-[0.2em] drop-shadow-sm ml-[0.2em]">
                    {orderInfo?.order_number ?? '加载中...'}
                  </span>
                </div>
              </div>

              {/* 客户信息 - 次要突出 */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-8">
                <div className="text-center">
                  <p className="text-darkBlueGray-400 text-xs mb-2 uppercase tracking-wider">客户姓名</p>
                  <span className="text-white text-2xl md:text-3xl font-bold tracking-wide">
                    {orderInfo?.customer_name ?? '加载中...'}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-darkBlueGray-400 text-xs mb-2 uppercase tracking-wider">客户手机</p>
                  <span className="text-blue-300 text-xl md:text-2xl font-mono font-semibold tracking-wider">
                    {orderInfo?.customer_phone ?? '加载中...'}
                  </span>
                </div>
              </div>

              {/* 订单详情网格 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                <div className="bg-darkBlueGray-800/50 rounded-xl p-6 border border-darkBlueGray-700/50">
                  <CalendarOutlined className="text-blue-400 text-2xl mb-3 block mx-auto" />
                  <p className="text-darkBlueGray-400 text-xs mb-1 uppercase tracking-wider">创建日期</p>
                  <p className="text-white text-lg font-semibold">2025-07-26</p>
                </div>
                <div className="bg-darkBlueGray-800/50 rounded-xl p-6 border border-darkBlueGray-700/50">
                  <ClockCircleOutlined className="text-orange-400 text-2xl mb-3 block mx-auto" />
                  <p className="text-darkBlueGray-400 text-xs mb-1 uppercase tracking-wider">截止日期</p>
                  <p className="text-orange-300 text-lg font-semibold">2025-08-26</p>
                </div>
                <div className="bg-darkBlueGray-800/50 rounded-xl p-6 border border-darkBlueGray-700/50">
                  {statusInfo.icon && <div className="text-2xl mb-3 flex justify-center">{statusInfo.icon}</div>}
                  <p className="text-darkBlueGray-400 text-xs mb-1 uppercase tracking-wider">选片状态</p>
                  <p className="text-white text-lg font-semibold">{statusInfo.text}</p>
                </div>
              </div>
            </motion.div>

            {/* 产品列表 - 卡片式 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-center text-darkBlueGray-300 font-medium tracking-wider uppercase mb-8">
                产品列表
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {orderInfo?.order_products.map((orderProduct) => {
                  const selectionStatus = getProductSelectionStatus(orderProduct)
                  const requiredPhotos = orderProduct.product.photo_limit * orderProduct.count
                  const selectedPhotos = orderProduct.selected_photos.length
                  const progressPercent = requiredPhotos > 0 ? (selectedPhotos / requiredPhotos) * 100 : 0

                  return (
                    <div
                      key={orderProduct.id}
                      className="group bg-gradient-to-br from-darkBlueGray-800/40 to-darkBlueGray-900/40 backdrop-blur-sm rounded-2xl p-6 border border-darkBlueGray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 transform hover:-translate-y-1"
                    >
                      {/* 顶部：产品类型标签 + 状态徽章 */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="inline-flex items-center px-3 py-1 bg-blue-00/20 text-blue-300 text-xs font-semibold rounded-full border border-blue-500/30">
                          {orderProduct.product.product_type}
                        </div>
                        <Badge
                          color={selectionStatus.color}
                          text={(
                            <span className="text-white text-xs font-medium ml-1">
                              {selectionStatus.text}
                            </span>
                          )}
                        />
                      </div>

                      {/* 产品名称 */}
                      <div className="mb-5">
                        <h4 className="text-white text-xl font-bold mb-2 leading-tight group-hover:text-blue-200 transition-colors">
                          {orderProduct.product.name}
                        </h4>
                      </div>

                      {/* 详细信息网格 */}
                      <div className="grid grid-cols-2 gap-4 mb-5">
                        {/* 数量信息 */}
                        <div className="text-center bg-darkBlueGray-700/30 rounded-xl p-3 border border-darkBlueGray-600/30">
                          <p className="text-darkBlueGray-400 text-xs mb-1 uppercase tracking-wider">数量</p>
                          <p className="text-white text-2xl font-bold">{orderProduct.count}</p>
                          <p className="text-darkBlueGray-300 text-xs">件</p>
                        </div>

                        {/* 照片需求 */}
                        <div className="text-center bg-darkBlueGray-700/30 rounded-xl p-3 border border-darkBlueGray-600/30">
                          <p className="text-darkBlueGray-400 text-xs mb-1 uppercase tracking-wider">每件照片</p>
                          <p className="text-blue-300 text-2xl font-bold">{orderProduct.product.photo_limit}</p>
                          <p className="text-darkBlueGray-300 text-xs">张</p>
                        </div>
                      </div>

                      {/* 选择进度 */}
                      <div className="space-y-3">
                        {/* 进度标题 */}
                        <div className="flex items-center justify-between">
                          <span className="text-darkBlueGray-300 text-sm font-medium">选择进度</span>
                          <span className="text-white text-base font-bold">
                            {selectedPhotos}
                            /
                            {requiredPhotos === 0 ? '∞' : requiredPhotos}
                          </span>
                        </div>

                        {/* 进度条 */}
                        <Progress
                          percent={progressPercent}
                          strokeColor={{ from: '#3b82f6', to: '#2563eb' }}
                          trailColor="#64748b"
                          showInfo={false}
                        />

                        {/* 总计提示 */}
                        <div className="flex items-center justify-between text-xs pt-2 border-t border-darkBlueGray-600/30">
                          <span className="text-darkBlueGray-400">总计需要</span>
                          <span className="text-orange-300 font-semibold">
                            {requiredPhotos}
                            {' '}
                            张照片
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* 选片流程 - 简约版 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-center text-darkBlueGray-300 font-medium tracking-wider uppercase mb-8">
                选片流程
              </h3>
              <div className="flex items-center justify-center max-w-4xl mx-auto gap-8">
                {[
                  { title: '信息确认', desc: 'Info Confirmation', active: true },
                  { title: '预选照片', desc: 'Photo PreSelection', active: false },
                  { title: '产品选择', desc: 'Product Assignment', active: false },
                  { title: '确认提交', desc: 'Final Submission', active: false },
                ].map((step, idx) => (
                  <div key={step.title} className="flex items-center">
                    {/* 步骤内容 */}
                    <div className="flex flex-col items-center">
                      {/* 步骤圆圈 */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold border-2 transition-all duration-300 ${
                        step.active
                          ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/30'
                          : 'bg-darkBlueGray-800 text-darkBlueGray-400 border-darkBlueGray-600'
                      }`}
                      >
                        {idx + 1}
                      </div>

                      {/* 步骤文字 */}
                      <div className="mt-4 text-center">
                        <p className={`text-base font-semibold mb-1 ${step.active ? 'text-blue-300' : 'text-darkBlueGray-400'}`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-darkBlueGray-500 tracking-wide">
                          {step.desc}
                        </p>
                      </div>
                    </div>

                    {/* 连接线 */}
                    {idx < 3 && (
                      <div className="mx-6 w-16 h-0.5 border-t-2 border-dashed border-darkBlueGray-700" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          {/* 底部操作按钮 */}
          <div className="fixed left-0 right-0 bottom-0 z-20 flex justify-center bg-gradient-to-t from-darkBlueGray-950/98 via-darkBlueGray-900/90 to-transparent py-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="pointer-events-auto"
            >
              <div
                className="flex justify-center relative h-16 px-12 text-xl font-bold rounded-2xl bg-gradient-to-r from-darkBlueGray-600 via-darkBlueGray-700 to-darkBlueGray-800 border-2 border-darkBlueGray-500/60 hover:from-darkBlueGray-500 hover:via-darkBlueGray-600 hover:to-darkBlueGray-700 hover:border-darkBlueGray-400/80 shadow-2xl hover:shadow-darkBlueGray-500/40 transition-all duration-500 transform hover:shadow-xl cursor-pointer"
                onClick={() => {
                  // TODO: 跳转到预选页面
                  navigate('/pre-select')
                }}
              >
                {/* 按钮发光效果 */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <span className="relative flex items-center gap-3 tracking-wide text-white drop-shadow-md font-semibold">
                  开始预选照片
                  <RightOutlined className="text-xl transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </motion.div>
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  )
}

export default OrderInfoPage
