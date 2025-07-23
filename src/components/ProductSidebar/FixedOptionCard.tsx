import { motion } from 'framer-motion'

interface FixedOptionCardProps {
  // 选项ID
  optionId: number
  // 选项名称
  name: string
  // 图标类型
  iconType: 'all' | 'selected' | 'unselected'
  // 照片数量
  photoCount: number
  // 描述文字
  description: string
  // 是否选中
  isSelected?: boolean
  onClick?: (optionId: number) => void
  className?: string
}

const IconMap = {
  all: (
    <div className="w-5 h-5 flex items-center justify-center bg-gradient-to-br from-darkBlueGray-400 to-darkBlueGray-600 rounded-full">
      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    </div>
  ),
  selected: (
    <div className="w-5 h-5 flex items-center justify-center bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full">
      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
  ),
  unselected: (
    <div className="w-5 h-5 flex items-center justify-center bg-gradient-to-br from-slate-400 to-slate-600 rounded-full">
      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  ),
}

const ColorMap = {
  all: {
    bg: 'from-blue-600/90 via-blue-800/90 to-blue-900/90',
    selectedBg: 'from-blue-500/15 to-blue-400/30',
    border: 'ring-blue-400',
    text: 'text-blue-100',
    count: 'bg-blue-500/30 text-blue-100 border-blue-400/50',
  },
  selected: {
    bg: 'from-darkBlueGray-600/95 via-darkBlueGray-700/90 to-emerald-800/80',
    selectedBg: 'from-emerald-500/25 to-emerald-400/30',
    border: 'ring-emerald-400',
    text: 'text-emerald-100',
    count: 'bg-emerald-500/30 text-emerald-100 border-emerald-400/50',
  },
  unselected: {
    bg: 'from-darkBlueGray-600/95 via-darkBlueGray-700/90 to-slate-800/80',
    selectedBg: 'from-slate-500/25 to-slate-400/30',
    border: 'ring-slate-400',
    text: 'text-slate-200',
    count: 'bg-slate-500/30 text-slate-100 border-slate-400/50',
  },
}

export function FixedOptionCard(props: FixedOptionCardProps) {
  const {
    optionId,
    name,
    iconType,
    photoCount,
    description,
    isSelected = false,
    onClick,
    className,
  } = props

  const colors = ColorMap[iconType]

  function handleCardClick() {
    onClick && onClick(optionId)
  }

  return (
    <motion.div
      className={`relative mb-3 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
        isSelected
          ? `ring-2 ${colors.border} ring-offset-2 ring-offset-darkBlueGray-800`
          : 'hover:ring-1 hover:ring-darkBlueGray-500/50 hover:ring-offset-1 hover:ring-offset-darkBlueGray-800'
      } ${className || ''}`}
      onClick={handleCardClick}
    >
      {/* 背景渐变 */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg}`}></div>

      {/* 内容区域 */}
      <div className="relative p-4">
        {/* 头部区域 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            {/* 图标 */}
            {IconMap[iconType]}

            {/* 名称 */}
            <h3 className={`text-white text-lg font-bold tracking-wide ${colors.text}`}>
              {name}
            </h3>
          </div>

          {/* 照片数量 */}
          <div className={`px-2.5 py-1 rounded-lg text-xs font-bold ${colors.count} border`}>
            {photoCount}
          </div>
        </div>

        {/* 描述信息 */}
        <div className="flex items-center justify-between">
          <p className={`text-sm ${colors.text} opacity-80`}>
            {description}
          </p>

          {/* 箭头指示 */}
          <div className={`w-4 h-4 flex items-center justify-center ${colors.text} opacity-60`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* 选中状态的光晕效果 */}
      {isSelected && (
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.selectedBg} rounded-xl pointer-events-none`}></div>
      )}

      {/* 特殊效果：渐变边框 */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
    </motion.div>
  )
}
