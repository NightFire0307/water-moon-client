import type { IOrder } from '@/types/user/order'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface UseOrderState {
  orderInfo: IOrder | null
  isLoading: boolean
}

interface UseOrderActions {
  setOrderInfo: (order: IOrder | null) => void
  setLoading: (loading: boolean) => void
  resetOrder: () => void
}

export const useOrderStore = create<UseOrderState & UseOrderActions>()(
  devtools((set, get) => ({
    orderInfo: null,
    isLoading: false,
    setOrderInfo: orderInfo => set({ orderInfo }),
    setLoading: isLoading => set({ isLoading }),
    resetOrder: () => set({ orderInfo: null, isLoading: false }),
  }), { name: 'order-store' }),
)
