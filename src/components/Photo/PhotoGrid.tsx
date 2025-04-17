import type { PhotoInfo } from './Photo.tsx'
import PhotoPreviewGroup from '@/components/Photo/PhotoPreviewGroup.tsx'

import PhotoRemarkModal from '@/components/Photo/PhotoRemarkModal.tsx'
import { usePhotosStore } from '@/stores/usePhotosStore.tsx'
import { useProductsStore } from '@/stores/useProductsStore.tsx'
import { message } from 'antd'
import { useEffect, useState } from 'react'
import { Flipped, Flipper } from 'react-flip-toolkit'
import { Photo } from './Photo.tsx'

export function PhotoGrid() {
  const [isRemarkOpen, setIsRemarkOpen] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [photoInfo, setPhotoInfo] = useState<PhotoInfo>({ photoId: -1, name: '' })
  const { updateProductSelected, removeSelectedByPhotoId } = useProductsStore()
  const {
    updatePhotoAddTagMenus,
    removeAllMarkedProduct,
    removeMarkedProductByPhotoId,
    updatePhotoRemoveTagMenus,
    updatePhotoMarkedProductTypes,
    generateAddTagMenu,
  } = usePhotosStore()
  const photos = usePhotosStore(state => state.getDisplayPhotos())

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
    <Flipper flipKey={photos.map(p => p.photoId).join('-')}>
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
            photos.map((photo, index) => (
              <Flipped
                key={photo.photoId}
                flipId={photo.photoId}
                onAppear={(el) => {
                  el.animate([
                    { opacity: 0, transform: 'scale(0.9)' },
                    { opacity: 1, transform: 'scale(1)' },
                  ], {
                    duration: 300,
                    easing: 'ease',
                    fill: 'both',
                  })
                }}
                onExit={(el, _, removeElement) => {
                  el.animate([
                    { opacity: 1, transform: 'scale(1)' },
                    { opacity: 0, transform: 'scale(0.9)' },
                  ], {
                    duration: 300,
                    easing: 'ease',
                  }).onfinish = removeElement
                }}
              >
                {flippedProps => (
                  <Photo
                    {...flippedProps} // 注入必要的 props
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
                )}
              </Flipped>
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

    </Flipper>
  )
}
