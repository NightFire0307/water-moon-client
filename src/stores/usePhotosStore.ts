import type { PaginationParams } from '@/types/common/pagination'
import { getOrderPhotos } from '@/apis/order.ts'
import { PreSelectStatus } from '@/types/selection/preSelection'
import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import { useOrderStore } from './useOrderStore'

export interface Photo {
  photoId: number
  thumbnailUrl: string // 缩略图链接
  mediumUrl: string // 中等大小图片链接
  name: string // 照片名称
  remark: string // 照片备注
  isRecommend: boolean // 是否推荐: true表示推荐，false表示不推荐
  preSelectStatus: PreSelectStatus // 预选状态
  selectedProducts: number[]// 选中的产品ID列表
  dirty: boolean // 是否有未保存的更改
}

interface UsePhotosState {
  viewMode: 'single' | 'compare' // 视图模式
  originalPhotos: Map<number, Omit<Photo, 'photoId'>> // 原始照片列表
  preSelectedPhotos: Map<number, Omit<Photo, 'photoId'>> // 预选照片列表
  productSelectedPhotos: Map<number, Omit<Photo, 'photoId'>> // 已选产品的照片列表
  currentPhoto: Photo | null // 当前照片
  comparePhotos: Photo[] // 对比模式下勾选的照片
  isLoading: boolean // 是否正在加载照片
  filter: { productId?: number, filterType?: FILTER_TYPE } // 过滤条件
}

export enum FILTER_TYPE {
  ALL = 'all',
  SELECTED = 'selected',
  UNSELECTED = 'unselected',
}

interface UsePhotosAction {
  fetchPhotos: (params?: PaginationParams) => Promise<{ hasMore: boolean, nextPage?: () => Promise<{ hasMore: boolean }> }>
  setCurrentPhoto: (currentPhoto: Photo | null) => void // 设置当前照片
  setPhotoSelectedProducts: (photoId: number, productIds: number[]) => void
  setPhotoRemark: (remark: string) => void // 照片备注
  setFilter: (filter: { productId?: number, filterType?: FILTER_TYPE }) => void // 设置过滤条件
  setLoading: (isLoading: boolean) => void // 设置加载状态
  setPreSelectedPhotoStatus: (photoId: number, preSelectStatus: PreSelectStatus) => void // 设置预选照片状态
  setDirty: (dirty: boolean) => void // 设置是否有未保存的更改
  setAllPendingToExclude: () => void // 将所有待处理的照片状态设置为排除
  setAllPendingToSelected: () => void // 将所有待处理的照片状态设置为选中
  setAllToPending: () => void // 将所有照片状态设置为待处理
  togglePreSelected: (preSelectStatus: PreSelectStatus) => void // 设置预选标记
  getPreSelectedStats: () => { selectedCount: number, excludedCount: number, pendingCount: number } // 获取预选照片统计信息
  getPreSelectedPhotos: () => Photo[] // 获取预选照片列表
  getProductSelectedPhotos: () => Photo[] // 获取产品选片照片列表
  setPreSelectedPhotos: (preSelectedPhotos: Map<number, Omit<Photo, 'photoId'>>) => void // 设置预选照片列表
  setProductSelectedPhotos: (productSelectedPhotos: Map<number, Omit<Photo, 'photoId'>>) => void // 设置产品选片照片列表
  setSelectedProducts: (productId: number, photoId: number) => void // 为照片设置选中的产品ID
  resetPhotos: () => void // 重置状态
  setViewMode: (mode: 'single' | 'compare') => void // 设置视图模式
  setComparePhotos: (photos: Photo[]) => void // 设置对比照片列表
}

/**
 * 合并缓存预选照片
 * @param base 基础照片列表
 * @param cache 缓存的照片列表
 */
function mergePhotosFromCache(
  base: Map<number, Omit<Photo, 'photoId'>>,
  cache?: Map<number, Omit<Photo, 'photoId'>>,
) {
  if (!cache || cache.size === 0)
    return base // 如果没有缓存，直接返回

  const mergedPhotos = new Map<number, Omit<Photo, 'photoId'>>()
  for (const [id, baseVal] of base.entries()) {
    const c = cache.get(id)

    if (c) {
      mergedPhotos.set(id, {
        ...baseVal,
        preSelectStatus: c.preSelectStatus || baseVal.preSelectStatus,
        selectedProducts: c.selectedProducts || baseVal.selectedProducts,
        remark: c.remark || baseVal.remark,
        dirty: c.dirty || baseVal.dirty,
      })
    }
    else {
      mergedPhotos.set(id, baseVal)
    }
  }

  return mergedPhotos
}

const initialState: UsePhotosState = {
  viewMode: 'single',
  originalPhotos: new Map([]),
  preSelectedPhotos: new Map([]),
  productSelectedPhotos: new Map([]),
  currentPhoto: null,
  comparePhotos: [],
  isLoading: false,
  filter: {
    productId: undefined,
    filterType: FILTER_TYPE.ALL,
  },
}

export const usePhotosStore = create<UsePhotosState & UsePhotosAction>()(
  devtools(
    persist((set, get) => ({
      ...initialState,
      fetchPhotos: async (params) => {
        const orderInfo = useOrderStore.getState().order
        const photoToOrderProducts = new Map<number, number[]>()

        //  按照照片ID建立和产品ID的映射关系
        if (orderInfo) {
          for (const orderProduct of orderInfo.orderProducts) {
            orderProduct.selectedPhotos.forEach(({ photoId }) => {
              if (photoToOrderProducts.has(photoId)) {
                photoToOrderProducts.get(photoId)?.push(orderProduct.id)
              }
              else {
                photoToOrderProducts.set(photoId, [orderProduct.id])
              }
            })
          }
        }

        // 设置加载状态
        set({ isLoading: true })

        const loadBatch = async (params?: PaginationParams) => {
          const { data } = await getOrderPhotos(params)

          set((state) => {
            const newPhotos = new Map<number, Omit<Photo, 'photoId'>>()
            data.list.forEach((photo) => {
              newPhotos.set(photo.id, {
                thumbnailUrl: photo.ossUrlThumbnail,
                mediumUrl: photo.ossUrlMedium,
                name: photo.name,
                remark: state.originalPhotos.get(photo.id)?.remark || '',
                isRecommend: false,
                preSelectStatus: state.originalPhotos.get(photo.id)?.preSelectStatus || photo.preSelectStatus,
                selectedProducts: photoToOrderProducts.get(photo.id) || [],
                dirty: false,
              })
            })

            // 合并预选照片
            const mergedPreSelected = mergePhotosFromCache(
              newPhotos,
              state.preSelectedPhotos,
            )

            // 合并产品选片照片
            // 只合并那些已经被预选的照片
            const mergedProductSelected = mergePhotosFromCache(
              new Map([...mergedPreSelected].filter(([_, photo]) => photo.preSelectStatus === PreSelectStatus.SELECTED)),
              state.productSelectedPhotos,
            )

            return {
              originalPhotos: newPhotos,
              preSelectedPhotos: mergedPreSelected,
              productSelectedPhotos: mergedProductSelected,
            }
          })

          return {
            hasMore: data.current * data.pageSize < data.total,
            page: data.current + 1,
          }
        }

        const { hasMore, page } = await loadBatch({ pageSize: 50, ...params })

        set({ isLoading: false })

        return {
          hasMore,
          nextPage: () => loadBatch({ current: page }),
        }
      },
      setPhotoSelectedProducts: (photoId, productIds) => (
        set((state) => {
          /**
           * 1. 根据照片ID查找对应的照片
           * 2. 如果照片不存在，则直接返回
           * 3. 更新照片的选中产品ID列表
           * 4. 如果被修改的照片是currentPhoto, 则更新currentPhoto
           * 5. 返回更新后的状态
           */

          const productSelectPhoto = state.productSelectedPhotos.get(photoId)

          if (!productSelectPhoto)
            return state

          return {
            productSelectedPhotos: new Map(state.productSelectedPhotos).set(photoId, {
              ...productSelectPhoto,
              selectedProducts: productIds,
              dirty: true,
            }),
            currentPhoto: state.currentPhoto?.photoId === photoId
              ? { ...state.currentPhoto, selectedProducts: productIds }
              : state.currentPhoto,
          }
        })
      ),
      setPhotoRemark: (remark: string) => set((state) => {
        if (!state.currentPhoto)
          return state

        const productSelectPhoto = state.productSelectedPhotos.get(state.currentPhoto.photoId)

        // 只有当前照片被选中时才能设置备注
        if (!productSelectPhoto || productSelectPhoto.preSelectStatus !== PreSelectStatus.SELECTED)
          return state

        return {
          productSelectedPhotos: new Map(state.productSelectedPhotos).set(state.currentPhoto.photoId, {
            ...productSelectPhoto,
            remark,
            dirty: true,
          }),
          currentPhoto: {
            ...state.currentPhoto,
            remark,
          },
        }
      }),
      setLoading: (isLoading: boolean) => (
        set(() => {
          return { isLoading }
        })
      ),
      togglePreSelected: (preSelectStatus: PreSelectStatus) => set((state) => {
        if (!state.currentPhoto)
          return state

        const preSelectPhoto = state.preSelectedPhotos.get(state.currentPhoto.photoId)
        if (!preSelectPhoto)
          return state

        return {
          preSelectedPhotos: new Map(state.preSelectedPhotos).set(state.currentPhoto.photoId, {
            ...preSelectPhoto,
            preSelectStatus,
            dirty: true,
          }),
        }
      }),
      setCurrentPhoto: currentPhoto => set({ currentPhoto }),
      setPreSelectedPhotoStatus: (photoId: number, preSelectStatus: PreSelectStatus) => set((state) => {
        const updatedPhoto = state.preSelectedPhotos.get(photoId)
        if (!updatedPhoto) {
          console.error(`Photo with ID ${photoId} not found in preSelectedPhotos`)
          return state
        }

        return {
          preSelectedPhotos: new Map(state.preSelectedPhotos).set(photoId, {
            ...updatedPhoto,
            preSelectStatus,
            dirty: true,
          }),
        }
      }),
      // 获取预选照片的统计信息
      getPreSelectedStats: () => {
        const state = get()
        let selectedCount = 0
        let excludedCount = 0
        let pendingCount = 0

        if (state.preSelectedPhotos.size !== 0) {
          for (const [_, photo] of state.preSelectedPhotos.entries()) {
            switch (photo.preSelectStatus) {
              case PreSelectStatus.SELECTED:
                selectedCount++
                break
              case PreSelectStatus.EXCLUDED:
                excludedCount++
                break
              case PreSelectStatus.PENDING:
                pendingCount++
                break
            }
          }
        }

        return {
          selectedCount,
          excludedCount,
          pendingCount,
        }
      },
      setFilter: filter => set({ filter }),
      setDirty: () => { },
      setAllPendingToExclude: () => set((state) => {
        return {
          preSelectedPhotos: new Map([...state.preSelectedPhotos.entries()].map(([photoId, photo]) => (
            [photoId, {
              ...photo,
              preSelectStatus: photo.preSelectStatus === PreSelectStatus.PENDING ? PreSelectStatus.EXCLUDED : photo.preSelectStatus,
              dirty: true,
            }]
          ))),
        }
      }),
      setAllPendingToSelected: () => set((state) => {
        return {
          preSelectedPhotos: new Map([...state.preSelectedPhotos.entries()].map(([photoId, photo]) => (
            [photoId, {
              ...photo,
              preSelectStatus: photo.preSelectStatus === PreSelectStatus.PENDING ? PreSelectStatus.SELECTED : photo.preSelectStatus,
              dirty: true,
            }]
          ))),
        }
      }),
      setAllToPending: () => set((state) => {
        return {
          preSelectedPhotos: new Map([...state.preSelectedPhotos.entries()].map(([photoId, photo]) => {
            return [photoId, { ...photo, preSelectStatus: PreSelectStatus.PENDING, dirty: true }]
          })),
        }
      }),
      getPreSelectedPhotos: () => {
        const state = get()
        const preSelectPhotos: Photo[] = []

        for (const [photoId, value] of state.preSelectedPhotos.entries()) {
          preSelectPhotos.push({
            photoId,
            ...value,
          })
        }

        return preSelectPhotos
      },
      getProductSelectedPhotos: () => {
        const state = get()
        const productSelectedPhotos: Photo[] = []

        for (const [photoId, value] of state.productSelectedPhotos.entries()) {
          productSelectedPhotos.push({
            photoId,
            ...value,
          })
        }

        return productSelectedPhotos
      },
      setPreSelectedPhotos: preSelectedPhotos => set({ preSelectedPhotos }),
      setProductSelectedPhotos: productSelectedPhotos => set({ productSelectedPhotos }),
      setSelectedProducts: (productId, photoId) => {
        set((state) => {
          const updatePhoto = state.productSelectedPhotos.get(photoId)

          if (!updatePhoto) {
            console.error(`Photo with ID ${photoId} not found in productSelectedPhotos`)
            return state
          }

          if (updatePhoto.selectedProducts.includes(productId)) {
            return {
              productSelectedPhotos: new Map(state.productSelectedPhotos).set(photoId, {
                ...updatePhoto,
                selectedProducts: updatePhoto.selectedProducts.filter(id => id !== productId),
                dirty: true,
              }),
            }
          }
          else {
            return {
              productSelectedPhotos: new Map(state.productSelectedPhotos).set(photoId, {
                ...updatePhoto,
                selectedProducts: [...updatePhoto.selectedProducts, productId],
                dirty: true,
              }),
            }
          }
        })
      },
      resetPhotos: () => set({ ...initialState }),
      setViewMode: (mode: 'single' | 'compare') => set({ viewMode: mode }),
      setComparePhotos: (photos: Photo[]) => set({ comparePhotos: photos }),
    }), {
      name: 'photos-storage',
      storage: createJSONStorage(() => localStorage, {
        // 序列化和反序列化 Map 数据结构
        replacer: (_key, value) => {
          if (value instanceof Map) {
            return {
              __type: 'Map',
              value: [...value],
            }
          }
          return value
        },
        reviver: (_key: string, value: unknown) => {
          if (value && typeof value === 'object' && (value as any).__type === 'Map') {
            return new Map((value as any).value)
          }
          return value
        },
      }),
      // 只持久化部分状态
      partialize: state => ({
        originalPhotos: state.originalPhotos,
        preSelectedPhotos: state.preSelectedPhotos,
        productSelectedPhotos: state.productSelectedPhotos,
      }),
    }),
    {
      name: 'photos-store',
      // 序列化 MAP 数据结构
      serialize: {
        options: true,
        replacer: (_key: string, value: { __type: 'Map', value: any }) => {
          if (value instanceof Map) {
            return Array.from(value.entries()).map(([key, val]) => [key, val])
          }
          return value
        },
      },
    },
  ),
)
