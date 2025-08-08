import type { Response } from '@/types/common/apiResponse'
import type { PaginationParams } from '@/types/common/pagination'
import type { IPhotoResponse } from '@/types/photos.ts'
import type { UpdatePreselectRequest } from '@/types/selection/preSelection'
import type { UpdateProductSelectRequest } from '@/types/selection/productSelection'
import type { IOrderResponse } from '@/types/user/order'
import request from '@/utils/request.ts'

// 获取订单信息
export function getOrderInfo(): IOrderResponse {
  return request({
    url: `/selection/order`,
    method: 'GET',
  })
}

// 获取订单照片
export function getOrderPhotos(params?: PaginationParams): IPhotoResponse {
  return request({
    url: '/selection/photos',
    method: 'GET',
    params,
  })
}

// 锁定选片结果
export function submitSelection(orderId: number): Promise<Response<number>> {
  return request({
    url: `/selection/${orderId}`,
    method: 'POST',
  })
}

// 更新预选状态
export function updatePreSelectedPhotos(data: UpdatePreselectRequest) {
  return request({
    url: '/selection/preselected-photos',
    method: 'PATCH',
    data,
  })
}

// 更新产品分片状态
export function updateProductPhotos(data: UpdateProductSelectRequest) {
  return request({
    url: '/selection/product-photos',
    method: 'POST',
    data,
  })
}
