import type { IOrder } from '@/types/user/order'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface UseOrderState {
  orderInfo: IOrder | null
}

interface UseOrderActions {
  setOrderInfo: (order: IOrder | null) => void
  clearOrderInfo: () => void
}

export const useOrderStore = create<UseOrderState & UseOrderActions>()(
  devtools((set, get) => ({
    orderInfo: null,
    setOrderInfo: orderInfo => set({ orderInfo }),
  }), { name: 'order-store' }),
)
