import type { IOrderProduct } from '@/types/order.ts'
import { updateOrderPhotos } from '@/apis/order.ts'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface IType {
  id: number
  name: string
}

export interface IProduct {
  productId: number
  count: number
  title: string
  photo_limit: number
  selected_photos: number[]
  product_type: string
}

interface ProductStore {
  products: IProduct[]
}

interface ProductAction {
  generateProducts: (orderProducts: IOrderProduct[]) => void
  updateProductSelected: (photoId: number, orderProductId: number) => Promise<void>
  removeSelectedByPhotoId: (photoId: number, orderProductId: number) => Promise<void>
  saveSelected: () => void
}

export const useProductsStore = create<ProductStore & ProductAction>()(
  devtools(
    (set, get) => ({
      products: [],
      generateProducts: (orderProducts) => {
        const products = orderProducts.map((orderProduct) => {
          return {
            productId: orderProduct.id,
            title: orderProduct.product.name,
            selected_photos: orderProduct.selected_photos ?? [],
            product_type: orderProduct.product.product_type,
            photo_limit: orderProduct.product.photo_limit,
            count: orderProduct.count,
          }
        })

        set({ products: [...products] })
      },
      updateProductSelected: async (photoId: number, orderProductId: number) => {
        const product = get().products.find(item => item.productId === orderProductId)
        if (!product)
          return

        const { data } = await updateOrderPhotos({ orderProductId, photoIds: [photoId, ...product.selected_photos] })

        // 更新产品照片
        set((state) => {
          const updatedProducts = state.products.map((product) => {
            if (product.productId === orderProductId) {
              return { ...product, selected_photos: [...data.selected_photos] }
            }
            return product
          })

          return { products: updatedProducts }
        })
      },
      removeSelectedByPhotoId: async (photoId: number, orderProductId: number) => {
        const product = get().products.find(item => item.productId === orderProductId)
        if (!product)
          return

        const { data } = await updateOrderPhotos({ orderProductId, photoIds: product.selected_photos.filter(item => item !== photoId) })

        set((state) => {
          const updatedProducts = state.products.map((product) => {
            if (product.productId === orderProductId) {
              return { ...product, selected_photos: [...data.selected_photos] }
            }
            return product
          })
          return { products: updatedProducts }
        })
      },
      saveSelected: () => {

      },
    }),
    {
      name: 'products-store',
      enabled: true,
    },
  ),
)
