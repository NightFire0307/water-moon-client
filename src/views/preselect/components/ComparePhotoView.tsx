import useMouseOver from '@/hooks/useMouseOver'
import { type Photo, usePhotosStore } from '@/stores/usePhotosStore'
import { PreSelectStatus } from '@/types/selection/preSelection'
import { Typography } from 'antd'
import { AnimatePresence, motion } from 'framer-motion'
import { HeartIcon, XIcon } from 'lucide-react'
import { useCallback } from 'react'

const { Text } = Typography

interface ComparePhotoViewProps {
  photo: Photo // 当前显示的照片对象
  onSelect: (photoId: number) => void // 选中回调函数
  onExclude: (photoId: number) => void // 排除回调函数
}

function ComparePhotoView() {
  const {
    comparePhotos,
    setComparePhotos,
    preSelectedPhotos,
    setPreSelectedPhotos,
    currentPhoto,
    setCurrentPhoto,
  } = usePhotosStore()

  const updatePhotoStatus = useCallback((photoId: number, status: PreSelectStatus) => {
    // 更新 comparePhotos 中对应照片的预选状态
    const updatedPhotos = comparePhotos.map((photo) => {
      if (photo.photoId === photoId) {
        return { ...photo, preSelectStatus: status }
      }
      return photo
    })
    setComparePhotos(updatedPhotos)

    // 同步更新 preSelectedPhotos 列表
    if (preSelectedPhotos.has(photoId)) {
      const updatedPreSelected = new Map(preSelectedPhotos)
      updatedPreSelected.set(photoId, {
        ...updatedPreSelected.get(photoId),
        preSelectStatus: status,
      } as Photo)
      setPreSelectedPhotos(updatedPreSelected)
    }

    // 同步 CurrentPhoto 的预选状态
    if (currentPhoto?.photoId === photoId) {
      setCurrentPhoto({ ...currentPhoto, preSelectStatus: status })
    }
  }, [comparePhotos, preSelectedPhotos, setComparePhotos, setPreSelectedPhotos, currentPhoto, setCurrentPhoto])

  return (
    <div className="h-full flex items-center justify-center gap-6">
      {comparePhotos.map(photo => (
        <PhotoViewItem
          key={photo.photoId}
          photo={photo}
          onSelect={photoId => updatePhotoStatus(photoId, PreSelectStatus.SELECTED)}
          onExclude={photoId => updatePhotoStatus(photoId, PreSelectStatus.EXCLUDED)}
        />
      ))}
    </div>
  )
}

function PhotoViewItem({ photo, onSelect, onExclude }: ComparePhotoViewProps) {
  const { isHover, handleMouseEnter, handleMouseLeave } = useMouseOver({ delay: 0 })

  return (
    <div
      className="relative rounded-md after:contents-[''] border-2 border-transparent hover:border-darkBlueGray-400 hover:overflow-hidden transition"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 右上角预选状态角标 - 始终显示 */}
      <div className="absolute top-3 right-3">
        {photo.preSelectStatus === PreSelectStatus.SELECTED && (
          <div className="w-9 h-9 rounded-full bg-emerald-600/90 backdrop-blur-sm shadow-lg shadow-emerald-500/40 flex items-center justify-center border-2 border-emerald-400/80 transition-all duration-200">
            <HeartIcon size={18} fill="#fff" className="text-white" />
          </div>
        )}
        {photo.preSelectStatus === PreSelectStatus.EXCLUDED && (
          <div className="w-9 h-9 rounded-full bg-amber-600/90 backdrop-blur-sm shadow-lg shadow-amber-500/40 flex items-center justify-center border-2 border-amber-400/80 transition-all duration-200">
            <XIcon size={18} className="text-white" strokeWidth={2.5} />
          </div>
        )}
      </div>

      <img
        src={photo.mediumUrl}
        alt={photo.name}
        className="object-contain h-full max-h-[calc(100vh-118px)] flex-1 min-w-full"
      />

      <AnimatePresence>
        {
          isHover && (
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >

              {/* 照片名称 - 左上角 */}
              <div className="absolute top-3 left-3 bg-darkBlueGray-800/80 backdrop-blur-sm rounded-md px-3 py-1.5 shadow-lg border border-darkBlueGray-600/50">
                <Text className="text-white text-xs font-medium">{photo.name}</Text>
              </div>

              {/* 状态切换按钮 - 左下角 */}
              <div className="absolute bottom-3 left-3 flex gap-2">
                {/* 选中按钮 */}
                <button
                  type="button"
                  onClick={() => onSelect(photo.photoId)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm font-medium text-sm ${
                    photo.preSelectStatus === PreSelectStatus.SELECTED
                      ? 'bg-emerald-600 text-white border-2 border-emerald-400'
                      : 'bg-darkBlueGray-700/90 text-darkBlueGray-200 border-2 border-darkBlueGray-600 hover:bg-emerald-600/20 hover:border-emerald-500/50 hover:text-emerald-400'
                  }`}
                  aria-label="选择照片"
                >
                  <HeartIcon
                    size={18}
                    fill={photo.preSelectStatus === PreSelectStatus.SELECTED ? '#fff' : 'none'}
                    className={photo.preSelectStatus === PreSelectStatus.SELECTED ? 'text-white' : 'text-current'}
                  />
                </button>

                {/* 排除按钮 */}
                <button
                  type="button"
                  onClick={() => onExclude(photo.photoId)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm font-medium text-sm ${
                    photo.preSelectStatus === PreSelectStatus.EXCLUDED
                      ? 'bg-amber-600 text-white  border-2 border-amber-400'
                      : 'bg-darkBlueGray-700/90 text-darkBlueGray-200 border-2 border-darkBlueGray-600 hover:bg-amber-600/20 hover:border-amber-500/50 hover:text-amber-400'
                  }`}
                  aria-label="排除照片"
                >
                  <XIcon size={18} />
                </button>
              </div>
            </motion.div>
          )
        }

      </AnimatePresence>
    </div>
  )
}

export default ComparePhotoView
