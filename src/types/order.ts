import type { ResponsePromise } from '@/types/common.ts'

interface IOrder {
  id: number
  customer_name: string
  customer_phone: string
  order_number: string
  status: number
  order_products: IOrderProduct[]
}

export interface IOrderProduct {
  id: number
  quantity: number
  allow_extra_photos: boolean
  custom_photo_limit: number
  product: IProduct
  selected_photos: number[]
  remark: string
}

interface IProduct {
  id: number
  name: string
  product_type: string
}

interface IOrderProductSelectedPhoto {
  orderProductId: number
  selected_photos: number[]
}

export type IOrderResponse = ResponsePromise<IOrder>
export type IOrderProductSelectedPhotoResponse = ResponsePromise<IOrderProductSelectedPhoto>
