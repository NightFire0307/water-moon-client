import { Progress } from 'antd'
import { motion } from 'framer-motion'
import { useMemo } from 'react'

interface ProductCardProps {
  // 产品ID
  productId: number
  // 产品名称
  name: string
  // 产品类型
  type: string
  // 已选张数
  selectedCount: number
  // 照片数量限制
  limitCount: number
  // 是否允许超张
  allowOverLimit: boolean
  // 产品备注
  remark?: string
  // 是否选中
  isSelected?: boolean
  onClick?: (productId: number) => void
  className?: string
}

export function ProductCard(props: ProductCardProps) {
  const {
    productId,
    name,
    type,
    selectedCount,
    limitCount,
    allowOverLimit,
    remark,
    isSelected = false,
    onClick,
    className,
  } = props

  const { isAtLimit, isOverLimit } = useMemo(() => {
    return {
      isOverLimit: selectedCount > limitCount,
      isAtLimit: selectedCount === limitCount,
    }
  }, [selectedCount, limitCount])

  function handleCardClick() {
    onClick && onClick(productId)
  }

  const { progressPercent, strokeColor } = useMemo(() => {
    const progressPercent = (selectedCount / limitCount) * 100

    if (progressPercent === 100) {
      return {
        progressPercent,
        strokeColor: {
          from: '#4ade80',
          to: '#34d399',
        },
      }
    }

    if (progressPercent > 100 && !allowOverLimit) {
      return {
        progressPercent: 100,
        strokeColor: {
          from: 'rgb(249 115 22 / 0.7)',
          to: 'rgb(239 68 68 / 0.7)',
        },
      }
    }

    return {
      progressPercent,
      strokeColor: {
        from: '#60a5fa',
        to: '#22d3ee',
      },
    }
  }, [selectedCount, limitCount])

  return (
    <motion.div
      className={`relative mb-4 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-darkBlueGray-800'
          : 'hover:ring-1 hover:ring-darkBlueGray-500/50 hover:ring-offset-1 hover:ring-offset-darkBlueGray-800'
      } ${className || ''}`}
      onClick={handleCardClick}
    >
      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-darkBlueGray-700/90 via-darkBlueGray-800/95 to-darkBlueGray-900/90"></div>

      {/* 内容区域 */}
      <div className="relative p-5">
        {/* 头部区域 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-white text-xl font-bold mb-1 tracking-wide">
              {name}
            </h3>
            <div className="inline-block px-2.5 py-1 bg-darkBlueGray-600/60 text-darkBlueGray-100 text-xs font-medium rounded-md backdrop-blur-sm">
              {type}
            </div>
          </div>

          {/* 右上角状态 */}
          {allowOverLimit && (
            <div className="px-2 py-1 bg-amber-500/15 text-amber-200 text-xs font-medium rounded-md border border-amber-500/30">
              可超张
            </div>
          )}
        </div>

        {/* 进度区域 */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-darkBlueGray-200 text-sm font-medium">照片进度</span>
            <span className="text-white text-sm font-bold">
              {selectedCount}
              <span className="text-darkBlueGray-300 mx-1">/</span>
              {limitCount === 0 ? '∞' : limitCount}
            </span>
          </div>

          {/* 进度条 */}
          <Progress percent={progressPercent} strokeColor={strokeColor} trailColor="#475569" showInfo={false} />
        </div>

        {/* 状态标签 */}
        <div className="flex items-center mb-4">
          {isOverLimit && !allowOverLimit && (
            <div className="flex items-center px-3 py-1.5 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 rounded-lg">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse mr-2"></div>
              <span className="text-orange-200 text-xs font-semibold">已超限制</span>
            </div>
          )}
          {isAtLimit && !isOverLimit && (
            <div className="flex items-center px-3 py-1.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <span className="text-green-200 text-xs font-semibold">已完成</span>
            </div>
          )}
          {selectedCount > 0 && !isAtLimit && !isOverLimit && (
            <div className="flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-lg">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-blue-200 text-xs font-semibold">进行中</span>
            </div>
          )}
          {selectedCount === 0 && (
            <div className="flex items-center px-3 py-1.5 bg-darkBlueGray-600/40 border border-darkBlueGray-500/40 rounded-lg">
              <div className="w-2 h-2 bg-darkBlueGray-300 rounded-full mr-2"></div>
              <span className="text-darkBlueGray-200 text-xs font-semibold">待开始</span>
            </div>
          )}
        </div>

        {/* 备注信息 */}
        {remark && (
          <div className="pt-3 border-t border-darkBlueGray-600/50">
            <div className="flex items-start space-x-2">
              <div className="w-4 h-4 mt-0.5 flex-shrink-0 flex items-center justify-center">
                <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
              </div>
              <p className="text-darkBlueGray-200 text-xs leading-relaxed">
                {remark}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 选中状态的光晕效果 */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl pointer-events-none"></div>
      )}
    </motion.div>
  )
}
