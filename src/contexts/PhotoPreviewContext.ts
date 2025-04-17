import type { PhotoProps } from '@/components/Photo/Photo.tsx'
import { createContext, useContext } from 'react'

interface PhotoPreviewContextValue {
  registerPhoto: (photo: PhotoProps) => void
}

export const PhotoPreviewContext = createContext<PhotoPreviewContextValue | null>(null)

export function usePhotoPreviewContext() {
  const context = useContext(PhotoPreviewContext)
  if (!context) {
    throw new Error('usePhotoPreviewContext must be used within a PhotoPreviewProvider')
  }
  return context
}
