import { login } from '@/apis/login.ts'
import { useCustomStore } from '@/stores/customStore.tsx'
import { Button, ConfigProvider, Form, Input } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

interface LoginProps {
  surl: string
  pwd: string
}

export function Login({ surl, pwd }: LoginProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [form] = useForm()
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
    <div className="flex h-screen">
      {/* Left side - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              欢迎使用在线选片服务
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              请登录以开始挑选您的完美照片
            </p>
          </div>
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
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden md:block md:w-1/2 relative bg-gray-500">
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-white text-center">
            <h1 className="text-4xl font-bold mb-4">捕捉精彩瞬间</h1>
            <p className="text-xl">轻松挑选，永久珍藏</p>
          </div>
        </div>
      </div>
    </div>
  )
}
