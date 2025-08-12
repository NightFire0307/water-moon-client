import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { getOrderInfo } from './apis/order'
import FullScreenLoading from './components/FullScreenLoading/FullScreenLoading'
import { useFullScreenLoading } from './components/FullScreenLoading/useFullScreenLoading'
import { useOrderStore } from './stores/useOrderStore'
import { usePhotosStore } from './stores/usePhotosStore'
import { useProductsStore } from './stores/useProductsStore'
import { OrderStatus } from './types/user/order'
import './App.css'

function App() {
  const { setOrderInfo } = useOrderStore()
  const { generateProducts } = useProductsStore()
  const { fetchPhotos } = usePhotosStore()
  const navigate = useNavigate()
  const orderInfo = useOrderStore(state => state.orderInfo)
  const { showLoading, hideLoading } = useFullScreenLoading()

  // 获取订单信息
  const fetchOrderInfo = async () => {
    const { data } = await getOrderInfo()
    setOrderInfo(data)
    generateProducts(data.orderProducts)
  }

  useEffect(() => {
    fetchPhotos()
    fetchOrderInfo()
  }, [])

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

    </ConfigProvider>
  )
}

export default App
