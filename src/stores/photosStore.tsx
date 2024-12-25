import type { MenuProps } from 'antd'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface IPhoto {
  photoId: number
  src: string
  name: string
  markedProductTypes: string[]
  dropdownMenus: MenuProps['items']
}

interface PhotosStore {
  photos: IPhoto[]
}

interface PhotosAction {
  updatePhotoMarkedProductTypes: (photoId: number, productType: string) => void
  updatePhotoDropdownMenus: (photoId: number, productsMenu: MenuProps['items']) => void
}

export const usePhotosStore = create<PhotosStore & PhotosAction>()(
  devtools<PhotosStore & PhotosAction>(
    set => ({
      photos: [
        {
          photoId: 11,
          src: 'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp',
          name: '123.jpg',
          markedProductTypes: [],
          dropdownMenus: [],
        },
        {
          photoId: 22,
          src: 'https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473091540282-9b846e7965e3.webp',
          name: '456.jpg',
          markedProductTypes: [],
          dropdownMenus: [],
        },
        {
          photoId: 33,
          src: 'https://gw.alipayobjects.com/zos/antfincdn/x43I27A55%26/photo-1438109491414-7198515b166b.webp',
          name: '789.jpg',
          markedProductTypes: [],
          dropdownMenus: [],
        },
      ],
      updatePhotoMarkedProductTypes: (photoId: number, productType: string) => ({}),
      updatePhotoDropdownMenus: (photoId: number, productsMenu: MenuProps['items']) => ({}),
    }),
    {
      name: 'photos-store',
      enabled: true,
    },
  ),
)
