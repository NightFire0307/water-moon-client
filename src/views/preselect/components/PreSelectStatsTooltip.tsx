import { useOrderStore } from '@/stores/useOrderStore'
import { usePhotosStore } from '@/stores/usePhotosStore'
import { Progress, Typography } from 'antd'
import { AnimatePresence, motion } from 'framer-motion'
import { useMemo } from 'react'

const { Text } = Typography

interface PreSelectStatsTooltipProps {
  isProgressHovered: boolean
}

function PreSelectStatsTooltip({ isProgressHovered }: PreSelectStatsTooltipProps) {
  const { getPreSelectedStats } = usePhotosStore()
  const { orderInfo } = useOrderStore()
  const { selectedCount, excludedCount, pendingCount } = getPreSelectedStats()

  // 计算总进度百分比
  const percent = useMemo(() => {
    return Math.round((selectedCount + excludedCount) / (selectedCount + excludedCount + pendingCount) * 100)
  }, [selectedCount, excludedCount, pendingCount])

  // 加片信息统计
  const extraInfo = useMemo(() => {
    if (!orderInfo)
      return { extraCount: 0, extraAmount: 0 }

    const extraCount = Math.max(0, selectedCount - orderInfo.maxSelectPhotos)
    const extraAmount = extraCount * orderInfo.extraPhotoPrice

    return {
      extraCount,
      extraAmount,
    }
  }, [orderInfo, selectedCount])

  return (
    <AnimatePresence>
      {
        isProgressHovered && (
          <motion.div
            key="preselect-stats-tooltip"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-14 right-0 z-50"
          >
            <div className="bg-darkBlueGray-900/90 backdrop-blur-lg rounded-md border border-darkBlueGray-500/50 shadow-2xl p-4 min-w-[240px]">
              <div className="text-center pb-3 border-b border-darkBlueGray-700/50">
                <Text className="text-darkBlueGray-300 text-xs font-medium tracking-wide uppercase">
                  筛选统计
                </Text>
              </div>

              <div className="space-y-3 mt-3">
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/30"></div>
                    <Text className="text-darkBlueGray-300 text-sm font-medium">已选择</Text>
                  </div>
                  <div className="px-3 py-1 bg-green-600/20 border border-green-600/30 rounded-lg">
                    <Text className="text-green-400 font-bold text-sm">{selectedCount}</Text>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500 shadow-lg shadow-amber-500/30"></div>
                    <Text className="text-darkBlueGray-300 text-sm font-medium">已排除</Text>
                  </div>
                  <div className="px-3 py-1 bg-amber-600/20 border border-amber-600/30 rounded-lg">
                    <Text className="text-amber-400 font-bold text-sm">{excludedCount}</Text>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-darkBlueGray-500 shadow-lg shadow-darkBlueGray-500/30"></div>
                    <Text className="text-darkBlueGray-300 text-sm font-medium">待处理</Text>
                  </div>
                  <div className="px-3 py-1 bg-darkBlueGray-600/20 border border-darkBlueGray-600/30 rounded-lg">
                    <Text className="text-darkBlueGray-400 font-bold text-sm">{pendingCount}</Text>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-darkBlueGray-700/50" />

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

              <div className="pt-3 mt-3 border-t border-darkBlueGray-700/50" />

              {/* 加片信息 */}
              <div className="flex items-center justify-between mt-2">
                <Text className="text-darkBlueGray-400 text-xs">加片张数</Text>
                <Text className="text-amber-500 text-sm font-bold">
                  {extraInfo.extraCount}
                  张
                </Text>
              </div>

              <div className="flex items-center justify-between mt-2">
                <Text className="text-darkBlueGray-400 text-xs">加片金额</Text>
                <Text className="text-amber-500 text-sm font-bold">
                  {
                    extraInfo.extraAmount > 0
                      ? `¥${extraInfo.extraAmount}元`
                      : '无需加片费'
                  }
                </Text>
              </div>

            </div>
          </motion.div>
        )
      }
    </AnimatePresence>
  )
}

export default PreSelectStatsTooltip
