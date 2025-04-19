import type { MenuItemType } from 'antd/es/menu/interface'
import type { WritableDraft } from 'immer'
import type { IProduct } from './useProductsStore.tsx'
import { getOrderPhotos, removeAllTags } from '@/apis/order.ts'
import { CheckOutlined } from '@ant-design/icons'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { useProductsStore } from './useProductsStore.tsx'

export interface IPhoto {
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
  photos: IPhoto[]
  isLoading: boolean
  filteredPhotos: IPhoto[]
  selectedFilter: FILTER_TYPE
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
  removeAllMarkedProduct: (photoId: number) => void
  // 更新照片备注
  updatePhotoRemark: (photoId: number, remark: string) => void
  // 根据产品ID过滤照片
  filterPhotoByProductId: (productId: number) => void
  // 清空过滤照片列表
  clearFilterPhotos: () => void
  // 获取照片列表
  getDisplayPhotos: () => IPhoto[]
  // 设置加载状态
  setLoading: (isLoading: boolean) => void
}

const BATCH_SIZE = 5

export const usePhotosStore = create<UsePhotosStore & PhotosAction>()(

  immer((set, get) => ({
    photos: [],
    isLoading: true,
    filteredPhotos: [],
    selectedFilter: FILTER_TYPE.ALL,
    fetchPhotos: async () => {
      const products = useProductsStore.getState().products
      const { data } = await getOrderPhotos()
      const allList = data.list
      const photos: IPhoto[] = []

      for (const photo of allList.slice(0, BATCH_SIZE)) {
        photos.push({
          photoId: photo.id,
          thumbnail_url: photo.thumbnail_url,
          original_url: photo.original_url,
          name: photo.file_name,
          remark: photo.remark ?? '',
          markedProducts: products.filter(product => product.selected_photos.includes(photo.id)),
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
        })
      }

      set({ photos, isLoading: false })

      // 异步加载后续照片
      const appendPhotos = async (startIndex: number) => {
        const nextBatch = allList.slice(startIndex, startIndex + BATCH_SIZE)
        if (nextBatch.length === 0)
          return

        const newPhotos: IPhoto[] = []
        for (const photo of nextBatch) {
          newPhotos.push({
            photoId: photo.id,
            thumbnail_url: photo.thumbnail_url,
            original_url: photo.original_url,
            name: photo.file_name,
            remark: photo.remark ?? '',
            markedProducts: products.filter(product => product.selected_photos.includes(photo.id)),
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
          })
        }

        set((state) => {
          state.photos = [...state.photos, ...newPhotos as WritableDraft<IPhoto>[]]
        })
        requestIdleCallback(() => appendPhotos(startIndex + BATCH_SIZE))
      }

      requestIdleCallback(() => appendPhotos(BATCH_SIZE))
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
        const product = useProductsStore.getState().products.find(product => product.productId === productId)
        if (photo && product) {
          photo.markedProducts = [...photo.markedProducts, product]
        }
      })
    ),
    updatePhotoAddTagMenus: (photoId: number, productId: number, disable?: boolean) => (
      set((state) => {
        const photo = state.photos.find(photo => photo.photoId === photoId)
        if (photo) {
          for (const menu of photo.addTagMenus) {
            const key = (menu.key as string).split('_')[1]
            if (Number(key) === productId) {
              menu.disabled = disable ?? true
              menu.icon = disable === undefined ? <CheckOutlined /> : ''
            }
          }
        }
      })
    ),
    updatePhotoRemoveTagMenus: (photoId: number, productId: number, disable?: boolean) => (
      set((state) => {
        const photo = state.photos.find(photo => photo.photoId === photoId)

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
  })),

)
