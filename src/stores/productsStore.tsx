import type { IOrderProduct } from '@/types/order.ts'
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
  selected: number[]
  product_type: string
}

interface ProductStore {
  products: IProduct[]
}

interface ProductAction {
  generateProducts: (orderProducts: IOrderProduct[]) => void
  updateProductSelected: (photoId: number, productId: number | number[]) => void
  removeSelectedByPhotoId: (productId: number | number[], photoId: number) => void
  saveSelected: () => void
}

export const useProductsStore = create<ProductStore & ProductAction>()(
  devtools(
    set => ({
      products: [],
      generateProducts: (orderProducts) => {
        const products = orderProducts.map((orderProduct) => {
          return {
            productId: orderProduct.id,
            title: orderProduct.product.name,
            total: orderProduct.quantity,
            selected: orderProduct.product.select_photos,
            product_type: orderProduct.product.product_type.name,
          }
        })

        set({ products: [...products] })
      },
      updateProductSelected: (photoId: number, productId: number | number[]) => (
        set((state) => {
          if (Array.isArray(productId)) {
            for (const product of state.products) {
              if (productId.includes(product.productId)) {
                product.selected = [...product.selected, photoId]
              }
            }
          }
          else {
            const product = state.products.find(item => item.productId === productId)
            if (!product)
              return {}
            product.selected = [...product.selected, photoId]
          }

          return { products: [...state.products] }
        })
      ),
      removeSelectedByPhotoId: (productId: number | number[], photoId: number) => {
        set((state) => {
          if (Array.isArray(productId)) {
            for (const product of state.products) {
              if (productId.includes(product.productId)) {
                product.selected = product.selected.filter(id => id !== photoId)
              }
            }
          }
          else {
            const product = state.products.find(item => item.productId === productId)
            if (!product)
              return {}
            product.selected = product.selected.filter(id => id !== photoId)
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
