import { createContext, useContext } from 'react'

interface IPhotoViewerContext {
  // 控制缩略图栏的可见性
  thumbnailVisible: boolean
  setThumbnailVisible: (visible: boolean) => void

  // 主视图工具栏的可见性
  viewerControlVisible: boolean
  setViewerControlVisible: (visible: boolean) => void

  // 侧边产品栏的可见性
  productSidebarVisible: boolean
  setProductSidebarVisible: (visible: boolean) => void
}

export const PhotoViewerContext = createContext<IPhotoViewerContext>({
  thumbnailVisible: false,
  setThumbnailVisible: () => { },
  viewerControlVisible: true,
  setViewerControlVisible: () => { },
  productSidebarVisible: false,
  setProductSidebarVisible: () => { },
})

export function usePhotoViewerContext() {
  const context = useContext(PhotoViewerContext)
  if (!context) {
    throw new Error('usePhotoViewerContext must be used within a PhotoViewerContext.Provider')
  }
  return context
}
