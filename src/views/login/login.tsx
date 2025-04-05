import { login, verifySurl } from '@/apis/login.ts'
import { useCustomStore } from '@/stores/customStore.tsx'
import { ArrowRightOutlined, LockOutlined, MobileOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Form, Input } from 'antd'
import { createStyles } from 'antd-style'
import { useForm } from 'antd/es/form/Form'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
      > span {
        position: relative;
      }
        
      & {
          background: #1e293b;
      }

      &::before {
        content: '';
        background: linear-gradient(90deg, #324054, #1e293b);
        position: absolute;
        inset: -1px;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
}))

function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [loginType, setLoginType] = useState<'link' | 'phone'>('link')
  const [form] = useForm()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const surl = queryParams.get('surl')
  const pwd = queryParams.get('pwd')
  const { updateAccessToken } = useCustomStore()
  const navigate = useNavigate()
  const { styles } = useStyle()

  function handleSubmit() {
    setIsLoading(true)
    form.validateFields()
      .then(async ({ password }) => {
        const { data } = await login({ short_url: surl || '', password })
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
    if (!surl) {
      setLoginType('phone')
    }
    else {
      verifySurl(surl).then().catch(() => setLoginType('phone'))
    }
  }, [surl])

  useEffect(() => {
    if (pwd) {
      form.setFieldsValue({
        password: pwd,
      })
    }
  }, [pwd, form])

  return (
    <ConfigProvider
      button={{ className: styles.linearGradientButton }}
      theme={{
        components: {
          Input: {
            activeBorderColor: '#94a3b8',
            activeShadow: '0 0 0 2px rgba(0, 0, 0, 0.06)',
            hoverBorderColor: '#94a3b8',
          },
        },
      }}
    >
      <Form form={form} layout="vertical" requiredMark={false} autoComplete="off">
        {
          loginType === 'phone' && (
            <Form.Item name="phone" label="手机号" rules={[{ required: true, message: '请输入您的手机号' }]}>
              <Input placeholder="请输入您的手机号" prefix={<MobileOutlined />}></Input>
            </Form.Item>
          )
        }
        <Form.Item name="password" label="动态密码" rules={[{ required: true, message: '请输入您的动态密码' }]}>
          <Input placeholder="请输入您的动态密码" prefix={<LockOutlined />}></Input>
        </Form.Item>
        <Button
          type="primary"
          block
          loading={isLoading}
          onClick={handleSubmit}
          icon={<ArrowRightOutlined />}
          iconPosition="end"
        >
          进入选片系统
        </Button>
      </Form>
    </ConfigProvider>
  )
}

export default Login
