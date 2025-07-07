import type { IRefreshTokenResponse } from '@/types/login.ts'
import request from '@/utils/request.ts'

interface LoginData {
  login_type: 'link' | 'order'
  short_url?: string
  order_number?: string
  credential: string
}

export function login(data: LoginData) {
  return request({
    url: '/selection/login',
    method: 'post',
    data,
  })
}

// 校验短链和token
export function verifyShortUrl(shortUrl: string) {
  return request({
    url: `/selection/auth/verify/${shortUrl}`,
    method: 'POST',
  })
}

// 刷新access_token
export function refreshToken(): IRefreshTokenResponse {
  return request({
    url: `/selection/auth/refresh`,
    method: 'POST',
  })
}
