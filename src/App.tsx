import { LogoutOutlined } from '@ant-design/icons'
import { ConfigProvider, FloatButton, Modal } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { logout } from './apis/login'
import { getOrderInfo } from './apis/order'
import FullScreenLoading from './components/FullScreenLoading/FullScreenLoading'
import { useFullScreenLoading } from './components/FullScreenLoading/useFullScreenLoading'
import MessageHandle from './components/MessageHandle/MessageHandle'
import { useAuthStore } from './stores/useAuthStore'
import { useOrderStore } from './stores/useOrderStore'
import { usePhotosStore } from './stores/usePhotosStore'
import { useProductsStore } from './stores/useProductsStore'
import { OrderStatus } from './types/user/order'
import './App.css'

function App() {
  const { clearAccessToken } = useAuthStore()
  const { setOrderInfo, resetOrder } = useOrderStore()
  const { setProducts, products, resetProducts } = useProductsStore()
  const { fetchPhotos, resetPhotos } = usePhotosStore()
  const navigate = useNavigate()
  const orderInfo = useOrderStore(state => state.orderInfo)
  const { showLoading, hideLoading } = useFullScreenLoading()
  const { accessToken } = useAuthStore()

  // 获取订单信息
  const fetchOrderInfo = async () => {
    const { data } = await getOrderInfo()
    setOrderInfo(data)

    if (products.length === 0) {
      setProducts(data.orderProducts)
    }
  }

  // 处理退出登录
  const handleLogout = () => {
    Modal.confirm({
      title: '确认要退出选片系统吗？',
      centered: true,

      onOk: async () => {
        await logout()
        resetPhotos()
        resetProducts()
        resetOrder()
        clearAccessToken()
        window.localStorage.clear()
        window.sessionStorage.clear()
        navigate('/login')
      },
      onCancel: () => {
        // 取消操作
      },
    })
  }

  useEffect(() => {
    if (!accessToken)
      return

    fetchOrderInfo()
    fetchPhotos()
  }, [accessToken])

  // 判断当前订单状态是否为预选,如果不是则跳转到相应页面
  useEffect(() => {
    showLoading()
    if (OrderStatus.PRODUCT_SELECT === orderInfo?.status) {
      setTimeout(() => {
        hideLoading()
        navigate('/product-select')
      }, 500)
    }
    hideLoading()
  }, [orderInfo])

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorBgElevated: '#334155',
          colorText: '#f8fafc',
          colorTextDisabled: '#64748b',
          colorTextDescription: '#94a3b8',
          controlItemBgHover: '#475569',
        },
        components: {
          Modal: {
            contentBg: '#1e293b',
          },
          Button: {
            borderColorDisabled: '#475569',
            defaultBg: '#334155',
            defaultColor: '#e2e8f0',
            defaultActiveBg: '#0f172a',
            defaultActiveBorderColor: '#1e293b',
            defaultActiveColor: '#e2e8f0',
            defaultBorderColor: '#475569',
            defaultHoverBg: '#475569',
            defaultHoverBorderColor: '#475569',
            defaultHoverColor: '#ffffff',
            textTextColor: '#94a3b8',
            textHoverBg: '#475569',
            textTextActiveColor: '#cbd5e1',
            textTextHoverColor: '#f8fafc',
          },
          Dropdown: {
            colorBgElevated: '#1e293b',
            colorText: '#f1f5f9',
            controlItemBgHover: '#334155',
            colorTextDisabled: '#64748b',
            borderRadiusLG: 12,
          },
        },
      }}
    >
      <Outlet />
      <FullScreenLoading />
      <MessageHandle />

      {/* 浮动按钮 */}
      <FloatButton
        icon={<LogoutOutlined />}
        className="right-8 bottom-24"
        onClick={handleLogout}
      />

    </ConfigProvider>
  )
}

export default App
