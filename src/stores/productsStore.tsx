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
  // 产品所属类别
  type: string
}

interface ProductStore {
  products: IProduct[]
}

interface ProductAction {
  updateProductSelected: (productId: number, photoId: number) => void
  removeSelectedByPhotoId: (productId: number | number[], photoId: number) => void
}

export const useProductsStore = create<ProductStore & ProductAction>()(
  devtools<ProductStore & ProductAction>(
    set => ({
      products: [
        {
          productId: 1,
          title: '陌上花开48寸大框',
          total: 1,
          selected: [],
          type: '主框',
        },
        {
          productId: 2,
          title: '陌上花开8寸摆台',
          total: 1,
          selected: [],
          type: '摆台',
        },
        {
          productId: 3,
          title: '陌上花开组合框',
          total: 3,
          selected: [],
          type: '组合框',
        },
        {
          productId: 4,
          title: '缘定今生14寸相册',
          total: 25,
          selected: [],
          type: '大册',
        },
        {
          productId: 5,
          title: '缘定今生12寸相册',
          total: 20,
          selected: [],
          type: '小册',
        },
        {
          productId: 6,
          title: '80寸海报',
          total: 1,
          selected: [],
          type: '海报',
        },
      ],
      updateProductSelected: (productId: number, photoId: number) => (
        set((state) => {
          const product = state.products.find(item => item.productId === productId)
          if (!product)
            return {}
          product.selected = [...product.selected, photoId]

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
    }),
    {
      name: 'products-store',
      enabled: true,
    },
  ),
)
