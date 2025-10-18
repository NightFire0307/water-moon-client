import CustomModal from '@/components/CustomModal/CustomModal.tsx'
import MessageHandle from '@/components/MessageHandle/MessageHandle.tsx'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { AlertTriangleIcon } from 'lucide-react'
import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { logout } from './apis/login'
import FullScreenLoading from './components/FullScreenLoading/FullScreenLoading'
import GuideManager from './components/Guide/GuideManager'
import { useHotkeys } from './hooks/useHotkeys'
import { useAuthStore } from './stores/useAuthStore'
import { useOrderStore } from './stores/useOrderStore'
import { usePhotosStore } from './stores/usePhotosStore'
import { useProductsStore } from './stores/useProductsStore'
import { DarkBlueTheme } from './theme/default'
import './App.css'

function App() {
  const [logOutModalOpen, setLogOutModalOpen] = useState(false)
  const { clearOrder } = useOrderStore()
  const { clearAccessToken } = useAuthStore()
  const { resetProducts } = useProductsStore()
  const { resetPhotos } = usePhotosStore()
  const navigate = useNavigate()
  useHotkeys([
    {
      key: 'escape',
      cb: () => setLogOutModalOpen(true),
    },
  ])

  async function handleLogOut() {
    try {
      await logout()
      clearOrder()
      clearAccessToken()
      resetProducts()
      resetPhotos()
      setLogOutModalOpen(false)
      navigate('login')
    }
    catch (err) {
      console.error('Logout failed:', err)
    }
  }

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
          <div className="flex justify-center items-center gap-2">
            <AlertTriangleIcon className="text-amber-500" />
            <span>确定要退出选片流程？</span>
          </div>
        )}
        centered
        open={logOutModalOpen}
        closable={false}
        onOk={handleLogOut}
        onCancel={() => setLogOutModalOpen(false)}
      />

      {/* 引导组件 */}
      <GuideManager />

    </ConfigProvider>
  )
}

export default App
