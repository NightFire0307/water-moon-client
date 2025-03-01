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
    access_token: '',
    updateAccessToken: (token: string) => set({ access_token: token }),
  }), {
    name: 'custom-store',
    enabled: true,
  }),
)
