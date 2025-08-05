import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface UseAuthState {
  accessToken: string
}

interface UseAuthAction {
  setAccessToken: (accessToken: string) => void
  clearAccessToken: () => void
}

export const useAuthStore = create<UseAuthState & UseAuthAction>()(
  devtools(set => ({
    accessToken: sessionStorage.getItem('access_token') || '',
    setAccessToken: (accessToken) => {
      sessionStorage.setItem('access_token', accessToken)
      set({ accessToken })
    },
    clearAccessToken: () => set({ accessToken: '' }),
  }), {
    name: 'auth-store',
  }),
)
