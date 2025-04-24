import type { AxiosError } from 'axios'
import { refreshToken } from '@/apis/login.ts'
import { useAuthStore } from '@/stores/useAuthStore.tsx'
import { message } from 'antd'
import axios from 'axios'

interface ErrorResponse {
  error: string
  msg: string
  statusCode: number
}

// create an axios instance
const service = axios.create({
  timeout: 8000,
})

// 刷新 Access_token
async function refreshAccessToken() {
  const { data } = await refreshToken()
  useAuthStore.getState().setAccessToken(data.access_token)
}

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
    if (error.response) {
      switch (error.response.status) {
        case 500:
          message.error('服务器错误，请稍后再试')
          break
        case 401:
          message.error(error.response.data.msg)

          try {
            await refreshAccessToken()
          }
          catch (e) {
            return Promise.reject(e)
          }
          break
        case (400):
          message.error(error.response.data.msg || '请求错误，请稍后再试')
          return Promise.reject(error)
        case 404:
          return Promise.reject(error)
        default:
          message.error('未知错误，请稍后再试')
      }
    }
    return Promise.resolve({ data: null, error: true, msg: '请求失败' })
  },
)

export default service
