import type { PhotoInfo } from './Photo.tsx'
import PhotoPreviewGroup from '@/components/Photo/PhotoPreviewGroup.tsx'

import PhotoRemarkModal from '@/components/Photo/PhotoRemarkModal.tsx'
import { usePhotosStore } from '@/stores/photosStore.tsx'
import { useProductsStore } from '@/stores/productsStore.tsx'
import { animated, useTransition } from '@react-spring/web'
import { message } from 'antd'
import { useEffect, useState } from 'react'
import { Photo } from './Photo.tsx'

export function PhotoGrid() {
  const [isRemarkOpen, setIsRemarkOpen] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [photoInfo, setPhotoInfo] = useState<PhotoInfo>({ photoId: -1, name: '' })
  const { updateProductSelected, removeSelectedByPhotoId } = useProductsStore()
  const {
    photos,
    selectedFilter,
    updatePhotoAddTagMenus,
    removeAllMarkedProduct,
    removeMarkedProductByPhotoId,
    updatePhotoRemoveTagMenus,
    updatePhotoMarkedProductTypes,
    generateAddTagMenu,
  } = usePhotosStore()

  const filterPhotos = photos.filter((photo) => {
    if (selectedFilter === 'selected')
      return photo.markedProducts.length > 0
    if (selectedFilter === 'unselected')
      return photo.markedProducts.length === 0
    return true
  })

  const [transitions, api] = useTransition(filterPhotos, () => ({
    from: { opacity: 0, transform: 'scale(0.8)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(0.8)' },
    keys: photo => photo.photoId,
    config: { mass: 1, tension: 280, friction: 60 },
  }))

  useEffect(() => {
    api.start()
  }, [filterPhotos])

  useEffect(() => {
    generateAddTagMenu()
  }, [])

  function handleDropDownClick(key: string, { photoId, name }: PhotoInfo) {
    const [actionType, productId] = key.split('_')

    switch (actionType) {
      case 'addTag':
        updateProductSelected(photoId, +productId)
        updatePhotoAddTagMenus(photoId, +productId)
        updatePhotoRemoveTagMenus(photoId, +productId, false)
        updatePhotoMarkedProductTypes(photoId, +productId)
        break
      case 'removeTag':
        removeSelectedByPhotoId(photoId, +productId)
        updatePhotoAddTagMenus(photoId, +productId, false)
        updatePhotoRemoveTagMenus(photoId, +productId)
        removeMarkedProductByPhotoId(photoId, +productId)
        break
      case 'removeAllTag':
        removeAllMarkedProduct(photoId)
        break
      case 'addNote':
        setIsRemarkOpen(true)
        setPhotoInfo({ photoId, name })
        break
      default:
        message.error('未知操作')
    }
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,_minmax(360px,_1fr))] gap-4 relative">
      <PhotoPreviewGroup
        preview={{
          visible: previewVisible,
          current: currentPhotoIndex,
          onChange: current => setCurrentPhotoIndex(current),
          onVisibleChange: visible => setPreviewVisible((visible)),
        }}
      >
        {
          transitions((style, photo, _, index) => (
            <animated.div key={photo.photoId} style={{ ...style }}>
              <Photo
                photoId={photo.photoId}
                index={index + 1}
                thumbnail_url={photo.thumbnail_url}
                original_url={photo.original_url}
                name={photo.name}
                products={photo.markedProducts}
                remark={photo.remark}
                addProductsMenus={photo.addTagMenus}
                removeProductsMenus={photo.removeTagMenus}
                onDropDownClick={handleDropDownClick}
                onPreviewClick={() => {
                  setPreviewVisible(true)
                  setCurrentPhotoIndex(index)
                }}
              />
            </animated.div>
          ))
        }
      </PhotoPreviewGroup>

      <PhotoRemarkModal
        open={isRemarkOpen}
        photoId={photoInfo.photoId}
        photoName={photoInfo.name}
        onClose={() => setIsRemarkOpen(false)}
      />
    </div>
  )
}
