import type { ResponsePromise } from '@/types/common.ts'

export interface IOrder {
  id: number
  customerName: string
  customerPhone: string
  orderNumber: string
  status: number
  orderProducts: IOrderProduct[]
  totalPhotos: number
  maxSelectPhotos: number
  extraPhotoPrice: number
}

export interface IOrderProduct {
  id: number
  count: number
  photoLimit: number
  productId: number
  productName: string
  productType: string
  selectedPhotos: {
    id: number
    remark?: string
  }[]
  remark?: string
}

interface IOrderProductSelectedPhoto {
  orderProductId: number
  selectedPhotos: number[]
}

export type IOrderResponse = ResponsePromise<IOrder>
export type IOrderProductSelectedPhotoResponse = ResponsePromise<IOrderProductSelectedPhoto>
