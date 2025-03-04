import type { IOrderResponse } from '@/types/order.ts'
import type { IPhotoResponse } from '@/types/photos.ts'
import request from '@/utils/request.ts'

// 获取订单信息
export function getOrderInfo(surl: string): IOrderResponse {
  return request({
    url: `/api/selection/products/${surl}`,
    method: 'GET',
  })
}

// 获取订单照片
export function getOrderPhotos(): IPhotoResponse {
  return request({
    url: '/api/selection/photos',
    method: 'GET',
  })
}
