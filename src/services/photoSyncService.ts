import { usePhotosStore } from '@/stores/usePhotosStore'

/**
 * 定时隔同步预选照片状态
 * @returns
 */
export async function syncPreSelectedPhotos() {
  const store = usePhotosStore.getState()
  const changedPhotos = store.preSelectedPhotos.filter(photo => photo.dirty)
    .map(photo => ({
      id: photo.photoId,
      status: photo.preSelectStatus,
    }))

  console.log('准备同步预选照片:', changedPhotos)

  // 如果没有更改的照片则不同步
  if (changedPhotos.length === 0)
    return

  console.log('同步预选照片:', changedPhotos)
  // TODO: 调用API同步预选照片状态

  store.setPreSelectedPhotos(
    store.preSelectedPhotos.map((photo) => {
      return photo.dirty ? { ...photo, dirty: false } : photo
    }),
  )
}
