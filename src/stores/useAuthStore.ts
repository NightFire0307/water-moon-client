import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface UseAuthState {
  accessToken: string
  shouldRedirectLogin: boolean
}

interface UseAuthAction {
  setAccessToken: (accessToken: string) => void
  clearAccessToken: () => void
  setShouldRedirectLogin: (shouldRedirectLogin: boolean) => void
}

export const useAuthStore = create<UseAuthState & UseAuthAction>()(
  devtools(set => ({
    accessToken: sessionStorage.getItem('access_token') || '',
    shouldRedirectLogin: false,
    setAccessToken: (accessToken) => {
      sessionStorage.setItem('access_token', accessToken)
      set({ accessToken })
    },
    clearAccessToken: () => {
      set({ accessToken: '' })
      sessionStorage.removeItem('access_token')
    },
    setShouldRedirectLogin: shouldRedirectLogin => set({ shouldRedirectLogin }),
  }), {
    name: 'auth-store',
  }),
)
