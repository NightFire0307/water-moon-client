import type { ResponsePromise } from '@/types/common.ts'

export interface IOrder {
  id: number
  customer_name: string
  customer_phone: string
  order_number: string
  status: number
  order_products: IOrderProduct[]
  total_photos: number
  max_select_photos: number
  extra_photo_price: number
}

export interface IOrderProduct {
  id: number
  count: number
  product: IProduct
  selected_photos: number[]
  remark: string
}

export interface IProduct {
  id: number
  name: string
  photo_limit: number
  product_type: string
}

interface IOrderProductSelectedPhoto {
  orderProductId: number
  selected_photos: number[]
}

export type IOrderResponse = ResponsePromise<IOrder>
export type IOrderProductSelectedPhotoResponse = ResponsePromise<IOrderProductSelectedPhoto>
