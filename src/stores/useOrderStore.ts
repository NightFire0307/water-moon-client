import type { IOrder } from '@/types/user/order'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface UseOrderState {
  orderInfo: IOrder | null
  isLoading: boolean
}

interface UseOrderActions {
  setOrderInfo: (order: IOrder | null) => void
  clearOrderInfo: () => void
  setLoading: (loading: boolean) => void
}

export const useOrderStore = create<UseOrderState & UseOrderActions>()(
  devtools((set, get) => ({
    orderInfo: null,
    isLoading: false,
    setOrderInfo: orderInfo => set({ orderInfo }),
    setLoading: isLoading => set({ isLoading }),
  }), { name: 'order-store' }),
)
