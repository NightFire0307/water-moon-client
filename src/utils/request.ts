import type { AxiosError } from 'axios'
import { refreshToken } from '@/apis/login.ts'
import { useCustomStore } from '@/stores/customStore.tsx'
import { message } from 'antd'
import axios from 'axios'

interface ErrorResponse {
  error: string
  message: string
  statusCode: number
}

// create an axios instance
const service = axios.create({
  timeout: 8000,
})

let isRefreshing = false

// 刷新 Access_token
async function refreshAccessToken() {
  const { data } = await refreshToken()
  useCustomStore.getState().updateAccessToken(data.access_token)
}

// request interceptor
service.interceptors.request.use(
  (config) => {
    const { access_token } = useCustomStore.getState()

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
          message.error(error.response.data.message)
          break
        case (400):
          message.error(error.response.data.message || '请求错误，请稍后再试')
          isRefreshing = true

          try {
            await refreshAccessToken()
          }
          catch (e) {
            return Promise.reject(e)
          }
          finally {
            isRefreshing = false
          }
          break
        default:
          message.error('未知错误，请稍后再试')
      }
    }
    return Promise.resolve({ data: null, error: true, message: '请求失败' })
  },
)

export default service
