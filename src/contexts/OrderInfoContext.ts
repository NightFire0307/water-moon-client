import type { IOrder } from '@/types/order.ts'
import { createContext, useContext } from 'react'

export const OrderInfoContext = createContext<IOrder | null>(null)

export function useOrderInfoContext() {
  const context = useContext(OrderInfoContext)
  if (!context) {
    throw new Error('useOrderInfoContext must be used within an OrderInfoProvider')
  }
  return context
}
