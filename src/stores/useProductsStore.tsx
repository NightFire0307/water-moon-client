import type { IOrderProduct } from '@/types/order.ts'
import { updateOrderPhotos } from '@/apis/order.ts'
import { CheckOutlined } from '@ant-design/icons'
import { type MenuProps, message } from 'antd'
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
}

interface ProductActions {
  generateProducts: (orderProducts: IOrderProduct[]) => void
  setSelectedPhotoIds: (productId: number, photoIds: number[]) => void
}

export const useProductsStore = create<ProductState & ProductActions>()(
  devtools(
    (set, get) => ({
      products: [],
      generateProducts: orderProducts => set((state) => {
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
        // usePhotosStore.getState().generateDropdownItems(products)

        return {
          products: [...products],
        }
      }),
      setSelectedPhotoIds: (productId, photoIds) => {},
    }),
    {
      name: 'products-store',
    },
  ),
)
