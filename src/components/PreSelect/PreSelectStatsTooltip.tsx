import { usePhotosStore } from '@/stores/usePhotosStore'
import { Progress, Typography } from 'antd'
import { motion } from 'framer-motion'
import { useMemo } from 'react'

const { Text } = Typography

interface PreSelectStatsTooltipProps {
  isProgressHovered: boolean
}

export function PreSelectStatsTooltip({ isProgressHovered }: PreSelectStatsTooltipProps) {
  const { getPreSelectedStats } = usePhotosStore()

  const { selectedCount, excludedCount, pendingCount } = getPreSelectedStats()

  const percent = useMemo(() => {
    return Math.round((selectedCount + excludedCount) / (selectedCount + excludedCount + pendingCount) * 100)
  }, [selectedCount, excludedCount, pendingCount])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: isProgressHovered ? 1 : 0,
        scale: isProgressHovered ? 1 : 0.8,
        y: isProgressHovered ? 0 : 10,
      }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="absolute top-8 right-0 z-50 pointer-events-none"
      style={{ display: isProgressHovered ? 'block' : 'none' }}
    >
      <div className="bg-darkBlueGray-800/95 backdrop-blur-lg rounded-xl border border-darkBlueGray-700/50 shadow-2xl p-4 min-w-[240px]">
        <div className="text-center pb-3 border-b border-darkBlueGray-700/30">
          <Text className="text-darkBlueGray-300 text-xs font-medium tracking-wide uppercase">
            筛选统计
          </Text>
        </div>

        <div className="space-y-3 mt-3">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="flex items-center justify-between gap-6"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/30"></div>
              <Text className="text-darkBlueGray-300 text-sm font-medium">已选择</Text>
            </div>
            <div className="px-3 py-1 bg-green-600/20 border border-green-600/30 rounded-lg">
              <Text className="text-green-400 font-bold text-sm">{selectedCount}</Text>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.15 }}
            className="flex items-center justify-between gap-6"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/30"></div>
              <Text className="text-darkBlueGray-300 text-sm font-medium">已排除</Text>
            </div>
            <div className="px-3 py-1 bg-red-600/20 border border-red-600/30 rounded-lg">
              <Text className="text-red-400 font-bold text-sm">{excludedCount}</Text>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
            className="flex items-center justify-between gap-6"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/30"></div>
              <Text className="text-darkBlueGray-300 text-sm font-medium">待处理</Text>
            </div>
            <div className="px-3 py-1 bg-blue-600/20 border border-blue-600/30 rounded-lg">
              <Text className="text-blue-400 font-bold text-sm">{pendingCount}</Text>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="pt-3 mt-3 border-t border-darkBlueGray-700/30"
        >
          <div className="flex items-center justify-between mb-2">
            <Text className="text-darkBlueGray-400 text-xs">
              总进度
            </Text>
            <Text className="text-white text-xs font-semibold">
              {percent}
              %
            </Text>
          </div>
          <Progress percent={percent} strokeColor={{ from: '#22c55e', to: '#4ade80' }} showInfo={false} />
        </motion.div>
      </div>
    </motion.div>
  )
}
