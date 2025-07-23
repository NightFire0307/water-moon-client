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
  isFiltering: boolean
  selectedFilter: FILTER_TYPE
  previousPhotosData: Record<number, Omit<Photo, 'original_url' | 'thumbnail_url' | 'name' | 'photoId'>>
}

export enum FILTER_TYPE {
  ALL = 'all',
  SELECTED = 'selected',
  UNSELECTED = 'unselected',
}

interface PhotosAction {
  fetchPhotos: () => Promise<void>
  filterPhotos: (value: FILTER_TYPE) => void
  setPhotoSelectedProducts: (photoId: number, productIds: number[]) => void
  // 更新照片备注
  updatePhotoRemark: (photoId: number, remark: string) => void
  // 根据产品ID过滤照片
  filterPhotoByProductId: (productId: number) => void
  // 清空过滤照片列表
  clearFilterPhotos: () => void
  // 设置加载状态
  setLoading: (isLoading: boolean) => void
  // 还原上一次的数据
  restorePreviousPhotoData: (photoId: number) => void
  // 获取当前照片信息
  getCurrentPhotoInfo: () => { currentIndex: number, name: string, totalCount: number }
  setCurrentPhoto: (index: number) => void
}

const BATCH_SIZE = 10

export const usePhotosStore = create<UsePhotosStore & PhotosAction>()(
  devtools((set, get) => ({
    photos: [],
    currentPhoto: null,
    isLoading: true,
    filteredPhotos: [],
    isFiltering: false,
    selectedFilter: FILTER_TYPE.ALL,
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
    filterPhotos: (value: FILTER_TYPE) => (set({ selectedFilter: value })),
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
    updatePhotoRemark: (photoId: number, remark: string) => (
      set((state) => {
        const photo = state.photos.find(photo => photo.photoId === photoId)

        if (photo) {
          photo.remark = remark
        }

        return state
      })
    ),
    filterPhotoByProductId: (productId: number) => {},
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
    restorePreviousPhotoData: (photoId: number) => {
    },
    getCurrentPhotoInfo: () => ({
      currentIndex: get().photos.findIndex(photo => photo.photoId === get().currentPhoto?.photoId) + 1,
      name: get().currentPhoto?.name ?? '',
      totalCount: get().filteredPhotos.length,
    }),
    setCurrentPhoto: (index: number) => {
      set((state) => {
        if (index < 0 || index >= state.photos.length)
          return { currentPhoto: null }
        const photo = state.photos[index]

        // 更新照片的产品选中状态
        useProductsStore.getState().setDropdownMenuStatus(photo.selectedProducts)

        return { currentPhoto: photo }
      })
    },
  }), {
    name: 'photos-store',
  }),
)
