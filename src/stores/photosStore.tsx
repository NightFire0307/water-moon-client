import type { MenuItemType } from 'antd/es/menu/interface'
import type { IProduct } from './productsStore.tsx'
import { CheckOutlined } from '@ant-design/icons'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { useProductsStore } from './productsStore.tsx'

export interface IPhoto {
  photoId: number
  src: string
  name: string
  markedProducts: IProduct[]
  addTagMenus: MenuItemType[]
  removeTagMenus: MenuItemType[]
}

interface PhotosStore {
  photos: IPhoto[]
}

interface PhotosAction {
  generateAddTagMenu: () => void
  updatePhotoMarkedProductTypes: (photoId: number, productId: number) => void
  updatePhotoAddTagMenus: (photoId: number, productId: number) => void
  updatePhotoRemoveTagMenus: (photoId: number, productId: number) => void
  removeAllPhotoTagMenus: (photoId: number) => void
}

export const usePhotosStore = create<PhotosStore & PhotosAction>()(
  devtools<PhotosStore & PhotosAction>(
    set => ({
      photos: [
        {
          photoId: 11,
          src: 'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp',
          name: '123.jpg',
          markedProducts: [],
          addTagMenus: [],
          removeTagMenus: [],
        },
        {
          photoId: 22,
          src: 'https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473091540282-9b846e7965e3.webp',
          name: '456.jpg',
          markedProducts: [],
          addTagMenus: [],
          removeTagMenus: [],
        },
        {
          photoId: 33,
          src: 'https://gw.alipayobjects.com/zos/antfincdn/x43I27A55%26/photo-1438109491414-7198515b166b.webp',
          name: '789.jpg',
          markedProducts: [],
          addTagMenus: [],
          removeTagMenus: [],
        },
      ],
      generateAddTagMenu: () => (
        set((state) => {
          const products = useProductsStore.getState().products
          for (const photo of state.photos) {
            const dropdownMenus: MenuItemType[] = []
            for (const product of products) {
              const isSelect = product.selected.includes(photo.photoId)
              dropdownMenus.push({
                label: product.title,
                key: product.productId.toString(),
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
      updatePhotoAddTagMenus: (photoId: number, productId: number) => (
        set((state) => {
          const photo = state.photos.find(photo => photo.photoId === photoId)
          if (photo) {
            for (const menu of photo.addTagMenus) {
              if (Number(menu.key) === productId) {
                menu.disabled = true
                menu.icon = <CheckOutlined />
              }
            }
          }

          return { photos: [...state.photos] }
        })
      ),
      updatePhotoRemoveTagMenus: (photoId: number, productId: number) => (
        set((state) => {
          const photo = state.photos.find(photo => photo.photoId === photoId)

          if (photo) {
            for (const menu of photo.addTagMenus) {
              if (productId === Number(menu.key)) {
                photo.removeTagMenus.push({ ...menu, disabled: false, icon: '' })
                break
              }
            }
          }
          return { photos: [...state.photos] }
        })
      ),
      removeAllPhotoTagMenus: (photoId: number) => {
        set((state) => {
          const removeSelectedByPhotoId = useProductsStore.getState().removeSelectedByPhotoId
          const photo = state.photos.find(photo => photo.photoId === photoId)
          if (photo) {
            for (const menus of photo.addTagMenus) {
              menus.disabled = false
              menus.icon = ''

              removeSelectedByPhotoId(Number(menus.key), photoId)
            }
          }

          return { photos: [...state.photos] }
        })
      },
    }),
    {
      name: 'photos-store',
      enabled: true,
    },
  ),
)
