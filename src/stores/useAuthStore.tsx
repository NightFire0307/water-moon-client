import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface UseAuthStore {
  access_token: string
  isPreview: boolean
}

interface CustomAction {
  setAccessToken: (token: string) => void
  setPreview: (isPreview: boolean) => void
}

export const useAuthStore = create<UseAuthStore & CustomAction>()(
  devtools(set => ({
    access_token: sessionStorage.getItem('access_token') !== 'undefined' ? sessionStorage.getItem('access_token') : '',
    isPreview: false,
    orderInfo: {},
    setAccessToken: (token: string) => set(() => {
      // 更新 Session Storage
      sessionStorage.setItem('access_token', token)
      return { access_token: token }
    }),
    setPreview: isPreview => set({ isPreview }),
  }), {
    name: 'custom-store',
    enabled: true,
  }),
)
