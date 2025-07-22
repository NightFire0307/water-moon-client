import { usePhotoViewerContext } from '@/contexts/PhotoViewerContext'
import { usePhotosStore } from '@/stores/usePhotosStore'
import { motion } from 'framer-motion'

export function PhotoStatusBar() {
  const { thumbnailVisible } = usePhotoViewerContext()
  const { getCurrentPhotoInfo } = usePhotosStore()

  const { totalCount, name, currentIndex } = getCurrentPhotoInfo()

  return (
    <motion.div
      initial={{ translateY: '0' }}
      animate={{ translateY: thumbnailVisible ? -80 : 0 }}
    >
      <div className="absolute bottom-2 left-1/2 p-2 -translate-x-1/2 rounded-md bg-darkBlueGray-800/70 text-white font-medium backdrop-blur-md">
        <span>{name}</span>
        <span> · </span>
        <span>{`${currentIndex}/${totalCount}`}</span>
      </div>
    </motion.div>
  )
}
