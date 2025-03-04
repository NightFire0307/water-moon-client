import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface CustomStore {
  access_token: string
}

interface CustomAction {
  updateAccessToken: (token: string) => void
}

export const useCustomStore = create<CustomStore & CustomAction>()(
  devtools(set => ({
    access_token: sessionStorage.getItem('access_token') !== 'undefined' ? sessionStorage.getItem('access_token') : '',
    updateAccessToken: (token: string) => set(() => {
      // 更新 Session Storage
      sessionStorage.setItem('access_token', token)
      return { access_token: token }
    }),
  }), {
    name: 'custom-store',
    enabled: true,
  }),
)
