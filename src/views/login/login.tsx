import { ArrowRightOutlined, LockOutlined, MobileOutlined, UserOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Form, Input, message, Switch, Typography } from 'antd'
import { createStyles } from 'antd-style'
import { useForm } from 'antd/es/form/Form'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { login, verifyShortUrl } from '@/apis/login.ts'
import Segmented from '@/components/Segmented/Segmented'
import { useAuthStore } from '@/stores/useAuthStore.tsx'

const { Text } = Typography

interface ILoginForm {
  order_number?: string
  credential: string
}

const useStyle = createStyles(({ prefixCls, css }) => ({
  loginContainer: css`
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(71, 85, 105, 0.3);
  `,
  inputField: css`
    &.${prefixCls}-input {
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(51, 65, 85, 0.6);
      color: #f8fafc;
      border-radius: 16px;
      padding: 16px 20px;
      font-size: 15px;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      
      &:hover {
        border-color: rgba(59, 130, 246, 0.7);
        background: rgba(15, 23, 42, 0.9);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
      }
      
      &:focus {
        border-color: #3b82f6;
        background: rgba(15, 23, 42, 1);
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2), 0 4px 12px rgba(59, 130, 246, 0.15);
      }
      
      &::placeholder {
        color: #64748b;
      }
    }
    
    &.${prefixCls}-input-affix-wrapper {
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(51, 65, 85, 0.6);
      border-radius: 16px;
      padding: 16px 20px;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      
      &:hover {
        border-color: rgba(59, 130, 246, 0.7);
        background: rgba(15, 23, 42, 0.9);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
      }
      
      &.${prefixCls}-input-affix-wrapper-focused {
        border-color: #3b82f6;
        background: rgba(15, 23, 42, 1);
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2), 0 4px 12px rgba(59, 130, 246, 0.15);
      }
      
      input {
        background: transparent !important;
        border: none !important;
        color: #f8fafc;
        font-size: 15px;
        
        &::placeholder {
          color: #64748b;
        }
      }
      
      .${prefixCls}-input-prefix {
        color: #64748b;
        margin-right: 16px;
        font-size: 16px;
      }
    }
  `,
  primaryButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      border: none;
      border-radius: 16px;
      height: 56px;
      font-size: 16px;
      font-weight: 600;
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s;
      }
      
      &:hover {
        background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
        transform: translateY(-2px);
        box-shadow: 0 12px 35px rgba(59, 130, 246, 0.5);
        
        &::before {
          left: 100%;
        }
      }
      
      &:active {
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
      }
    }
  `,
  switchButton: css`
    background: rgba(51, 65, 85, 0.8);
    border: 1px solid rgba(71, 85, 105, 0.5);
    border-radius: 8px;
    color: #cbd5e1;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(71, 85, 105, 0.8);
      border-color: rgba(100, 116, 139, 0.6);
      color: #f8fafc;
    }
  `,
}))

function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [loginType, setLoginType] = useState<'link' | 'order'>('order')
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
      navigate('/order-info')
    }
    catch (err) {
      console.error(err)
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleLoginTypeSwitch = () => {
    setLoginType(loginType === 'order' ? 'link' : 'order')
    form.resetFields()
  }

  useEffect(() => {
    if (pwd) {
      form.setFieldsValue({
        credential: pwd,
      })
    }
  }, [pwd, form])

  return (
    <div className="relative">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative"
      >
        {/* 登录类型切换 */}
        <div className='flex justify-center'>
          <Segmented options={[{ label: '订单登录', value: 'order' }, { label: '动态链接', value: 'link' }]} />
        </div>

        <ConfigProvider
          theme={{
            components: {
              Form: {
                labelColor: '#e2e8f0',
                labelFontSize: 15,
              },
              Input: {
                colorText: '#f8fafc',
                colorTextPlaceholder: '#64748b',
                colorBgContainer: 'rgba(15, 23, 42, 0.8)',
                colorBorder: 'rgba(51, 65, 85, 0.6)',
                colorPrimaryHover: 'rgba(59, 130, 246, 0.7)',
                controlHeight: 56,
                borderRadius: 16,
              },
            },
          }}
        >
          <Form form={form} layout="vertical" requiredMark={false} autoComplete="off" className="space-y-6">
            {loginType === 'order' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Form.Item
                  name="order_number"
                  label={<Text className="text-darkBlueGray-200 font-semibold text-base">订单号</Text>}
                  rules={[{ required: true, message: '请输入您的订单号' }]}
                >
                  <Input
                    className={styles.inputField}
                    placeholder="请输入您的订单号"
                    prefix={<MobileOutlined className="text-darkBlueGray-400" />}
                    size="large"
                  />
                </Form.Item>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Form.Item
                name="credential"
                label={(
                  <Text className="text-darkBlueGray-200 font-semibold text-base">
                    {loginType === 'link' ? '动态密码' : '手机号'}
                  </Text>
                )}
                rules={[{ required: true, message: `请输入您的${loginType === 'link' ? '动态密码' : '手机号'}` }]}
              >
                <Input
                  className={styles.inputField}
                  placeholder={loginType === 'link' ? '请输入您的动态密码' : '请输入您的手机号'}
                  prefix={<LockOutlined className="text-darkBlueGray-400" />}
                  size="large"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSubmit()
                    }
                  }}
                />
              </Form.Item>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="pt-4"
            >
              <Button
                type="primary"
                block
                size="large"
                loading={isLoading}
                onClick={handleSubmit}
                className={styles.primaryButton}
                icon={!isLoading && <ArrowRightOutlined />}
                iconPosition="end"
              >
                {isLoading ? '正在登录...' : '进入选片系统'}
              </Button>
            </motion.div>
          </Form>
        </ConfigProvider>

        {/* 登录提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <Text className="text-darkBlueGray-400 text-sm font-medium">
              {loginType === 'order'
                ? '请使用您的订单号和手机号登录'
                : '请使用收到的动态链接密码登录'}
            </Text>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Login
