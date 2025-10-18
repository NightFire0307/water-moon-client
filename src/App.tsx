import CustomModal from '@/components/CustomModal/CustomModal.tsx'
import MessageHandle from '@/components/MessageHandle/MessageHandle.tsx'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { useState } from 'react'
import { Outlet } from 'react-router'
import { WarningIcon } from './assets/icon'
import FullScreenLoading from './components/FullScreenLoading/FullScreenLoading'
import GuideManager from './components/Guide/GuideManager'
import { useHotkeys } from './hooks/useHotkeys'
import { DarkBlueTheme } from './theme/default'
import './App.css'

function App() {
  const [logOutModalOpen, setLogOutModalOpen] = useState(false)
  useHotkeys([
    {
      key: 'escape',
      cb: () => {
        console.log('退出系统')
      },
    },
  ])

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
        onCancel={() => setLogOutModalOpen(false)}
      />

      {/* 引导组件 */}
      <GuideManager />

    </ConfigProvider>
  )
}

export default App
