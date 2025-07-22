import type { IOrderProduct } from '@/types/order.ts'
import type { MenuProps } from 'antd'
import { updateOrderPhotos } from '@/apis/order.ts'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { usePhotosStore } from './usePhotosStore'

export interface IType {
  id: number
  name: string
}

export interface IProduct {
  productId: number
  name: string
  productType: string
  photoLimit: number
  selectedPhotoIds: number[]
  allowOverLimit: boolean
  remark: string
}

interface ProductState {
  products: IProduct[]
  dropDownItems: MenuProps['items']
}

interface ProductActions {
  generateProducts: (orderProducts: IOrderProduct[]) => void
  generateDropDownItems: (products: IProduct[]) => MenuProps['items']
  updateProductSelected: (photoId: number, orderProductId: number) => Promise<void>
  removeSelectedByPhotoId: (photoId: number, orderProductId: number) => Promise<void>
  saveSelected: () => void
}

export const useProductsStore = create<ProductState & ProductActions>()(
  devtools(
    (set, get) => ({
      products: [],
      dropDownItems: [],
      generateProducts: orderProducts => set(() => {
        const products = orderProducts.map(product => ({
          productId: product.product.id,
          name: product.product.name,
          productType: product.product.product_type,
          photoLimit: product.product.photo_limit,
          selectedPhotoIds: product.selected_photos,
          allowOverLimit: product.product.photo_limit === 0,
          remark: product.remark || '',
        }))

        // 生成下拉菜单项
        get().generateDropDownItems(products)
        return {
          products: [...products],
        }
      }),
      generateDropDownItems: (products) => {
        set(() => {
          return {
            dropDownItems: products.map(product => ({
              key: product.productId,
              label: product.name,
              extra: `${product.selectedPhotoIds.length}/${product.photoLimit}`,
            })),
          }
        })
      },
      updateProductSelected: () => {},
      removeSelectedByPhotoId: () => {},
    }),
  ),
)
