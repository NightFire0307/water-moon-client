import type { IOrder } from '@/types/user/order'
import { getOrderInfo } from '@/apis/order'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useProductsStore } from './useProductsStore'

interface UseOrderState {
  order: IOrder | null
  lastFetch: number | null
  isLoading: boolean
}

interface UseOrderActions {
  fetchOrder: () => Promise<void>
  clearOrder: () => void
}

export const useOrderStore = create<UseOrderState & UseOrderActions>()(
  persist((set, get) => ({
    order: null,
    lastFetch: null,
    isLoading: false,
    clearOrder: () => set({ order: null, lastFetch: null }),
    fetchOrder: async () => {
      const { setProducts } = useProductsStore.getState()
      const { lastFetch, order } = get()
      const now = Date.now()

      // 5分钟内如果有缓存则不重新请求
      if (order && lastFetch && now - lastFetch < 5 * 60 * 1000) {
        return
      }

      try {
        set({ isLoading: true })
        const { data } = await getOrderInfo()
        setProducts(data.orderProducts)
        set({ order: data, lastFetch: now, isLoading: false })
      }
      catch (err) {
        set({ isLoading: false })
      }
    },
  }), {
    name: 'order-store',
    partialize: state => ({
      order: state.order,
      lastFetch: state.lastFetch,
    }),
  }),
)
