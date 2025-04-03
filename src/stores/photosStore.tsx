import type { MenuItemType } from 'antd/es/menu/interface'
import type { IProduct } from './productsStore.tsx'
import { getOrderPhotos, removeAllTags } from '@/apis/order.ts'
import { CheckOutlined } from '@ant-design/icons'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { useProductsStore } from './productsStore.tsx'

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

interface PhotosStore {
  photos: IPhoto[]
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
  updatePhotoRemark: (photoId: number, remark: string) => void
}

export const usePhotosStore = create<PhotosStore & PhotosAction>()(
  devtools(
    (set, get) => ({
      photos: [],
      selectedFilter: FILTER_TYPE.ALL,
      fetchPhotos: async () => {
        const products = useProductsStore.getState().products
        const { data } = await getOrderPhotos()
        const photos: IPhoto[] = []

        for (const photo of data) {
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

        set({ photos })
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
            photo.addTagMenus = dropdownMenus
          }
          return { photos: [...state.photos] }
        })
      ),
      updatePhotoMarkedProductTypes: (photoId: number, productId: number) => (
        set((state) => {
          const photo = state.photos.find(photo => photo.photoId === photoId)
          const product = useProductsStore.getState().products.find(product => product.productId === productId)
          if (photo && product) {
            photo.markedProducts = [...photo.markedProducts, product]
          }

          return { photos: [...state.photos] }
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

          return { photos: [...state.photos] }
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
          return { photos: [...state.photos] }
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

          return { photos: [...state.photos] }
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

          return { photos: [...state.photos] }
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
          return { photos: [...state.photos] }
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
    }),
    {
      name: 'photos-store',
      enabled: true,
    },
  ),
)
