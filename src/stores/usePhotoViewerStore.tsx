import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface PhotoViewerState {
  currentIndex: number
  rotate: number
  scale: number
}

interface PhotoViewerActions {
  next: () => void
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

      next: () => set(state => ({ currentIndex: state.currentIndex + 1 })),
      previous: () => set(state => ({ currentIndex: Math.max(state.currentIndex - 1, 0) })),
      zoomIn: () => set(state => ({ scale: Math.min(state.scale * 1.2, 3) })),
      zoomOut: () => set(state => ({ scale: Math.max(state.scale / 1.2, 0.5) })),
      resetZoom: () => set({ scale: 1 }),
      rotateLeft: () => set(state => ({ rotate: state.rotate - 90 })),
      rotateRight: () => set(state => ({ rotate: state.rotate + 90 })),
      setCurrentIndex: currentIndex => set({ currentIndex }),
    }),
    { name: 'PhotoViewerStore' },
  ),
)
