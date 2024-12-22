import { Button, ConfigProvider, Form, Input } from 'antd'
import { useState } from 'react'

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)

  function handleSubmit() {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#262626',
        },
      }}
    >
      <Form layout="vertical" autoComplete="off">
        <Form.Item label="手机号">
          <Input placeholder="请输入您的手机号"></Input>
        </Form.Item>
        <Form.Item label="密码">
          <Input type="password" placeholder="请输入您的密码"></Input>
        </Form.Item>
        <Button type="primary" block loading={isLoading} onClick={handleSubmit}>登录</Button>
      </Form>
    </ConfigProvider>
  )
}
