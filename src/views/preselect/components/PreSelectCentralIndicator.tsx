import type { FC } from 'react'
import { PreSelectStatus } from '@/types/selection/preSelection'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import cs from 'classnames'
import { motion } from 'framer-motion'

interface PreSelectCentralIndicatorProps {
  status: PreSelectStatus
}

export const PreSelectCentralIndicator: FC<PreSelectCentralIndicatorProps> = ({ status }) => {
  if (status === PreSelectStatus.PENDING)
    return null

  const indicatorClasses = cs(
    'rounded-full p-8 backdrop-blur-sm border-4',
    {
      'bg-cyan-500/20 border-cyan-500/60': status === PreSelectStatus.SELECTED,
      'bg-rose-500/20 border-rose-500/60': status === PreSelectStatus.EXCLUDED,
    },
  )

  const indicatorTextClasses = cs(
    'flex items-center justify-center shadow-2xl w-16 h-16 rounded-full',
    {
      'bg-cyan-500 shadow-cyan-500/30': status === PreSelectStatus.SELECTED,
      'bg-rose-500 shadow-rose-500/30': status === PreSelectStatus.EXCLUDED,
    },
  )

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <div className={indicatorClasses}>
        <div className={indicatorTextClasses}>
          {
            status === PreSelectStatus.SELECTED
              ? <CheckOutlined className="text-2xl text-white" />
              : <CloseOutlined className="text-2xl text-white" />
          }
        </div>
      </div>
    </motion.div>
  )
}
