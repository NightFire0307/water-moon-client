import type { IPhoto } from '@/types/photos.ts'
import type { MenuItemType } from 'antd/es/menu/interface'
import type { IProduct } from './useProductsStore.tsx'
import { getOrderPhotos, removeAllTags } from '@/apis/order.ts'
import { CheckOutlined } from '@ant-design/icons'
import { current, type WritableDraft } from 'immer'
import { cloneDeep } from 'lodash-es'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { useProductsStore } from './useProductsStore.tsx'

export interface Photo {
  photoId: number
  original_url: string
  thumbnail_url: string
  name: string
  remark: string
  markedProducts: IProduct[]
  addTagMenus: MenuItemType[]
  removeTagMenus: MenuItemType[]
}

interface UsePhotosStore {
  photos: Photo[]
  isLoading: boolean
  filteredPhotos: Photo[]
  selectedFilter: FILTER_TYPE
  previousPhotosData: Record<number, Omit<Photo, 'original_url' | 'thumbnail_url' | 'name' | 'photoId'>>
}

export enum FILTER_TYPE {
  ALL = 'all',
  SELECTED = 'selected',
  UNSELECTED = 'unselected',
}

interface PhotosAction {
  fetchPhotos: () => Promise<void>
  generateAddTagMenu: () => void
  filterPhotos: (value: FILTER_TYPE) => void
  // 更新照片制作产品的类型
  updatePhotoMarkedProductTypes: (photoId: number, productId: number) => void
  // 更新标签菜单
  updatePhotoAddTagMenus: (photoId: number, productId: number, disable?: boolean) => void
  // 更新标签菜单
  updatePhotoRemoveTagMenus: (photoId: number, productId: number, disable?: boolean) => void
  // 移除已标记的产品
  removePhotoRemoveTagMenus: (photoId: number, productId: number) => void
  // 移除照片制作产品的类型
  removeMarkedProductByPhotoId: (photoId: number, productId: number) => void
  // 移除当前照片所有已标记的产品
  removeAllMarkedProduct: (photoId: number) => Promise<void>
  // 更新照片备注
  updatePhotoRemark: (photoId: number, remark: string) => void
  // 根据产品ID过滤照片
  filterPhotoByProductId: (productId: number) => void
  // 清空过滤照片列表
  clearFilterPhotos: () => void
  // 获取照片列表
  getDisplayPhotos: () => Photo[]
  // 设置加载状态
  setLoading: (isLoading: boolean) => void
  // 还原上一次的数据
  restorePreviousPhotoData: (photoId: number) => void
}

const BATCH_SIZE = 10

export const usePhotosStore = create<UsePhotosStore & PhotosAction>()(
  devtools(
    immer((set, get) => ({
      photos: [],
      isLoading: true,
      filteredPhotos: [],
      selectedFilter: FILTER_TYPE.ALL,
      previousPhotosData: {},
      fetchPhotos: async () => {
      // 设置加载状态
        set({ isLoading: true })

        try {
          const products = useProductsStore.getState().products
          const { data } = await getOrderPhotos()
          const allList = data.list
          const photos: Photo[] = []

          // 创建照片对象的公共方法
          const createPhotoObject = (photo: IPhoto, products: IProduct[]): Photo => {
            const selectedProducts = products.filter(p => p.selected_photos.includes(photo.id))

            return {
              photoId: photo.id,
              thumbnail_url: photo.thumbnail_url,
              original_url: photo.original_url,
              name: photo.file_name,
              remark: photo.remark ?? '',
              markedProducts: selectedProducts,
              addTagMenus: products.map(product => ({
                label: product.title,
                key: `addTag_${product.productId}`,
                disabled: product.selected_photos.includes(photo.id),
              })),
              removeTagMenus: products.map(product => ({
                label: product.title,
                key: `removeTag_${product.productId}`,
                disabled: !product.selected_photos.includes(photo.id),
              })),
            }
          }

          // 第一阶段：使用rAF加载首屏可见照片（高优先级）
          const loadInitialBatch = () => {
            const initialBatch = allList.slice(0, BATCH_SIZE)

            for (const photo of initialBatch) {
              photos.push(createPhotoObject(photo, products))
            }

            set({ photos, isLoading: false })

            // 启动第二阶段空闲时加载
            if (allList.length > BATCH_SIZE) {
              requestIdleCallback(() => loadRemainingPhotos(BATCH_SIZE), { timeout: 1000 })
            }
          }

          // 第二阶段：使用rIC加载剩余照片（低优先级）
          function loadRemainingPhotos(startIndex: number) {
            const idleCallback = (deadline: IdleDeadline) => {
              const batch: Photo[] = []
              let i = startIndex

              // 在空闲时间内处理尽可能多的照片
              while (i < allList.length && (deadline.timeRemaining() > 0 || deadline.didTimeout)) {
                batch.push(createPhotoObject(allList[i], products))
                i++
              }

              // 更新状态
              if (batch.length > 0) {
                set(state => ({
                  photos: [...state.photos, ...batch as WritableDraft<Photo>[]],
                }))
              }

              // 如果还有剩余照片，继续调度
              if (i < allList.length) {
                requestIdleCallback(() => loadRemainingPhotos(i), { timeout: 1000 })
              }
            }

            requestIdleCallback(idleCallback, { timeout: 1000 })
          }

          // 启动初始加载
          requestAnimationFrame(loadInitialBatch)
        }
        catch (error) {
          console.error('Failed to fetch photos:', error)
          set({ isLoading: false })
        }
      },
      filterPhotos: (value: FILTER_TYPE) => (set({ selectedFilter: value })),
      generateAddTagMenu: () => (
        set((state) => {
          const products = useProductsStore.getState().products
          for (const photo of state.photos) {
            const dropdownMenus: MenuItemType[] = []
            for (const product of products) {
              const isSelect = product.selected_photos.includes(photo.photoId)
              dropdownMenus.push({
                label: product.title,
                key: `addTag_${product.productId}`,
                disabled: isSelect,
                icon: isSelect ? <CheckOutlined /> : '',
              })
            }
            photo.addTagMenus = dropdownMenus as WritableDraft<MenuItemType>[]
          }
        })
      ),
      updatePhotoMarkedProductTypes: (photoId: number, productId: number) => (
        set((state) => {
          const photo = state.photos.find(photo => photo.photoId === photoId)

          // 保存旧数据
          state.previousPhotosData[photoId] = {
            remark: photo?.remark ?? '',
            markedProducts: cloneDeep(photo?.markedProducts ?? []),
            addTagMenus: cloneDeep(photo?.addTagMenus ?? []),
            removeTagMenus: cloneDeep(photo?.removeTagMenus ?? []),
          }

          const product = useProductsStore.getState().products.find(product => product.productId === productId)
          if (photo && product) {
            photo.markedProducts = [...photo.markedProducts, product]
          }
        })
      ),
      updatePhotoAddTagMenus: (photoId: number, productId: number, disable?: boolean) => (
        set((state) => {
          const photo = state.photos.find(photo => photo.photoId === photoId)

          if (!photo)
            return

          const rawPhoto = current(photo)
          // 保存旧数据
          state.previousPhotosData[photoId] = {
            remark: rawPhoto.remark,
            markedProducts: cloneDeep(rawPhoto.markedProducts),
            addTagMenus: cloneDeep(rawPhoto.addTagMenus),
            removeTagMenus: cloneDeep(rawPhoto.removeTagMenus),
          }

          // 深拷贝 addTagMenus 后再修改
          const updatedAddTagMenus = cloneDeep(rawPhoto.addTagMenus)
          for (const menu of updatedAddTagMenus) {
            const key = (menu.key as string).split('_')[1]
            if (Number(key) === productId) {
              menu.disabled = disable ?? false
              menu.icon = disable === undefined ? <CheckOutlined /> : ''
            }
          }

          // 更新 photo 的 addTagMenus
          photo.addTagMenus = [...updatedAddTagMenus]
        })
      ),
      updatePhotoRemoveTagMenus: (photoId: number, productId: number, disable?: boolean) => (
        set((state) => {
          const photo = state.photos.find(photo => photo.photoId === photoId)

          // 保存旧数据
          state.previousPhotosData[photoId] = {
            remark: photo?.remark ?? '',
            markedProducts: cloneDeep(photo?.markedProducts ?? []),
            addTagMenus: cloneDeep(photo?.addTagMenus ?? []),
            removeTagMenus: cloneDeep(photo?.removeTagMenus ?? []),
          }

          if (photo) {
            for (const menu of photo.removeTagMenus) {
              const key = (menu.key as string).split('_')[1]
              if (Number(key) === productId) {
                menu.disabled = disable ?? true
                break
              }
            }
          }
        })
      ),
      removePhotoRemoveTagMenus: (photoId: number, productId: number) => (
        set((state) => {
          const photo = state.photos.find(photo => photo.photoId === photoId)

          // 保存旧数据
          state.previousPhotosData[photoId] = {
            remark: photo?.remark ?? '',
            markedProducts: cloneDeep(photo?.markedProducts ?? []),
            addTagMenus: cloneDeep(photo?.addTagMenus ?? []),
            removeTagMenus: cloneDeep(photo?.removeTagMenus ?? []),
          }

          if (photo) {
            photo.removeTagMenus = photo.removeTagMenus.filter((menu) => {
              const key = (menu.key as string).split('_')[1]
              return productId !== Number(key)
            })
          }
        })
      ),
      removeMarkedProductByPhotoId: (photoId: number, productId: number) => (
        set((state) => {
          const photo = state.photos.find(photo => photo.photoId === photoId)

          // 保存旧数据

          if (photo) {
          // 移除已标记的产品
            photo.markedProducts = photo.markedProducts.filter(product => product.productId !== productId)

            // 重置添加标签菜单
            for (const menus of photo.addTagMenus) {
              if (Number(menus.key) === productId) {
                menus.disabled = false
                menus.icon = ''
              }
            }
          }
        })
      ),
      removeAllMarkedProduct: async (photoId: number) => {
        const removeSelectedByPhotoId = useProductsStore.getState().removeSelectedByPhotoId
        // 移除当前照片所有已标记的产品
        await removeAllTags(photoId)

        set((state) => {
          const photo = state.photos.find(photo => photo.photoId === photoId)

          // 保存旧数据
          state.previousPhotosData[photoId] = {
            remark: photo?.remark ?? '',
            markedProducts: cloneDeep(photo?.markedProducts ?? []),
            addTagMenus: cloneDeep(photo?.addTagMenus ?? []),
            removeTagMenus: cloneDeep(photo?.removeTagMenus ?? []),
          }

          if (photo) {
            for (const markedProduct of photo.markedProducts) {
              removeSelectedByPhotoId(photoId, markedProduct.productId)
              get().updatePhotoAddTagMenus(photoId, markedProduct.productId, false)
            }
            photo.markedProducts = []
          }
        })
      },
      updatePhotoRemark: (photoId: number, remark: string) => (
        set((state) => {
          const photo = state.photos.find(photo => photo.photoId === photoId)

          // 保存旧数据
          state.previousPhotosData[photoId] = {
            remark: photo?.remark ?? '',
            markedProducts: cloneDeep(photo?.markedProducts ?? []),
            addTagMenus: cloneDeep(photo?.addTagMenus ?? []),
            removeTagMenus: cloneDeep(photo?.removeTagMenus ?? []),
          }

          if (photo) {
            photo.remark = remark
          }
          return ({ photos: [...state.photos] })
        })
      ),
      filterPhotoByProductId: (productId: number) => (
        set((state) => {
          const filteredPhotos = state.photos.filter((photo) => {
            return photo.markedProducts.some(product => product.productId === productId)
          })

          return {
            filteredPhotos: [...filteredPhotos],
          }
        })
      ),
      clearFilterPhotos: () => (
        set(() => {
          return {
            filteredPhotos: [],
          }
        })
      ),
      getDisplayPhotos: () => {
        return get().filteredPhotos.length > 0 ? get().filteredPhotos : get().photos
      },
      setLoading: (isLoading: boolean) => (
        set(() => {
          return { isLoading }
        })
      ),
      restorePreviousPhotoData: (photoId: number) => {
        set((state) => {
          const photo = state.photos.find(photo => photo.photoId === photoId)
          if (photo) {
            const previousData = state.previousPhotosData[photoId]
            console.log(current(previousData))
            if (previousData) {
              photo.remark = previousData.remark
              photo.markedProducts = cloneDeep(previousData.markedProducts)
              photo.addTagMenus = cloneDeep(previousData.addTagMenus)
              photo.removeTagMenus = cloneDeep(previousData.removeTagMenus)
            }
          }
        })
      },
    })),
    {
      name: 'photos-store',
      enabled: true,
    },
  ),
)
