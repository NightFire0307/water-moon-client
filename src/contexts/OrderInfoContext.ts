import type { IOrder } from '@/types/order.ts'
import { createContext } from 'react'

export const OrderInfoContext = createContext<IOrder | null>(null)
