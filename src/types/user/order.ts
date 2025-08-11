import type { ResponsePromise } from '@/types/common/apiResponse'

export enum OrderStatus {
  PENDING = 'pending', // 订单已创建，等待用户选片
  PRE_SELECT = 'pre_select', // 预选阶段
  PRODUCT_SELECT = 'product_select', // 产品选片阶段
  SUBMITTED = 'submitted', // 已提交，订单锁定
  CANCEL = 'cancel', // 订单取消
  FINISHED = 'finished', // 订单完成
}

export interface IOrder {
  id: number
  customerName: string
  customerPhone: string
  orderNumber: string
  orderProducts: IOrderProduct[]
  status: OrderStatus
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
    photoId: number
    remark?: string
  }[]
  remark?: string
}

export type IOrderResponse = ResponsePromise<IOrder>
