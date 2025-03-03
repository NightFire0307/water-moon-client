interface IOrder {
  id: number
  customer_name: string
  customer_phone: string
  order_number: string
  status: number
  order_products: IOrderProduct[]
}

interface IOrderProduct {
  id: number
  quantity: number
  allow_extra_photos: boolean
  custom_photo_limit: number
  product: IProduct
}

interface IProduct {
  id: number
  name: string
  select_photos: number[]
}

export interface Response<T> {
  code: number
  msg: string
  data: T
}

export type IOrderResponse = Promise<Response<IOrder>>
