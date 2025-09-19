import { PreSelectStatus } from '@/types/selection/preSelection'
import { Typography } from 'antd'
import cs from 'classnames'
import { motion } from 'framer-motion'

const { Text } = Typography

interface PreSelectStatusBadgeProps {
  status: PreSelectStatus
}

export function PreSelectStatusBadge({ status }: PreSelectStatusBadgeProps) {
  const statusTextMap = {
    [PreSelectStatus.SELECTED]: '已选择',
    [PreSelectStatus.EXCLUDED]: '已排除',
    [PreSelectStatus.PENDING]: '待确认',
  }

  const statusBadgeClasses = cs(
    'backdrop-blur-sm rounded-md px-4 py-2 flex items-center gap-2 shadow-lg border',
    {
      'bg-green-600/90  border-green-500/30': status === PreSelectStatus.SELECTED,
      'bg-red-600/90 border-red-500/30': status === PreSelectStatus.EXCLUDED,
      'bg-darkBlueGray-600/90 border-darkBlueGray-500/30': status === PreSelectStatus.PENDING,
    },
  )

  const statusClasses = cs(
    'w-3 h-3 rounded-full shadow-lg',
    {
      'bg-green-400  shadow-green-400/50': status === PreSelectStatus.SELECTED,
      'bg-red-400 shadow-red-400/50': status === PreSelectStatus.EXCLUDED,
      'bg-darkBlueGray-400 shadow-darkBlueGray-400/50': status === PreSelectStatus.PENDING,
    },
  )

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, x: 20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={statusBadgeClasses}
      onAnimationComplete={() => {}}
    >
      <div className={statusClasses} />
      <Text className="text-white text-sm font-semibold">{statusTextMap[status]}</Text>
    </motion.div>
  )
}
