import type { IOrderProduct } from '@/types/order.ts'
import { updateOrderPhotos } from '@/apis/order.ts'
import { CheckOutlined } from '@ant-design/icons'
import { message } from 'antd'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
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
  productMenu: {
    key: string
    label: string
    icon?: React.ReactNode
    extra?: string
  }[]
}

interface ProductActions {
  generateProducts: (orderProducts: IOrderProduct[]) => void // 生成产品列表
  generateDropdownItems: (products: IProduct[]) => void // 生成下拉菜单项
  setSelectedPhotoIds: (productId: number, photoId: number) => void // 产品设置选中照片ID
  dropdownMenuClick: ({ key }: { key: string }) => void // 下拉菜单点击事件
  setDropdownMenuStatus: (selectedProducts: number[]) => void // 设置下拉菜单状态(当切换照片时需要调用一次)
}

export const useProductsStore = create<ProductState & ProductActions>()(
  persist(

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
          state.generateDropdownItems(products)

          return {
            products: [...products],
          }
        }),
        generateDropdownItems: (products) => {
          set({
            productMenu: products.map(product => ({
              key: product.productId.toString(),
              label: product.name,
            })),
          })
        },
        dropdownMenuClick: ({ key }) => {
          const productId = Number(key)
          const state = get()
          const currentPhoto = usePhotosStore.getState().currentPhoto

          if (!currentPhoto) {
            message.info('请先选择一张照片')
            return state
          }

          console.log(currentPhoto)

          /**
           * 状态更新逻辑：
           * 1. 更新产品的选中照片ID
           * 2. 更新下拉菜单状态
           * 3. 更新照片的选中产品
           */
          state.setSelectedPhotoIds(productId, currentPhoto.photoId)

          // 更新下拉菜单状态
          const newSelectedProducts = currentPhoto.selectedProducts.includes(productId)
            ? currentPhoto.selectedProducts.filter(id => id !== productId)
            : [...currentPhoto.selectedProducts, productId]

          state.setDropdownMenuStatus(newSelectedProducts)

          // 更新照片的选中产品
          usePhotosStore.getState().setPhotoSelectedProducts(currentPhoto.photoId, newSelectedProducts)
        },
        setDropdownMenuStatus: (selectedProducts) => {
          const state = get()

          const newMenuItem = state.productMenu?.map((item) => {
            const product = state.products.find(p => p.productId === Number(item.key))

            if (selectedProducts.includes(Number(item.key))) {
              return {
                ...item,
                icon: <CheckOutlined />,
                extra: `${product?.selectedPhotoIds.length} / ${product?.photoLimit === 0 ? '∞' : product?.photoLimit}`,
              }
            }
            else {
              return {
                ...item,
                icon: undefined,
                extra: `${product?.selectedPhotoIds.length} / ${product?.photoLimit === 0 ? '∞' : product?.photoLimit}`,
              }
            }
          })

          set({ productMenu: newMenuItem })
        },
        setSelectedPhotoIds: (productId, photoId) => {
          const state = get()
          const product = state.products.find(p => p.productId === productId)

          if (!product) {
            message.error('产品未找到')
            return state
          }

          // 处理超限选择
          if (!product.allowOverLimit && product.selectedPhotoIds.length >= product.photoLimit) {
            message.info(`产品 ${product.name} 的照片已达张数上限`)
          }

          // 更新选中的照片ID
          product.selectedPhotoIds = product.selectedPhotoIds.includes(photoId)
            ? product.selectedPhotoIds.filter(id => id !== photoId)
            : [...product.selectedPhotoIds, photoId]
          set({ products: [...state.products] })
        },
      }),
      {
        name: 'products-store',
      },
    ),
    {
      name: 'products-storage',
    },
  ),
)
