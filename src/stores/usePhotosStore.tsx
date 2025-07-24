import type { IPhoto } from '@/types/photos.ts'
import type { IProduct } from './useProductsStore.tsx'
import { getOrderPhotos } from '@/apis/order.ts'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { useProductsStore } from './useProductsStore.tsx'

export interface Photo {
  photoId: number
  original_url: string
  thumbnail_url: string
  name: string
  remark: string
  isRecommend: boolean
  selectedProducts: number[]
}

interface UsePhotosStore {
  // 原始照片列表
  photos: Photo[]
  // 当前照片
  currentPhoto: Photo | null
  // 是否正在加载照片
  isLoading: boolean
  // 过滤后的照片列表
  filteredPhotos: Photo[]
  previousPhotosData: Record<number, Omit<Photo, 'original_url' | 'thumbnail_url' | 'name' | 'photoId'>>
}

export enum FILTER_TYPE {
  ALL = 'all',
  SELECTED = 'selected',
  UNSELECTED = 'unselected',
}

interface PhotosAction {
  fetchPhotos: () => Promise<void>
  setPhotoSelectedProducts: (photoId: number, productIds: number[]) => void
  // 照片备注
  setPhotoRemark: (remark: string) => void
  // 过滤照片
  filterPhoto: (filter: { productId?: number, filterType?: FILTER_TYPE }) => void
  // 清空过滤照片列表
  clearFilterPhotos: () => void
  // 设置加载状态
  setLoading: (isLoading: boolean) => void
  // 还原上一次的数据
  restorePreviousPhotoData: (photoId: number) => void
  // 获取当前照片信息
  getCurrentPhotoInfo: () => { currentIndex: number, name: string, totalCount: number }
  // 设置当前照片
  setCurrentPhoto: (index: number) => void
  // 获取照片统计信息
  getPhotoState: () => { selectCount: number, unselectedCount: number, totalCount: number }
}

const BATCH_SIZE = 10

export const usePhotosStore = create<UsePhotosStore & PhotosAction>()(
  devtools((set, get) => ({
    photos: [],
    currentPhoto: null,
    isLoading: true,
    filteredPhotos: [],
    previousPhotosData: {},
    fetchPhotos: async () => {
      const state = get()
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
          }
        }

        // 第一阶段：使用rAF加载首屏可见照片（高优先级）
        const loadInitialBatch = () => {
          const initialBatch = allList.slice(0, BATCH_SIZE)

          for (const photo of initialBatch) {
            photos.push(createPhotoObject(photo, products))
          }

          set({ photos, isLoading: false, filteredPhotos: [...photos] })

          state.setCurrentPhoto(0)

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
                photos: [...state.photos, ...batch],
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
        const photo = state.photos.find(p => p.photoId === photoId)

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

        return { photos: [...state.photos] }
      })
    },
    setPhotoRemark: (remark: string) => {
      const state = get()

      if (!state.currentPhoto) {
        return state
      }

      // 更新当前照片的备注
      const updatedPhoto = { ...state.currentPhoto, remark }

      // 更新原始照片列表数据
      const newPhotos = state.photos.map((photo) => {
        if (photo.photoId === state.currentPhoto?.photoId) {
          return { ...photo, remark }
        }
        return photo
      })

      // 更新过滤后的照片列表数据
      const newFilteredPhotos = state.filteredPhotos.map((photo) => {
        if (photo.photoId === state.currentPhoto?.photoId) {
          return { ...photo, remark }
        }
        return photo
      })

      set({
        currentPhoto: updatedPhoto,
        photos: newPhotos,
        filteredPhotos: newFilteredPhotos,
      })
    },
    filterPhoto: (filter) => {
      const state = get()
      const { productId, filterType } = filter

      // 如果没有过滤条件，直接返回所有照片
      if (filterType === FILTER_TYPE.ALL) {
        set({
          filteredPhotos: [...state.photos],
        })
      }

      // 过滤指定产品的照片
      if (filterType === FILTER_TYPE.SELECTED && productId !== undefined) {
        const filteredPhotos = state.photos.filter((photo) => {
          return photo.selectedProducts.includes(productId)
        })

        set({
          filteredPhotos,
        })
      }

      // 过滤已选的照片
      if (filterType === FILTER_TYPE.SELECTED && productId === undefined) {
        const filteredPhotos = state.photos.filter((photo) => {
          return photo.selectedProducts.length > 0
        })

        set({
          filteredPhotos,
        })
      }

      // 过滤未选的照片
      if (filterType === FILTER_TYPE.UNSELECTED && productId === undefined) {
        const filteredPhotos = state.photos.filter((photo) => {
          return photo.selectedProducts.length === 0
        })

        set({
          filteredPhotos,
        })
      }

      // 如果过滤后的照片不在当前照片列表中，重置当前照片
      if (!state.filteredPhotos.some(photo => photo.photoId === state.currentPhoto?.photoId)) {
        state.setCurrentPhoto(0)
      }
    },
    clearFilterPhotos: () => (
      set(() => {
        return {
          isFiltering: false,
          filteredPhotos: [],
        }
      })
    ),
    setLoading: (isLoading: boolean) => (
      set(() => {
        return { isLoading }
      })
    ),
    getCurrentPhotoInfo: () => {
      const state = get()
      const currentIndex = state.filteredPhotos.findIndex(photo =>
        photo.photoId === state.currentPhoto?.photoId,
      )

      return {
        currentIndex: currentIndex === -1 ? 0 : currentIndex, // 返回正确的索引，未找到时返回0
        name: state.currentPhoto?.name ?? '',
        totalCount: state.filteredPhotos.length,
      }
    },
    setCurrentPhoto: (index: number) => {
      set((state) => {
        if (index < 0 || index >= state.filteredPhotos.length)
          return { currentPhoto: null }
        const photo = state.filteredPhotos[index]

        // 更新照片的产品选中状态
        useProductsStore.getState().setDropdownMenuStatus(photo.selectedProducts)

        return { currentPhoto: photo }
      })
    },
    getPhotoState: () => {
      const state = get()
      const totalCount = state.photos.length
      const selectedCount = state.photos.filter(photo => photo.selectedProducts.length > 0).length
      const unselectedCount = state.photos.filter(photo => photo.selectedProducts.length === 0).length

      return {
        selectCount: selectedCount,
        unselectedCount,
        totalCount,
      }
    },
  }), {
    name: 'photos-store',
  }),
)
