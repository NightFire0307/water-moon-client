import { usePhotoViewerContext } from '@/contexts/PhotoViewerContext'
import { motion } from 'framer-motion'

export function PhotoStatusBar() {
  const { thumbnailVisible } = usePhotoViewerContext()

  return (
    <motion.div
      initial={{ translateY: '0' }}
      animate={{ translateY: thumbnailVisible ? -80 : 0 }}
      transition={{
        duration: 0.3,
        ease: 'easeOut',
      }}
    >
      <div className="absolute bottom-2 left-1/2 p-2 -translate-x-1/2 rounded-md bg-darkBlueGray-800/70 text-white font-medium backdrop-blur-md">
        <span>CZCZ0881</span>
        <span> · </span>
        <span>1 / 20</span>
      </div>
    </motion.div>
  )
}
