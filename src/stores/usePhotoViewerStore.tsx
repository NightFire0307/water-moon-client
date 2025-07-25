import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { PreSelectStatus, usePhotosStore } from './usePhotosStore'

interface PhotoViewerState {
  currentIndex: number
  rotate: number
  scale: number
}

interface PhotoViewerActions {
  next: (preSelectStatus?: PreSelectStatus) => void
  previous: () => void
  zoomIn: () => void
  zoomOut: () => void
  resetZoom: () => void
  rotateLeft: () => void
  rotateRight: () => void
  // 设置当前照片索引
  setCurrentIndex: (index: number) => void
}

export const usePhotoViewerStore = create<PhotoViewerState & PhotoViewerActions>()(
  devtools(
    (set, get) => ({
      currentIndex: 0,
      scale: 1,
      rotate: 0,
      selected: false,

      next: (preSelectStatus = PreSelectStatus.SELECTED) => set((state) => {
        const photoStore = usePhotosStore.getState()
        const { mode, setCurrentPhoto, preSelectedPhotos, setPreSelectedPhotoStatus, currentPhoto } = photoStore
        // 处理当前照片为空
        if (currentPhoto === null) {
          console.error('当前没有照片可供查看')
          return { currentIndex: 0 }
        }

        const previousPhotoId = currentPhoto.photoId

        if (mode === 'preSelect') {
          // 更新当前照片索引
          setCurrentPhoto(Math.min(state.currentIndex + 1, preSelectedPhotos.length - 1))

          // 设置上一张照片预选状态
          console.log(preSelectStatus)
          setPreSelectedPhotoStatus(previousPhotoId, preSelectStatus)

          return { currentIndex: Math.min(state.currentIndex + 1, preSelectedPhotos.length - 1) }
        }
        else if (mode === 'productSelect') {
          console.log('产品模式下一张')
        }

        return { currentIndex: 0 }
      }),
      previous: () => set((state) => {
        const photoStore = usePhotosStore.getState()
        const { setCurrentPhoto, mode } = photoStore

        if (mode === 'preSelect') {
          setCurrentPhoto(Math.max(state.currentIndex - 1, 0))
          return { currentIndex: Math.max(state.currentIndex - 1, 0) }
        }
        else if (mode === 'productSelect') {
          console.log('产品选择模式')
        }

        return { currentIndex: 0 }
      }),
      zoomIn: () => set(state => ({ scale: Math.min(state.scale * 1.2, 3) })),
      zoomOut: () => set(state => ({ scale: Math.max(state.scale / 1.2, 0.5) })),
      resetZoom: () => set({ scale: 1 }),
      rotateLeft: () => set(state => ({ rotate: state.rotate - 90 })),
      rotateRight: () => set(state => ({ rotate: state.rotate + 90 })),
      setCurrentIndex: index => set({ currentIndex: index }),
    }),
    { name: 'PhotoViewerStore' },
  ),
)
