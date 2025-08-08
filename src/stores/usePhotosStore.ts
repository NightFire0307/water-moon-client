import type { PaginationParams } from '@/types/common/pagination'
import { getOrderPhotos } from '@/apis/order.ts'
import { PreSelectStatus } from '@/types/selection/preSelection'
import { cloneDeep } from 'lodash-es'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { useProductsStore } from './useProductsStore'

export interface Photo {
  photoId: number
  originalUrl: string // 原图链接
  thumbnailUrl: string // 缩略图链接
  mediumUrl: string // 中等大小图片链接
  name: string
  remark: string // 照片备注
  isRecommend: boolean // 是否推荐: true表示推荐，false表示不推荐
  preSelectStatus: PreSelectStatus // 预选状态
  selectedProducts: number[]// 选中的产品ID列表
  dirty: boolean // 是否有未保存的更改
}

interface UsePhotosState {
  originalPhotos: Map<number, Photo> // 原始照片列表
  preSelectedPhotos: Map<number, Photo> // 预选照片列表
  productSelectedPhotos: Map<number, Photo> // 已选产品的照片列表
  currentPhoto: Photo | null // 当前照片
  isLoading: boolean // 是否正在加载照片
  selectionStage: 'preSelect' | 'productSelect' | 'preview' | 'submitted' // 当前选片阶段
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
  setSelectionStage: (stage: 'preSelect' | 'productSelect' | 'preview' | 'submitted') => void // 设置当前模式
  setDirty: (dirty: boolean) => void // 设置是否有未保存的更改
  setAllPendingToExclude: () => void // 将所有待处理的照片状态设置为排除
  setAllPendingToSelected: () => void // 将所有待处理的照片状态设置为选中
  setAllToPending: () => void // 将所有照片状态设置为待处理
  togglePreSelected: (preSelectStatus: PreSelectStatus) => void // 设置预选标记
  getProductSelectedStats: () => { selectedCount: number, unselectedCount: number, totalCount: number } // 获取产品选片统计信息
  getPreSelectedStats: () => { selectedCount: number, excludedCount: number, pendingCount: number } // 获取预选照片统计信息
  getPreSelectedPhotos: () => Photo[] // 获取预选照片列表
  setPreSelectedPhotos: (photo: Photo) => void // 设置预选照片列表
  setProductSelectedPhotos: (photo: Photo) => void // 设置产品选片照片列表
}

export const usePhotosStore = create<UsePhotosState & UsePhotosAction>()(
  devtools(
    persist((set, get) => ({
      originalPhotos: new Map([]),
      preSelectedPhotos: new Map([]),
      productSelectedPhotos: new Map([]),
      currentPhoto: null,
      isLoading: false,
      selectionStage: 'preSelect',
      dirty: false,
      filter: {
        productId: undefined,
        filterType: FILTER_TYPE.ALL,
      },
      fetchPhotos: async (params) => {
        // 设置加载状态
        set({ isLoading: true })

        const loadBatch = async (params?: PaginationParams) => {
          const { data } = await getOrderPhotos(params)

          set((state) => {
            const newPhotos = new Map<number, Photo>()
            data.list.forEach((photo) => {
              newPhotos.set(photo.id, {
                photoId: photo.id,
                originalUrl: photo.originalUrl,
                thumbnailUrl: photo.thumbnailUrl,
                mediumUrl: photo.mediumUrl,
                name: photo.fileName,
                remark: state.originalPhotos.get(photo.id)?.remark || '',
                isRecommend: photo.isRecommend,
                preSelectStatus: state.originalPhotos.get(photo.id)?.preSelectStatus || PreSelectStatus.PENDING,
                selectedProducts: [],
                dirty: false,
              })
            })

            return {
              originalPhotos: newPhotos,
              preSelectedPhotos: new Map(newPhotos),
            }
          })

          return {
            hasMore: data.current * data.pageSize < data.total,
            page: data.current + 1,
          }
        }

        const { hasMore, page } = await loadBatch({ pageSize: 50, ...params })

        set({ isLoading: false, preSelectedPhotos: cloneDeep(get().originalPhotos) })

        return {
          hasMore,
          nextPage: () => loadBatch({ current: page }),
        }
      },
      setPhotoSelectedProducts: (photoId, productIds) => {
        // set((state) => {
        //   const photo = state.productSelectedPhotos.find(p => p.photoId === photoId)

        //   if (!photo) {
        //     console.error(`Photo with ID ${photoId} not found`)
        //     return state
        //   }

        //   photo.selectedProducts = productIds // 更新选中的产品ID
        //   photo.dirty = true // 标记为已更改

        //   // 如果当前照片是被选中的，更新currentPhoto
        //   if (state.currentPhoto?.photoId === photoId) {
        //     state.currentPhoto = { ...photo }
        //   }

        //   return { productSelectedPhotos: [...state.productSelectedPhotos] }
        // })
      },
      setPhotoRemark: (remark: string) => {
        // const state = get()

        // if (!state.currentPhoto) {
        //   return state
        // }

        // // 更新当前照片的备注
        // const updatedPhoto = { ...state.currentPhoto, remark }

        // // 更新产品列表数据
        // const newFilteredPhotos = state.productSelectedPhotos.map((photo) => {
        //   if (photo.photoId === state.currentPhoto?.photoId) {
        //     return { ...photo, remark }
        //   }
        //   return photo
        // })

        // set({
        //   currentPhoto: updatedPhoto,
        //   productSelectedPhotos: newFilteredPhotos,
        // })
      },
      setLoading: (isLoading: boolean) => (
        set(() => {
          return { isLoading }
        })
      ),
      togglePreSelected: (preSelectStatus: PreSelectStatus) => {
        const state = get()
        if (!state.currentPhoto)
          return state

        // 更新照片预选标记
        // set({
        //   preSelectedPhotos: state.preSelectedPhotos.map((photo) => {
        //     if (photo.photoId === state.currentPhoto?.photoId) {
        //       return { ...photo, preSelectStatus, dirty: true }
        //     }
        //     return photo
        //   }),
        // })
      },
      setCurrentPhoto: (currentPhoto) => {
        const { setDropdownMenuStatus } = useProductsStore.getState()
        set({ currentPhoto })

        // 设置产品选片的下拉菜单状态
        setDropdownMenuStatus(currentPhoto?.selectedProducts || [])
      },
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
      // 获取产品选片的统计信息
      getProductSelectedStats: () => {
        // const state = get()
        // const totalCount = state.productSelectedPhotos.length
        // const selectedCount = state.productSelectedPhotos.filter(photo => photo.selectedProducts.length > 0).length
        // const unselectedCount = state.productSelectedPhotos.filter(photo => photo.selectedProducts.length === 0).length

        return {
          selectedCount: 0,
          unselectedCount: 0,
          totalCount: 0,
        }
      },
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
              case PreSelectStatus.EXCLUDE:
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
      setSelectionStage: stage => set({ selectionStage: stage }),
      setFilter: filter => set({ filter }),
      setDirty: () => { },
      setAllPendingToExclude: () => set((state) => {
        return {
          preSelectedPhotos: state.preSelectedPhotos.map((photo) => {
            if (photo.preSelectStatus === PreSelectStatus.PENDING) {
              return { ...photo, preSelectStatus: PreSelectStatus.EXCLUDE }
            }
            return photo
          }),
        }
      }),
      setAllPendingToSelected: () => set((state) => {
        return {
          preSelectedPhotos: state.preSelectedPhotos.map((photo) => {
            if (photo.preSelectStatus === PreSelectStatus.PENDING) {
              return { ...photo, preSelectStatus: PreSelectStatus.SELECTED }
            }
            return photo
          }),
        }
      }),
      setAllToPending: () => set((state) => {
        return {
          preSelectedPhotos: state.preSelectedPhotos.map((photo) => {
            return { ...photo, preSelectStatus: PreSelectStatus.PENDING }
          }),
        }
      }),
      getPreSelectedPhotos: () => {
        const state = get()
        console.log(Array.from(state.preSelectedPhotos))
        return Array.from(state.preSelectedPhotos.values())
      },
      setPreSelectedPhotos: preSelectedPhoto => set(state => ({
        preSelectedPhotos: new Map(state.preSelectedPhotos).set(preSelectedPhoto.photoId, { ...preSelectedPhoto, dirty: true }),
      })),
      setProductSelectedPhotos: productSelectedPhoto => set(state => ({
        productSelectedPhotos: state.productSelectedPhotos.set(productSelectedPhoto.photoId, productSelectedPhoto),
      })),
    }), {
      name: 'photos-storage',
      partialize: (state) => {
        return {
          originalPhotos: Array.from(state.originalPhotos.entries()).map(([key, value]) => [key, value]), // 将 Map 转换为数组保存
        }
      },
    }),
    {
      name: 'photos-store',
      enabled: true,
      // 序列化 MAP 数据结构
      serialize: {
        options: true,
        replacer: (_, value) => {
          if (value instanceof Map) {
            return Array.from(value.entries()).map(([key, val]) => [key, val])
          }
          return value
        },
      },
    },
  ),
)
