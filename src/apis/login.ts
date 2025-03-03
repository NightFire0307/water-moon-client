import request from '@/utils/request.ts'

export function login(data: { short_url: string, password: string }) {
  return request({
    url: '/api/selection/validate',
    method: 'post',
    data,
  })
}

// 校验短链和token
export function validSurlAndToken(surl: string) {
  return request({
    url: `/api/selection/verify/${surl}`,
    method: 'POST',
  })
}
