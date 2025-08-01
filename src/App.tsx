import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { useEffect } from 'react'
import { Outlet } from 'react-router'
import { getOrderInfo } from './apis/order'
import FullScreenLoading from './components/FullScreenLoading/FullScreenLoading'
import { useOrderStore } from './stores/useOrderStore'
import { usePhotosStore } from './stores/usePhotosStore'
import { useProductsStore } from './stores/useProductsStore'
import './App.css'

function App() {
  const { generateProducts } = useProductsStore()
  const { fetchPhotos } = usePhotosStore()
  const { setOrderInfo } = useOrderStore()

  const fetchOrderInfo = async () => {
    const { data } = await getOrderInfo()
    setOrderInfo(data)
    generateProducts(data.order_products)
  }

  useEffect(() => {
    fetchPhotos()
    fetchOrderInfo()
  }, [])

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
          colorBgContainer: '#1e293b',
          colorBorder: '#475569',
        },
        components: {
          Modal: {
            contentBg: '#1e293b',
          },
          Button: {
            borderColorDisabled: '#475569',
            defaultBg: '#334155',
            defaultColor: '#e2e8f0',
            defaultBorderColor: '#475569',
            defaultActiveBg: '#0f172a',
            defaultActiveBorderColor: '#1e293b',
            defaultActiveColor: '#e2e8f0',
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
    </ConfigProvider>
  )
}

export default App
