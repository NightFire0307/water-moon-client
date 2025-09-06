import { useMessageStore } from '@/stores/useMessageStore'
import { message } from 'antd'
import { useEffect } from 'react'

/**
 * 全局消息处理组件
 * @returns
 */
function MessageHandle() {
  const [messageApi, contextHolder] = message.useMessage()
  const { messages, removeMessage } = useMessageStore()

  useEffect(() => {
    messages.forEach((msg) => {
      messageApi[msg.type](msg.content)
      removeMessage(msg.id)
    })
  }, [messageApi, messages, removeMessage])

  return (
    <>
      {contextHolder}
    </>
  )
}

export default MessageHandle
