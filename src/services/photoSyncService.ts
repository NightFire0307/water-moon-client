import { updatePreSelectedPhotos, updateProductPhotos } from '@/apis/order'
import { usePhotosStore } from '@/stores/usePhotosStore'

/**
 * 定时隔同步预选照片状态
 * @returns
 */
export async function syncPreSelectedPhotos() {
  console.log('开始同步预选照片')
  const store = usePhotosStore.getState()
  const allPreselectedPhotos = store.getPreSelectedPhotos()
  const changedPhotos = allPreselectedPhotos.filter(photo => photo.dirty)
    .map(photo => ({
      id: photo.photoId,
      status: photo.preSelectStatus,
    }))

  // 如果没有更改的照片则不同步
  if (changedPhotos.length === 0)
    return

  console.log('同步预选照片:', changedPhotos)
  // TODO: 调用API同步预选照片状态

  try {
    await updatePreSelectedPhotos({ photos: changedPhotos })

    store.setPreSelectedPhotos(
      new Map([...store.preSelectedPhotos.entries()].map(([photoId, photo]) => (
        [photoId, {
          ...photo,
          dirty: false, // 同步成功后重置脏数据标记
        }]
      ))),
    )
  }
  catch (err) {
    return Promise.reject(err)
  }
}

/**
 * 定时间隔同步产品照片状态
 */
export async function syncProductPhotos() {
  const store = usePhotosStore.getState()
  const photoMap = new Map<number, { id: number, remark?: string }[]>()
  const productSelectedPhotos = store.getProductSelectedPhotos()
  const changedProductPhotos = productSelectedPhotos.filter(photo => photo.dirty)

  for (const change of changedProductPhotos) {
    change.selectedProducts.forEach((productId) => {
      if (photoMap.has(productId)) {
        photoMap.get(productId)?.push({ id: change.photoId, remark: change.remark })
      }
      else {
        photoMap.set(productId, [{ id: change.photoId, remark: change.remark }])
      }
    })
  }

  console.log('准备同步产品照片', photoMap)

  if (photoMap.size === 0)
    return

  // 将Map转换为数据格式
  const items = Array.from(photoMap.entries())
    .map(([orderProductId, photos]) => ({ orderProductId, photos }))
  console.log('同步产品照片:', items)

  // TODO: 调用API同步产品照片状态
  try {
    await updateProductPhotos({ items })

    // 同步成功后，重置脏数据标记
    store.setProductSelectedPhotos(
      new Map([...store.productSelectedPhotos.entries()].map(([photoId, photo]) => (
        [photoId, {
          ...photo,
          dirty: false, // 同步成功后重置脏数据标记
        }]
      ))),
    )
  }
  catch (err) {
    console.error('同步产品照片失败:', err)
  }
}
