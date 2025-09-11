import type { IOrderProduct } from '@/types/user/order'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useMessageStore } from './useMessageStore'
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
  productId: number // 产品ID
  name: string // 产品名称
  productType: string // 产品类型
  photoLimit: number // 照片限制数量，0表示不限制
  selectedPhotoIds: number[] // 选中的照片ID
  allowOverLimit: boolean // 是否允许超限选择
  remark: string // 备注
  updatedAt?: number // 本地最后一次更新时间
}

interface ProductState {
  products: IProduct[]
  dirty: boolean // 是否有未提交的更改
}

interface ProductActions {
  setProducts: (orderProducts: IOrderProduct[]) => void // 生成产品列表
  setSelectedPhotoIds: (productId: number, photoId: number) => boolean // 产品设置选中照片ID
  setDirty: (dirty: boolean) => void // 设置是否有未提交的更改
  resetProducts: () => void // 重置产品列表
}

const initialState: ProductState = {
  products: [],
  dirty: false,
}

export const useProductsStore = create<ProductState & ProductActions>()(
  persist(

    (set, get) => ({
      ...initialState,
      setProducts: orderProducts => set(() => {
        const { setProductSelectedPhotos, productSelectedPhotos } = usePhotosStore.getState()

        const products = orderProducts.map(product => ({
          productId: product.id,
          name: product.productName,
          productType: product.productType,
          photoLimit: product.photoLimit,
          selectedPhotoIds: product.selectedPhotos.map(photo => photo.photoId),
          allowOverLimit: product.photoLimit === 0,
          remark: product.remark || '',
        }))

        // 更新照片的选中状态
        const updated = new Map([...productSelectedPhotos])
        if (products.length > 0) {
          products.forEach((product) => {
            product.selectedPhotoIds.forEach((photoId) => {
              const findProductSelectedPhoto = updated.get(photoId)

              if (findProductSelectedPhoto) {
                updated.set(photoId, {
                  ...findProductSelectedPhoto,
                  selectedProducts: [...new Set([...findProductSelectedPhoto.selectedProducts, product.productId])], // 产品ID去重
                })
              }
            })
          })
        }

        setProductSelectedPhotos(updated)

        return {
          products: [...products],
        }
      }),
      setSelectedPhotoIds: (productId, photoId) => {
        const { addMessage } = useMessageStore.getState()
        const state = get()
        const product = state.products.find(p => p.productId === productId)

        if (!product) {
          console.error(`未找到产品 ID 为 ${productId} 的产品`)
          return false
        }

        /**
         * 超限处理
         * 1. 如果 allowOverLimit 为 true，则允许继续添加照片
         * 2. 如果当前选中的照片数量小于 photoLimit，则允许添加照片
         * 3. 如果当前选中的照片在列表中，则允许取消选择
         */

        // 判断要更新的照片是否已经选中
        if (product.selectedPhotoIds.includes(photoId)) {
          product.selectedPhotoIds = product.selectedPhotoIds.filter(id => id !== photoId)
          set({
            products: [...state.products],
          })
        }
        else {
          if (!product.allowOverLimit && product.selectedPhotoIds.length >= product.photoLimit) {
            addMessage('error', `产品 "${product.name}" 的照片数量已达上限 ${product.photoLimit} 张 ，无法继续添加。`)
            return false
          }
          else {
            product.selectedPhotoIds.push(photoId)
            set({
              products: [...state.products],
            })
          }
        }

        return true
      },
      setDirty: dirty => set({ dirty }),
      resetProducts: () => set({ ...initialState }),
    }),
    {
      name: 'products-storage',
    },
  ),
)
