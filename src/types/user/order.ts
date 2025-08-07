import type { ResponsePromise } from '@/types/common/apiResponse'

export interface IOrder {
  id: number
  customerName: string
  customerPhone: string
  orderNumber: string
  orderProducts: IOrderProduct[]
  status: number
  maxSelectPhotos: number
  extraPhotoPrice: number
  totalPhotos: number
}

export interface IOrderProduct {
  id: number
  count: number
  photoLimit: number
  productName: string
  productType: string
  selectedPhotos: {
    id: number
    remark?: string
  }[]
  remark?: string
}

export type IOrderResponse = ResponsePromise<IOrder>
