import type { Response } from '@/types/common.ts'
import type { IOrderProductSelectedPhotoResponse, IOrderResponse } from '@/types/order.ts'
import type { IPhotoResponse } from '@/types/photos.ts'
import request from '@/utils/request.ts'

// 获取订单信息
export function getOrderInfo(surl: string): IOrderResponse {
  return request({
    url: `/api/selection/${surl}/order_info`,
    method: 'GET',
  })
}

// 获取订单照片
export function getOrderPhotos(): IPhotoResponse {
  return request({
    url: '/api/selection/photos',
    method: 'GET',
    params: { pageSize: 50 },
  })
}

// 更新照片选择
export function updateOrderPhotos(data: { photoIds: number[], orderProductId: number }): IOrderProductSelectedPhotoResponse {
  return request({
    url: '/api/selection/photos',
    method: 'PATCH',
    data,
  })
}

// 移除照片的所有产品选择
export function removeAllTags(photoId: number) {
  return request({
    url: `/api/selection/photos/${photoId}/remove-all-tag`,
    method: 'PATCH',
  })
}

// 更新照片备注信息
export function updatePhotoRemark(data: { photoId: number, remark: string }): Promise<Response<number>> {
  return request({
    url: '/api/selection/photos/remark',
    method: 'PATCH',
    data,
  })
}

// 获取照片备注信息
export function getPhotoRemarkById(photoId: number) {
  return request({
    url: `/api/selection/photos/${photoId}/remark`,
    method: 'GET',
  })
}

// 锁定选片结果
export function submitSelection(orderId: number): Promise<Response<number>> {
  return request({
    url: `/api/selection/${orderId}`,
    method: 'POST',
  })
}
