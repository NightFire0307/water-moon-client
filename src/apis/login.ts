import request from '@/utils/request.ts'

export function login(data: { short_url: string, password: string }) {
  return request({
    url: '/api/selection/login',
    method: 'post',
    data,
  })
}
