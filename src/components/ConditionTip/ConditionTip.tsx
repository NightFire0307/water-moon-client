import type { FC } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface ConditionTipProps {
  visible: boolean
  msg: string
  centered?: boolean
}

export const ConditionTip: FC<ConditionTipProps> = ({ visible, msg, centered }) => {
  return (
    <AnimatePresence>
      {
        visible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: 'easeOut',
            }}
          >
            <div
              className={`absolute  left-1/2 -translate-x-1/2 ${centered ? 'top-1/2' : 'top-20'} text-white p-4 bg-darkBlueGray-800/60 rounded-xl`}
            >
              { msg }
            </div>
          </motion.div>
        )
      }
    </AnimatePresence>
  )
}
