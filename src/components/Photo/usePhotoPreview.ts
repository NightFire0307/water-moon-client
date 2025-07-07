import type { PhotoProps } from '@/components/Photo/Photo.tsx'
import type { PhotoPreviewGroupType } from '@/components/Photo/PhotoPreviewGroup'
import { useCallback, useRef, useState } from 'react'

export interface PreviewState {
  open: boolean
  imgSrc: string
  scale: number
  bounds: {
    left: number
    top: number
    bottom: number
    right: number
  }
  imgLoaded: boolean
}

export function usePhotoPreview(previewGroup?: PhotoPreviewGroupType) {
  const [images, setImages] = useState<PhotoProps[]>([])
  const [previewState, setPreviewState] = useState<PreviewState>({
    open: false,
    imgSrc: '',
    scale: 1,
    bounds: { left: 0, top: 0, bottom: 0, right: 0 },
    imgLoaded: true,
  })
  const [remarkOpen, setRemarkOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const registerPhoto = useCallback((image: PhotoProps) => {
    setImages(prev => [...prev, image])
  }, [])

  const clamp = useCallback((value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value)), [])

  const handlePrev = useCallback(() => {
    if (previewGroup?.onChange && previewGroup?.current !== undefined) {
      const newIndex = clamp(previewGroup.current - 1, 0, images.length - 1)
      previewGroup.onChange(newIndex, previewGroup.current)
    }
  }, [previewGroup, images.length, clamp])

  const handleNext = useCallback(() => {
    if (previewGroup?.onChange && previewGroup?.current !== undefined) {
      const newIndex = clamp(previewGroup.current + 1, 0, images.length - 1)
      previewGroup.onChange(newIndex, previewGroup.current)
    }
  }, [previewGroup, images.length, clamp])

  const handleClose = useCallback(() => {
    setDropdownOpen(false)
    setTimeout(() => {
      setPreviewState(prev => ({ ...prev, scale: 1 }))
      if (previewGroup?.onVisibleChange) {
        previewGroup.onVisibleChange(false)
      }
      else {
        setPreviewState(prev => ({ ...prev, open: false }))
      }
    }, 0)
  }, [previewGroup])

  const handleZoom = useCallback((factor: number) => {
    setPreviewState(prev => ({
      ...prev,
      scale: Math.max(1, Math.min(prev.scale * factor, 1.8)),
    }))
  }, [])

  return {
    images,
    previewState,
    setPreviewState,
    remarkOpen,
    setRemarkOpen,
    dropdownOpen,
    setDropdownOpen,
    imgRef,
    containerRef,
    registerPhoto,
    handlePrev,
    handleNext,
    handleClose,
    handleZoom,
  }
}
