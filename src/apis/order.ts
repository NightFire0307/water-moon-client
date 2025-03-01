import request from '@/utils/request.ts'

export function getOrderProducts() {
  return request({
    url: '/api/selection/products',
    method: 'GET',
  })
}
