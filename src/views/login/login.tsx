import { login, verifyShortUrl } from '@/apis/login.ts'
import { useAuthStore } from '@/stores/useAuthStore.tsx'
import { ArrowRightOutlined, LockOutlined, MobileOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Form, Input, message } from 'antd'
import { createStyles } from 'antd-style'
import { useForm } from 'antd/es/form/Form'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

interface ILoginForm {
  order_number?: string
  credential: string
}

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
  const [loginType, setLoginType] = useState<'link' | 'order'>('link')
  const [form] = useForm<ILoginForm>()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const surl = queryParams.get('surl')
  const pwd = queryParams.get('pwd')
  const { setAccessToken } = useAuthStore()
  const navigate = useNavigate()
  const { styles } = useStyle()

  async function handleSubmit() {
    setIsLoading(true)

    try {
      await form.validateFields()
      const values = form.getFieldsValue()
      const { data } = await login({
        login_type: loginType,
        short_url: surl || '',
        ...values,
      })
      setAccessToken(data.accessToken)
      message.success('登录成功')
      navigate('/order')
    }
    catch (err) {
      console.error(err)
    }
    finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!surl) {
      navigate('/')
      setLoginType('order')
    }
    else {
      verifyShortUrl(surl)
        .catch(() => {
          navigate('/')
          setLoginType('order')
        })
    }
  }, [surl])

  useEffect(() => {
    if (pwd) {
      form.setFieldsValue({
        credential: pwd,
      })
    }
  }, [pwd, form])

  return (
    <ConfigProvider
      button={{ className: styles.linearGradientButton }}
      theme={{
        components: {
          Input: {
            activeBorderColor: '#475569',
            activeShadow: '#020617',
            hoverBorderColor: '#94a3b8',
          },
        },
      }}
    >
      <Form form={form} layout="vertical" requiredMark={false} autoComplete="off">
        {
          loginType === 'order' && (
            <Form.Item name="order_number" label="订单号" rules={[{ required: true, message: '请输入你的订单号' }]}>
              <Input placeholder="请输入您的订单号" prefix={<MobileOutlined />}></Input>
            </Form.Item>
          )
        }
        <Form.Item
          name="credential"
          label={loginType === 'link' ? '动态密码' : '手机号'}
          rules={[{ required: true, message: '请输入您的密码' }]}
        >
          <Input
            placeholder={loginType === 'link' ? '请输入你的动态密码' : '请输入你的手机号'}
            prefix={<LockOutlined />}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmit()
              }
            }}
          >
          </Input>
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
