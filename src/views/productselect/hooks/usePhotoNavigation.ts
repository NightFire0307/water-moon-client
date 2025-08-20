import { FILTER_TYPE, usePhotosStore } from '@/stores/usePhotosStore'
import { usePhotoViewerStore } from '@/stores/usePhotoViewerStore'
import { useProductsStore } from '@/stores/useProductsStore'
import { useEffect, useMemo } from 'react'

export function usePhotoNavigation() {
  const { productSelectedPhotos, filter, setCurrentPhoto } = usePhotosStore()
  const { currentIndex, previous, next } = usePhotoViewerStore()
  const { setDropdownMenuStatus } = useProductsStore()

  //  过滤照片列表
  // 根据当前的过滤条件，返回符合条件的照片列表
  const filteredPhotos = useMemo(() => {
    const { productId, filterType } = filter

    // 过滤指定产品的照片
    if (filterType === FILTER_TYPE.SELECTED && productId !== undefined) {
      return productSelectedPhotos.filter((photo) => {
        return photo.selectedProducts.includes(productId)
      })
    }

    // 过滤已选的照片
    if (filterType === FILTER_TYPE.SELECTED && productId === undefined) {
      return productSelectedPhotos.filter((photo) => {
        return photo.selectedProducts.length > 0
      })
    }

    // 过滤未选的照片
    if (filterType === FILTER_TYPE.UNSELECTED && productId === undefined) {
      return productSelectedPhotos.filter((photo) => {
        return photo.selectedProducts.length === 0
      })
    }

    return productSelectedPhotos
  }, [filter, productSelectedPhotos])

  function handleNextPhoto() {
    if (currentIndex < filteredPhotos.length - 1) {
      const nextPhoto = filteredPhotos[currentIndex + 1]
      setCurrentPhoto(nextPhoto)
      setDropdownMenuStatus(nextPhoto.selectedProducts)
      next()
    }
  }

  function handlePreviousPhoto() {
    if (currentIndex !== 0) {
      const previousPhoto = filteredPhotos[currentIndex - 1]
      setCurrentPhoto(previousPhoto)
      setDropdownMenuStatus(previousPhoto.selectedProducts)
      previous()
    }
  }

  // 监听过滤后的照片变化，自动设置当前第一张照片
  useEffect(() => {
    if (filteredPhotos.length > 0) {
      const firstPhoto = filteredPhotos[0]
      setCurrentPhoto(firstPhoto)
    }
    else {
      setCurrentPhoto(null)
    }
  }, [filteredPhotos, setCurrentPhoto])

  return {
    filteredPhotos,
    handleNextPhoto,
    handlePreviousPhoto,
  }
}
