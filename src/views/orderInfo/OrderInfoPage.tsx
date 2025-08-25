import type { IOrderProduct } from '@/types/user/order'
import ProgressDots from '@/components/ProgressDots/ProgressDots'
import { useOrderStore } from '@/stores/useOrderStore'
import { OrderStatus } from '@/types/user/order'
import {
  ArrowRightOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FieldTimeOutlined,
  FlagOutlined,
} from '@ant-design/icons'
import { Button, Layout, Progress } from 'antd'
import dayjs from 'dayjs'
import { motion } from 'framer-motion'
import { type FC, useMemo } from 'react'
import { useNavigate } from 'react-router'

const { Content } = Layout

const OrderInfoPage: FC = () => {
  const navigate = useNavigate()
  const { orderInfo } = useOrderStore()

  // 获取选片状态显示信息
  const getSelectionStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return {
          text: '待开始',
          icon: <FlagOutlined />,
          iconColor: 'text-yellow-400',
          textColor: 'text-yellow-300',
        }
      case OrderStatus.PRE_SELECT:
        return {
          text: '预选阶段',
          icon: <CheckCircleOutlined />,
          iconColor: 'text-blue-400',
          textColor: 'text-blue-300',
        }
      case OrderStatus.PRODUCT_SELECT:
        return {
          text: '产品分片阶段',
          icon: <CheckCircleOutlined />,
          iconColor: 'text-green-400',
          textColor: 'text-green-300',
        }
      case OrderStatus.SUBMITTED:
        return {
          text: '已提交',
          icon: <CheckCircleOutlined />,
          iconColor: 'text-green-400',
          textColor: 'text-green-300',
        }
      default:
        return {
          text: '未知状态',
          icon: <ExclamationCircleOutlined />,
          iconColor: 'text-gray-400',
          textColor: 'text-gray-300',
        }
    }
  }

  const statusInfo = useMemo(() => {
    return getSelectionStatusInfo(orderInfo?.status || OrderStatus.UNKNOWN)
  }, [orderInfo?.status])

  // 获取产品选择状态
  const getProductSelectionStatus = (orderProduct: IOrderProduct) => {
    const requiredCount = orderProduct.photoLimit * orderProduct.count
    const selectedCount = orderProduct.selectedPhotos.length

    if (selectedCount === 0) {
      return {
        text: '未开始',
        bgColor: 'bg-yellow-600/20',
        borderColor: 'border-yellow-500/30',
        textColor: 'text-yellow-300',
        dotColor: 'bg-yellow-400',
      }
    }
    else if (selectedCount < requiredCount) {
      return {
        text: `已选 ${selectedCount}/${requiredCount}`,
        bgColor: 'bg-blue-500/20',
        borderColor: 'border-blue-500/30',
        textColor: 'text-blue-300',
        dotColor: 'bg-blue-400',
      }
    }
    else {
      return {
        text: '已完成',
        bgColor: 'bg-green-600/20',
        borderColor: 'border-green-500/30',
        textColor: 'text-green-300',
        dotColor: 'bg-green-400',
      }
    }
  }

  return (

    <Layout className="min-h-screen bg-gradient-to-br from-darkBlueGray-950 via-darkBlueGray-900 to-darkBlueGray-950 flex flex-col text-base md:text-lg">
      {/* 顶部导航栏 - 与流程对应 */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 right-0 z-50 bg-darkBlueGray-900/95 backdrop-blur-sm border-b border-darkBlueGray-700/50 h-16"
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
                <h1 className="text-white text-lg font-bold my-0">确认您的订单信息</h1>
                <p className="text-darkBlueGray-300 text-sm">Info Confirmation</p>
              </div>
            </div>

            {/* 右侧 - 进度和品牌 */}
            <div className="flex items-center space-x-6">
              {/* 进度显示 */}
              <ProgressDots currentStep={1} totalSteps={4} />

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

      <Content className="flex-1 px-4 md:px-6 py-16 mt-4 flex flex-col items-center pb-80">
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
                  {orderInfo?.orderNumber ?? '加载中...'}
                </span>
              </div>
            </div>

            {/* 客户信息 - 次要突出 */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-8">
              <div className="text-center">
                <p className="text-darkBlueGray-400 text-xs mb-2 uppercase tracking-wider">客户姓名</p>
                <span className="text-white text-2xl md:text-3xl font-bold tracking-wide">
                  {orderInfo?.customerName ?? '加载中...'}
                </span>
              </div>
              <div className="text-center">
                <p className="text-darkBlueGray-400 text-xs mb-2 uppercase tracking-wider">客户手机</p>
                <span className="text-blue-300 text-xl md:text-2xl font-mono font-semibold tracking-wider">
                  {orderInfo?.customerPhone ?? '加载中...'}
                </span>
              </div>
            </div>

            {/* 订单详情网格 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-darkBlueGray-800/50 rounded-xl p-6 border border-darkBlueGray-700/50">
                <CalendarOutlined className="text-blue-400 text-2xl mb-3 block mx-auto" />
                <p className="text-darkBlueGray-400 text-xs mb-1 uppercase tracking-wider">创建日期</p>
                <p className="text-blue-300 text-lg font-semibold">{dayjs(orderInfo?.createdAt).format('YYYY-MM-DD')}</p>
              </div>
              <div className="bg-darkBlueGray-800/50 rounded-xl p-6 border border-darkBlueGray-700/50">
                <FieldTimeOutlined className="text-orange-400 text-2xl mb-3 block mx-auto" />
                <p className="text-darkBlueGray-400 text-xs mb-1 uppercase tracking-wider">截止日期</p>
                <p className="text-orange-300 text-lg font-semibold">{dayjs(orderInfo?.validUntil).format('YYYY-MM-DD')}</p>
              </div>
              <div className="bg-darkBlueGray-800/50 rounded-xl p-6 border border-darkBlueGray-700/50">
                {statusInfo.icon && <div className={`${statusInfo.iconColor} text-2xl mb-3 block mx-auto`}>{statusInfo.icon}</div>}
                <p className="text-darkBlueGray-400 text-xs mb-1 uppercase tracking-wider">选片状态</p>
                <p className={`text-lg font-semibold ${statusInfo.textColor}`}>{statusInfo.text}</p>
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
              {orderInfo?.orderProducts.map((orderProduct) => {
                const selectionStatus = getProductSelectionStatus(orderProduct)
                const requiredPhotos = orderProduct.photoLimit * orderProduct.count
                const selectedPhotos = orderProduct.selectedPhotos.length
                const progressPercent = requiredPhotos > 0
                  ? (selectedPhotos / requiredPhotos) * 100
                  : requiredPhotos === 0
                    ? selectedPhotos > 0 ? 100 : 0
                    : 0

                // 根据进度确定颜色
                const getProgressColor = () => {
                  if (progressPercent >= 100) {
                    return { from: '#10b981', to: '#059669' } // 绿色
                  }
                  return { from: '#3b82f6', to: '#1d4ed8' } // 蓝色统一：blue-500 to blue-700
                }

                return (
                  <div
                    key={orderProduct.id}
                    className="group bg-gradient-to-br from-darkBlueGray-800/40 to-darkBlueGray-900/40 backdrop-blur-sm rounded-2xl p-6 border border-darkBlueGray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 transform hover:-translate-y-1"
                  >
                    {/* 顶部：产品类型标签 + 状态徽章 */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full border border-blue-500/30">
                        {orderProduct.productType}
                      </div>
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${selectionStatus.bgColor} ${selectionStatus.borderColor}`}
                      >
                        <div className={`w-2 h-2 rounded-full mr-2 ${selectionStatus.dotColor}`} />
                        <span className={selectionStatus.textColor}>
                          {selectionStatus.text}
                        </span>
                      </motion.div>
                    </div>

                    {/* 产品名称 */}
                    <div className="mb-5">
                      <h4 className="text-white text-xl font-bold mb-2 leading-tight group-hover:text-blue-300 transition-colors">
                        {orderProduct.productName}
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
                        <p className="text-darkBlueGray-400 text-xs mb-1 uppercase tracking-wider">应选照片</p>
                        <p className="text-blue-300 text-2xl font-bold">{orderProduct.photoLimit === 0 ? '∞' : orderProduct.photoLimit}</p>
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
                        strokeColor={getProgressColor()}
                        trailColor="#475569"
                        showInfo={false}
                      />

                      {/* 总计提示 */}
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-darkBlueGray-600/30">
                        <span className="text-darkBlueGray-400">总计需要</span>
                        <span className="text-blue-300 font-semibold">
                          {requiredPhotos === 0 ? '∞' : requiredPhotos}
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
        </div>

        {/* 底部固定区域 - 选片流程与操作按钮整合 */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, type: 'spring', stiffness: 120 }}
          className="fixed left-0 right-0 bottom-0 z-20 bg-gradient-to-br from-darkBlueGray-800/95 via-darkBlueGray-900/98 to-darkBlueGray-950/95 backdrop-blur-md border-t border-darkBlueGray-700/50"
        >
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* 选片流程条 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="mb-8"
            >
              <h3 className="text-center text-darkBlueGray-300 font-medium tracking-wider uppercase mb-6">
                选片流程
              </h3>
              <div className="flex items-center justify-center gap-6">
                {[
                  { title: '信息确认', desc: 'Info Confirmation', active: true },
                  { title: '预选照片', desc: 'Photo PreSelection', active: false },
                  { title: '产品选择', desc: 'Product Assignment', active: false },
                  { title: '确认提交', desc: 'Final Submission', active: false },
                ].map((step, idx) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.7 + idx * 0.08,
                      type: 'spring',
                      stiffness: 180,
                    }}
                    className="flex items-center"
                  >
                    {/* 步骤内容 */}
                    <div className="flex flex-col items-center">
                      {/* 步骤圆圈 */}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                          step.active
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/40 ring-2 ring-blue-400/30'
                            : 'bg-darkBlueGray-800 text-darkBlueGray-400 border-darkBlueGray-600 hover:border-darkBlueGray-500'
                        }`}
                      >
                        {idx + 1}
                      </motion.div>

                      {/* 步骤文字 */}
                      <div className="mt-3 text-center">
                        <p className={`text-sm font-semibold mb-1 transition-colors duration-300 ${step.active ? 'text-blue-300' : 'text-darkBlueGray-400'}`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-darkBlueGray-500 tracking-wide">
                          {step.desc}
                        </p>
                      </div>
                    </div>

                    {/* 连接线 */}
                    {idx < 3 && (
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.2, delay: 0.9 + idx * 0.08 }}
                        className="mx-4 w-12 h-0.5 border-t-2 border-dashed border-darkBlueGray-700 origin-left"
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* 操作按钮 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 1.1 }}
              className="flex justify-center"
            >
              <Button
                type="primary"
                size="large"
                icon={<ArrowRightOutlined />}
                iconPosition="end"
                onClick={() => navigate('/pre-select')}
                className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 border-blue-500 hover:border-blue-600 active:border-blue-700 transition-all duration-200"
              >
                开始挑选美照
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </Content>
    </Layout>
  )
}

export default OrderInfoPage
