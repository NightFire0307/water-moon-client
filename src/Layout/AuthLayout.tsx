import { useAuthStore } from '@/stores/useAuthStore'
import {
  CameraOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  PictureOutlined,
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import { type FC, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router'

const AuthLayout: FC = () => {
  const { accessToken } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (accessToken) {
      // 如果已经登录，重定向到订单确认页面
      navigate('/order-info')
    }
  }, [accessToken])

  return (
    <div className="flex h-screen text-white">
      {/* 左侧内容区域 - 深色主题 */}
      <div className="relative flex flex-col justify-between md:w-2/5 p-8 overflow-hidden bg-gradient-to-br from-darkBlueGray-950 via-darkBlueGray-900 to-darkBlueGray-800">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-br from-darkBlueGray-900/90 via-darkBlueGray-950/95 to-darkBlueGray-800/90"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500/15 rounded-full blur-2xl translate-x-16 translate-y-16 animate-pulse" />

        {/* 主要内容 */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 flex flex-col gap-8 max-w-md"
        >
          {/* Logo和标题 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 flex justify-center items-center bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl text-white text-2xl shadow-lg shadow-cyan-500/25">
              <CameraOutlined />
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
              水月在线选片系统
            </div>
          </motion.div>

          {/* 主标题 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-4xl font-bold bg-gradient-to-r from-cyan-100 via-cyan-400 to-cyan-600 bg-clip-text text-transparent leading-tight"
          >
            轻松选片，定格美好瞬间
          </motion.div>

          {/* 描述文字 */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-darkBlueGray-300 leading-relaxed text-lg"
          >
            专为影楼设计的在线选片平台，提供高清预览、智能筛选和便捷管理。
          </motion.span>

          {/* 特性列表 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="space-y-4"
          >
            {[
              {
                icon: <PictureOutlined />,
                title: '高效便捷',
                desc: '通过订单号+手机号快速登录',
                delay: 0.1,
              },
              {
                icon: <CheckCircleOutlined />,
                title: '智能管理',
                desc: '支持产品标记，数量限制，备注说明与后台订单同步',
                delay: 0.2,
              },
              {
                icon: <ClockCircleOutlined />,
                title: '极致体验',
                desc: '采用现代化UI设计，解决传统选片系统的复杂与繁琐',
                delay: 0.3,
              },
            ].map(feature => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1 + feature.delay }}
                className="flex gap-4 p-4 rounded-xl bg-darkBlueGray-800/40 backdrop-blur-sm border border-darkBlueGray-700/30 hover:bg-darkBlueGray-800/60 transition-all duration-300"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-xl border border-cyan-500/30 text-cyan-300 text-xl">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-1">{feature.title}</h3>
                  <p className="text-darkBlueGray-300 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* 底部版权信息 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="relative z-10 text-darkBlueGray-400 text-sm"
        >
          © 2025 繁花工作室 · 版权所有
        </motion.p>
      </div>

      {/* 右侧登录区域 - 深色主题 */}
      <div className="relative w-full md:w-3/5 flex items-center justify-center p-8 overflow-hidden bg-gradient-to-br from-darkBlueGray-950 via-darkBlueGray-900 to-darkBlueGray-950">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-br from-darkBlueGray-950/95 via-darkBlueGray-900/98 to-darkBlueGray-950/92"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-500/8 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-cyan-400/6 rounded-full blur-xl -translate-x-1/2 -translate-y-1/2"></div>

        {/* 左侧边界分隔 - 简化分割效果 */}
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-darkBlueGray-700/50 to-transparent"></div>
        <div className="absolute top-0 left-0 w-4 h-full bg-gradient-to-r from-darkBlueGray-800/20 to-transparent"></div>

        {/* 登录卡片 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-xl"
        >
          <div className="relative bg-gradient-to-br from-darkBlueGray-800/95 via-darkBlueGray-750/98 to-darkBlueGray-700/92 backdrop-blur-xl rounded-3xl shadow-2xl border border-darkBlueGray-600/50 p-10 overflow-hidden">
            {/* 顶部装饰光效 */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/80 to-transparent"></div>
            <div className="absolute top-0 left-1/2 w-20 h-20 bg-cyan-500/20 rounded-full blur-2xl -translate-x-1/2 -translate-y-10"></div>

            {/* 边框光效 */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-transparent to-cyan-500/10 opacity-60"></div>

            <div className="relative z-10">
              {/* 标题 */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mb-10 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500/25 to-cyan-600/25 rounded-2xl border border-cyan-500/60 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg">
                    <div className="w-4 h-4 bg-white rounded-sm"></div>
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-darkBlueGray-100 mb-2">
                  欢迎回来
                </h2>
                <p className="text-darkBlueGray-300 text-base font-medium">输入您的登录信息，即刻开始选片</p>
              </motion.div>

              {/* 登录表单插槽 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <Outlet />
              </motion.div>

              {/* 分隔线 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex items-center my-8"
              >
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-darkBlueGray-400/80 to-transparent"></div>
                <span className="px-4 text-darkBlueGray-300 text-sm font-medium">如有疑问，请联系您的选片师</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-darkBlueGray-400/80 to-transparent"></div>
              </motion.div>
            </div>

            {/* 底部装饰光效 */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/70 to-transparent"></div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AuthLayout
