import CustomModal from '@/components/CustomModal/CustomModal.tsx'
import MessageHandle from '@/components/MessageHandle/MessageHandle.tsx'
import { LogoutOutlined } from '@ant-design/icons'
import { ConfigProvider, FloatButton } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { logout } from './apis/login'
import { getOrderInfo } from './apis/order'
import { WarningIcon } from './assets/icon'
import FullScreenLoading from './components/FullScreenLoading/FullScreenLoading'
import GuideManager from './components/Guide/GuideManager'
import { useAuthStore } from './stores/useAuthStore'
import { useOrderStore } from './stores/useOrderStore'
import { usePhotosStore } from './stores/usePhotosStore'
import { useProductsStore } from './stores/useProductsStore'
import { DarkBlueTheme } from './theme/default'
import { OrderStatus } from './types/user/order'
import './App.css'

function App() {
  const [logOutModalOpen, setLogOutModalOpen] = useState(false)
  const { setOrderInfo, resetOrder, orderInfo } = useOrderStore()
  const { setProducts, resetProducts } = useProductsStore()
  const { fetchPhotos, resetPhotos } = usePhotosStore()
  const { accessToken, clearAccessToken } = useAuthStore()
  const navigate = useNavigate()

  // 获取订单信息
  const fetchOrderInfo = async () => {
    const { data } = await getOrderInfo()
    setOrderInfo(data)
    setProducts(data.orderProducts)

    await fetchPhotos()
  }

  // 处理退出登录
  const handleLogout = async () => {
    await logout()
    resetPhotos()
    resetProducts()
    resetOrder()
    clearAccessToken()
    window.localStorage.clear()
    window.sessionStorage.clear()
    navigate('/login')
  }

  useEffect(() => {
    if (!accessToken)
      return

    fetchOrderInfo()
  }, [accessToken])

  return (
    <ConfigProvider
      locale={zhCN}
      theme={DarkBlueTheme}
    >
      <Outlet />
      <FullScreenLoading />
      <MessageHandle />

      {/* 退出登录确认弹窗 */}
      <CustomModal
        title={(
          <div className="flex items-center gap-2">
            <WarningIcon className="text-amber-500 text-2xl" />
            <span>是否确认退出选片？</span>
          </div>
        )}
        centered
        open={logOutModalOpen}
        closable={false}
        onOk={handleLogout}
        onCancel={() => setLogOutModalOpen(false)}
      />

      {/* 浮动按钮 */}
      {/* <FloatButton
        icon={<LogoutOutlined />}
        className="right-8 bottom-24"
        onClick={() => setLogOutModalOpen(true)}
      /> */}

      {/* 引导组件 */}
      <GuideManager />

    </ConfigProvider>
  )
}

export default App
