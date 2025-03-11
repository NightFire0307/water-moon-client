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
  title: string
  total: number
  selected_photos: number[]
  product_type: string
}

interface ProductStore {
  products: IProduct[]
}

interface ProductAction {
  generateProducts: (orderProducts: IOrderProduct[]) => void
  updateProductSelected: (photoId: number, productId: number | number[]) => Promise<void>
  removeSelectedByPhotoId: (productId: number | number[], photoId: number) => void
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
            total: orderProduct.quantity,
            selected_photos: orderProduct.selected_photos ?? [],
            product_type: orderProduct.product.product_type,
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
      removeSelectedByPhotoId: (productId: number | number[], photoId: number) => {
        set((state) => {
          if (Array.isArray(productId)) {
            for (const product of state.products) {
              if (productId.includes(product.productId)) {
                product.selected_photos = product.selected_photos.filter(id => id !== photoId)
              }
            }
          }
          else {
            const product = state.products.find(item => item.productId === productId)
            if (!product)
              return {}
            product.selected_photos = product.selected_photos.filter(id => id !== photoId)
          }
          return { products: [...state.products] }
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
