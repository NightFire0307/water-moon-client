import { useMessageStore } from '@/stores/useMessageStore'
import { message } from 'antd'
import { useEffect } from 'react'

/**
 * 全局消息处理组件
 * @returns
 */
function MessageHandle() {
  const { messages, removeMessage } = useMessageStore()

  useEffect(() => {
    messages.forEach((msg) => {
      message[msg.type](msg.content)
      removeMessage(msg.id)
    })
  }, [messages])

  return null
}

export default MessageHandle
