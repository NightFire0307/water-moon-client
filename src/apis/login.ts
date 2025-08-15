import type { IRefreshTokenResponse } from '@/types/user/login'
import request from '@/utils/request.ts'

interface LoginData {
  loginType: 'link' | 'order'
  shortUrl?: string
  orderNumber?: string
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

// 刷新 access_token
export function refreshToken(): IRefreshTokenResponse {
  return request({
    url: `/selection/auth/refresh`,
    method: 'POST',
  })
}

// 验证 access_token
export function validateToken() {
  return request({
    url: '/selection/auth/validate',
    method: 'GET',
  })
}
