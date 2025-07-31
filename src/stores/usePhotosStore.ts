import type { IProduct } from './useProductsStore'
import type { IPhoto } from '@/types/photos.ts'
import { cloneDeep } from 'lodash-es'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { getOrderPhotos } from '@/apis/order.ts'
import { useProductsStore } from './useProductsStore'

export interface Photo {
  photoId: number
  original_url: string
  thumbnail_url: string
  name: string
  remark: string // 照片备注
  isRecommend: boolean // 是否推荐: true表示推荐，false表示不推荐
  preSelectStatus: PreSelectStatus // 预选状态
  selectedProducts: number[]// 选中的产品ID列表
}

interface UsePhotosState {
  originalPhotos: Photo[] // 原始照片列表
  preSelectedPhotos: Photo[] // 预选照片列表
  productSelectedPhotos: Photo[] // 已选产品的照片列表
  currentPhoto: Photo | null // 当前照片
  isLoading: boolean // 是否正在加载照片
  mode: 'preSelect' | 'productSelect' | 'preview' // 预选模式 产品选片模式 预览模式
  filter: { productId?: number, filterType?: FILTER_TYPE } // 过滤条件
  dirty: boolean // 是否有未保存的更改
}

// 照片预选状态枚举
export enum PreSelectStatus {
  PENDING = 'pending', // 待处理
  SELECTED = 'selected', // 选中
  EXCLUDE = 'exclude', // 排除
}

export enum FILTER_TYPE {
  ALL = 'all',
  SELECTED = 'selected',
  UNSELECTED = 'unselected',
}

interface UsePhotosAction {
  fetchPhotos: () => Promise<void>
  setCurrentPhoto: (currentPhoto: Photo | null) => void // 设置当前照片
  setPhotoSelectedProducts: (photoId: number, productIds: number[]) => void
  setPhotoRemark: (remark: string) => void // 照片备注
  setFilter: (filter: { productId?: number, filterType?: FILTER_TYPE }) => void // 设置过滤条件
  setLoading: (isLoading: boolean) => void // 设置加载状态
  setPreSelectedPhotoStatus: (photoId: number, preSelectStatus: PreSelectStatus) => void // 设置预选照片状态
  setMode: (mode: 'preSelect' | 'productSelect') => void // 设置当前模式
  setDirty: (dirty: boolean) => void // 设置是否有未保存的更改
  setAllPendingToExclude: () => void // 将所有待处理的照片状态设置为排除
  setAllPendingToSelected: () => void // 将所有待处理的照片状态设置为选中
  setAllToPending: () => void // 将所有照片状态设置为待处理
  togglePreSelected: (preSelectStatus: PreSelectStatus) => void // 设置预选标记
  copyPreSelectedPhotos: () => void // 复制预选照片到产品选片
  getProductSelectedStats: () => { selectedCount: number, unselectedCount: number, totalCount: number } // 获取产品选片统计信息
  getPreSelectedStats: () => { selectedCount: number, excludedCount: number, pendingCount: number } // 获取预选照片统计信息
}

const BATCH_SIZE = 10

export const usePhotosStore = create<UsePhotosState & UsePhotosAction>()(
  devtools(
    persist((set, get) => ({
      originalPhotos: [],
      preSelectedPhotos: [],
      productSelectedPhotos: [],
      currentPhoto: null,
      isLoading: true,
      mode: 'preSelect',
      dirty: false,
      filter: {
        productId: undefined,
        filterType: FILTER_TYPE.ALL,
      },
      fetchPhotos: async () => {
        // 设置加载状态
        set({ isLoading: true })

        try {
          const products = useProductsStore.getState().products
          const { data } = await getOrderPhotos()
          const allList = data.list
          const photos: Photo[] = []

          // 创建照片对象的公共方法
          const createPhotoObject = (photo: IPhoto, products: IProduct[]): Photo => {
            const selectedProducts = products.filter(p => p.selectedPhotoIds.includes(photo.id))

            return {
              photoId: photo.id,
              thumbnail_url: photo.thumbnail_url,
              original_url: photo.original_url,
              name: photo.file_name,
              remark: photo.remark ?? '',
              isRecommend: photo.is_recommend,
              selectedProducts: selectedProducts.map(p => p.productId),
              preSelectStatus: PreSelectStatus.PENDING, // 默认状态为待处理
            }
          }

          // 第一阶段：使用rAF加载首屏可见照片（高优先级）
          const loadInitialBatch = () => {
            const initialBatch = allList.slice(0, BATCH_SIZE)

            for (const photo of initialBatch) {
              photos.push(createPhotoObject(photo, products))
            }

            set({ originalPhotos: photos, isLoading: false, preSelectedPhotos: cloneDeep(photos) })

            // 启动第二阶段空闲时加载
            if (allList.length > BATCH_SIZE) {
              requestIdleCallback(() => loadRemainingPhotos(BATCH_SIZE), { timeout: 1000 })
            }
          }

          // 第二阶段：使用rIC加载剩余照片（低优先级）
          function loadRemainingPhotos(startIndex: number) {
            const idleCallback = (deadline: IdleDeadline) => {
              const batch: Photo[] = []
              let i = startIndex

              // 在空闲时间内处理尽可能多的照片
              while (i < allList.length && (deadline.timeRemaining() > 0 || deadline.didTimeout)) {
                batch.push(createPhotoObject(allList[i], products))
                i++
              }

              // 更新状态
              if (batch.length > 0) {
                set(state => ({
                  originalPhotos: [...state.originalPhotos, ...batch],
                }))
              }

              // 如果还有剩余照片，继续调度
              if (i < allList.length) {
                requestIdleCallback(() => loadRemainingPhotos(i), { timeout: 1000 })
              }
            }

            requestIdleCallback(idleCallback, { timeout: 1000 })
          }

          // 启动初始加载
          requestAnimationFrame(loadInitialBatch)
        }
        catch (error) {
          console.error('Failed to fetch photos:', error)
          set({ isLoading: false })
        }
      },
      setPhotoSelectedProducts: (photoId, productIds) => {
        set((state) => {
          const photo = state.productSelectedPhotos.find(p => p.photoId === photoId)

          if (!photo) {
            console.error(`Photo with ID ${photoId} not found`)
            return state
          }

          // 更新选中的产品ID
          photo.selectedProducts = productIds

          // 如果当前照片是被选中的，更新currentPhoto
          if (state.currentPhoto?.photoId === photoId) {
            state.currentPhoto = { ...photo }
          }

          return { productSelectedPhotos: [...state.productSelectedPhotos] }
        })
      },
      setPhotoRemark: (remark: string) => {
        const state = get()

        if (!state.currentPhoto) {
          return state
        }

        // 更新当前照片的备注
        const updatedPhoto = { ...state.currentPhoto, remark }

        // 更新产品列表数据
        const newFilteredPhotos = state.productSelectedPhotos.map((photo) => {
          if (photo.photoId === state.currentPhoto?.photoId) {
            return { ...photo, remark }
          }
          return photo
        })

        set({
          currentPhoto: updatedPhoto,
          productSelectedPhotos: newFilteredPhotos,
        })
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
        set({
          preSelectedPhotos: state.preSelectedPhotos.map((photo) => {
            if (photo.photoId === state.currentPhoto?.photoId) {
              return { ...photo, preSelectStatus }
            }
            return photo
          }),
        })
      },
      setCurrentPhoto: (currentPhoto) => {
        const { setDropdownMenuStatus } = useProductsStore.getState()
        set({ currentPhoto })

        // 设置产品选片的下拉菜单状态
        setDropdownMenuStatus(currentPhoto?.selectedProducts || [])
      },
      setPreSelectedPhotoStatus: (photoId: number, preSelectStatus: PreSelectStatus) => set((state) => {
        const photoIndex = state.preSelectedPhotos.findIndex(photo => photo.photoId === photoId)
        if (photoIndex === -1) {
          console.error(`Photo with ID ${photoId} not found in preSelectedPhotos`)
          return state
        }

        return {
          preSelectedPhotos: state.preSelectedPhotos.map((photo, index) => {
            if (index === photoIndex) {
              return { ...photo, preSelectStatus }
            }
            return photo
          }),
        }
      }),
      // 获取产品选片的统计信息
      getProductSelectedStats: () => {
        const state = get()
        const totalCount = state.productSelectedPhotos.length
        const selectedCount = state.productSelectedPhotos.filter(photo => photo.selectedProducts.length > 0).length
        const unselectedCount = state.productSelectedPhotos.filter(photo => photo.selectedProducts.length === 0).length

        return {
          selectedCount,
          unselectedCount,
          totalCount,
        }
      },
      // 获取预选照片的统计信息
      getPreSelectedStats: () => {
        const state = get()
        const selectedCount = state.preSelectedPhotos.filter(photo => photo.preSelectStatus === PreSelectStatus.SELECTED).length
        const excludedCount = state.preSelectedPhotos.filter(photo => photo.preSelectStatus === PreSelectStatus.EXCLUDE).length
        const pendingCount = state.preSelectedPhotos.filter(photo => photo.preSelectStatus === PreSelectStatus.PENDING).length

        return {
          selectedCount,
          excludedCount,
          pendingCount,
        }
      },
      // 复制预选中的照片到产品选片
      copyPreSelectedPhotos: () => {
        const state = get()
        const productSelectedPhotos = state.preSelectedPhotos.filter(photo => photo.preSelectStatus === PreSelectStatus.SELECTED)

        set({ productSelectedPhotos })
      },
      setMode: mode => set({ mode }),
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
    }), {
      name: 'photos-storage',
      partialize: (state) => {
        return {
          originalPhotos: state.originalPhotos,
          preSelectedPhotos: state.preSelectedPhotos,
          productSelectedPhotos: state.productSelectedPhotos,
        }
      },
    }),
    {
      name: 'photos-store',
    },
  ),
)
