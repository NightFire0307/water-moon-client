import type { AxiosError, AxiosRequestConfig } from 'axios'
import { refreshToken } from '@/apis/login.ts'
import { useAuthStore } from '@/stores/useAuthStore'
import { message } from 'antd'
import axios from 'axios'

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean // 用于标记是否重试过请求
}

interface ErrorResponse {
  error: string
  msg: string
  statusCode: number
}

// 定义是否需要刷新 Access_token 的标志
const isRefreshing = false
// 缓存请求队列
const failedQueue: (() => void)[] = []

// create an axios instance
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 8000,
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState()

    // 设置请求头部 Authorization
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    console.error(error)
    return Promise.reject(error)
  },
)

// response interceptor
service.interceptors.response.use(
  (response) => {
    return response.data
  },
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config as CustomAxiosRequestConfig

    if (error.response) {
      switch (error.response.status) {
        case 500:
          message.error('服务器错误，请稍后再试')
          break
        case 403:
          message.error('登录已过期，请重新登录')
          return Promise.reject(error)
        case 401:
          return Promise.reject(error)
        case (400):
          message.error(error.response.data.msg || '请求错误，请稍后再试')
          return Promise.reject(error)
        default:
          message.error(error.response.data.msg)
          return Promise.reject(error)
      }
    }
    return Promise.resolve({ data: null, error: true, msg: '请求失败' })
  },
)

export default service
