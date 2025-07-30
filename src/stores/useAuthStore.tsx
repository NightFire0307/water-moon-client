import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface UseAuthState {
  access_token: string
}

interface CustomAction {
  setAccessToken: (token: string) => void
  redirectLogin: () => void
}

export const useAuthStore = create<UseAuthState & CustomAction>()(
  devtools(set => ({
    access_token: sessionStorage.getItem('access_token') !== 'undefined' ? sessionStorage.getItem('access_token') : '',
    isPreview: false,
    orderInfo: {},
    setAccessToken: (token: string) => set(() => {
      // 更新 Session Storage
      sessionStorage.setItem('access_token', token)
      return { access_token: token }
    }),
    redirectLogin: () => {
      // 清除 Session Storage 中的 access_token
      sessionStorage.removeItem('access_token')
      // 重定向到登录页面
      setTimeout(() => {
        window.location.href = '/'
      }, 1500)
    },
  }), {
    name: 'custom-store',
    enabled: true,
  }),
)
