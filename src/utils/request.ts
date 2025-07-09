import type { AxiosError, AxiosRequestConfig } from 'axios'
import { refreshToken } from '@/apis/login.ts'
import { useAuthStore } from '@/stores/useAuthStore.tsx'
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
let isRefreshing = false
// 缓存请求队列
let failedQueue: (() => void)[] = []

// create an axios instance
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 8000,
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    const { access_token } = useAuthStore.getState()

    // 设置请求头部 Authorization
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`
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

          if (originalRequest && !originalRequest._retry) {
            originalRequest._retry = true
            if (!isRefreshing) {
              isRefreshing = true
              try {
                // 尝试刷新 Access_token
                const { data } = await refreshToken()
                // 更新 Access_token
                useAuthStore.getState().setAccessToken(data.access_token)

                // 重发失败请求
                failedQueue.forEach(cb => cb())
                failedQueue = []

                return service(originalRequest)
              }
              catch (err) {
                failedQueue.forEach(cb => cb())
                failedQueue = []

                useAuthStore.getState().redirectLogin()
                return Promise.reject(err)
              }
              finally {
                isRefreshing = false
              }
            }

            // 如果正在刷新 Access_token，将请求添加到队列中
            return new Promise((resolve) => {
              // 将请求队列添加到缓存中
              failedQueue.push(() => {
                if (originalRequest && originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${useAuthStore.getState().access_token}`
                }
                if (originalRequest) {
                  resolve(service(originalRequest))
                }
              })
            })
          }

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
