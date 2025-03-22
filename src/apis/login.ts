import type { IRefreshTokenResponse } from '@/types/login.ts'
import request from '@/utils/request.ts'

export function login(data: { short_url: string, password: string }) {
  return request({
    url: '/api/selection/auth',
    method: 'post',
    data,
  })
}

// 校验短链和token
export function validSurlAndToken(surl: string) {
  return request({
    url: `/api/selection/auth/verify/${surl}`,
    method: 'POST',
  })
}

// 刷新access_token
export function refreshToken(): IRefreshTokenResponse {
  return request({
    url: `/api/selection/auth/refresh`,
    method: 'POST',
  })
}
