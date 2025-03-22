import { login } from '@/apis/login.ts'
import { useCustomStore } from '@/stores/customStore.tsx'
import { Button, ConfigProvider, Form, Input } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [form] = useForm()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const surl = queryParams.get('surl')
  const pwd = queryParams.get('pwd')
  const { updateAccessToken } = useCustomStore()
  const navigate = useNavigate()

  function handleSubmit() {
    setIsLoading(true)
    form.validateFields()
      .then(async ({ password }) => {
        const { data } = await login({ short_url: surl, password })
        if (data) {
          updateAccessToken(data.access_token)
          navigate(`/s/${surl}`)
        }
      })
      .catch((errorInfo) => {
        console.error(errorInfo)
      })
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    if (pwd) {
      form.setFieldsValue({
        password: pwd,
      })
    }
  }, [pwd])

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#262626',
        },
      }}
    >
      <Form form={form} layout="vertical" requiredMark={false} autoComplete="off">
        <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入登录密码' }]}>
          <Input placeholder="请输入您的登录密码"></Input>
        </Form.Item>
        <Button type="primary" block loading={isLoading} onClick={handleSubmit}>登录</Button>
      </Form>
    </ConfigProvider>
  )
}

export default Login
