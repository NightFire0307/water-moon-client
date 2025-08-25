import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface MessageStore {
  messages: {
    id: number
    type: 'info' | 'error' | 'success' | 'warning'
    content: string
  }[]
}

interface MessageActions {
  addMessage: (type: 'info' | 'error' | 'success' | 'warning', content: string) => void
  removeMessage: (id: number) => void
}

/**
 *  全局消息通知状态管理
 */
export const useMessageStore = create<MessageStore & MessageActions>()(
  devtools(set => ({
    messages: [],
    addMessage: (type, content) => set((state) => {
      const id = Date.now()
      return {
        messages: [...state.messages, { id, type, content }],
      }
    }),
    removeMessage: id => set(state => ({
      messages: state.messages.filter(msg => msg.id !== id),
    })),
  }), {
    name: 'message-store',
  }),
)
