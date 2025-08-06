import type { IOrderProduct } from '@/types/order.ts'
import { message } from 'antd'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { usePhotosStore } from './usePhotosStore'

/**
 * 服务端数据和本地数据同步逻辑：
 * 1. 当从服务端拉取数据时，比对 updatedAt 字段，如果服务端数据的 updatedAt 大于本地数据，则更新本地数据，如果小于，则优先保留本地数据。
 * 2. 当 dirty 状态为 true 时，表示有未提交的更改，此时需要在用户提交时调用 updateOrderPhotos 接口将本地数据同步到服务端。
 * 3. 在提交后，将 dirty 状态重置为 false，并更新本地
 *
 * 解决问题：
 * 1. 用户可能断网或刷新页面
 */

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
  updatedAt?: number // 本地最后一次更新时间
}

interface ProductState {
  products: IProduct[]
  productMenu: {
    key: string
    label: string
    isSelected?: boolean // 是否选中
    extra?: string
  }[]
  dirty: boolean // 是否有未提交的更改
}

interface ProductActions {
  generateProducts: (orderProducts: IOrderProduct[]) => void // 生成产品列表
  generateDropdownItems: (products: IProduct[]) => void // 生成下拉菜单项
  setSelectedPhotoIds: (productId: number, photoId: number) => void // 产品设置选中照片ID
  dropdownMenuClick: ({ key }: { key: string }) => void // 下拉菜单点击事件
  setDropdownMenuStatus: (selectedProducts: number[]) => void // 设置下拉菜单状态(当切换照片时需要调用一次)
  setDirty: (dirty: boolean) => void // 设置是否有未提交的更改
}

export const useProductsStore = create<ProductState & ProductActions>()(
  persist(
    devtools(
      (set, get) => ({
        products: [],
        productMenu: [],
        dirty: false,
        generateProducts: orderProducts => set((state) => {
          const currentPhoto = usePhotosStore.getState().currentPhoto

          // 如果有持久化的产品数据，则直接返回
          if (state.products.length > 0) {
            state.setDropdownMenuStatus(currentPhoto?.selectedProducts ?? [])

            return state
          }
          else {
            // 如果有持久化数据则直接返回
            if (state.products.length > 0) {
              return state
            }
            const products = orderProducts.map(product => ({
              productId: product.id,
              name: product.productName,
              productType: product.productType,
              photoLimit: product.photoLimit,
              selectedPhotoIds: product.selectedPhotos.map(photo => photo.id),
              allowOverLimit: product.photoLimit === 0,
              remark: product.remark || '',
            }))

            // 生成下拉菜单项
            state.generateDropdownItems(products)

            return {
              products: [...products],
            }
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

            return {
              ...item,
              isSelected: selectedProducts.includes(Number(item.key)),
              extra: `${product?.selectedPhotoIds.length} / ${product?.photoLimit === 0 ? '∞' : product?.photoLimit}`,
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
        setDirty: dirty => set({ dirty }),
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
