import type { IOrderResponse } from '@/types/order.ts'
import request from '@/utils/request.ts'

// 获取订单信息
export function getOrderInfo(surl: string): IOrderResponse {
  return request({
    url: `/api/selection/products/${surl}`,
    method: 'GET',
  })
}
