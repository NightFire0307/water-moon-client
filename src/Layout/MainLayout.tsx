import type { IOrder } from '@/types/order.ts'
import { refreshToken, verifySurl } from '@/apis/login.ts'
import { getOrderInfo } from '@/apis/order.ts'
import Navbar from '@/components/Navbar'
import PreviewAlert from '@/components/PreviewAlert/PreviewAlert.tsx'
import Sidebar from '@/components/Sidebar'
import { OrderInfoContext } from '@/contexts/OrderInfoContext.ts'
import { useAuthStore } from '@/stores/useAuthStore.tsx'
import { usePhotosStore } from '@/stores/usePhotosStore.tsx'
import { useProductsStore } from '@/stores/useProductsStore.tsx'
import { ConfigProvider, Layout } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import cs from 'classnames'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router'

const { Sider, Content, Header } = Layout

function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [orderInfo, setOrderInfo] = useState<IOrder>({} as IOrder)
  const { access_token, isPreview, setPreview } = useAuthStore()
  const fetchPhotos = usePhotosStore(state => state.fetchPhotos)
  const generateProducts = useProductsStore(state => state.generateProducts)
  const updateAccessToken = useAuthStore(state => state.updateAccessToken)

  const { surl } = useParams()
  const navigate = useNavigate()

  async function verify(surl: string) {
    try {
      await verifySurl(surl)
    }
    catch {
      navigate('/')
    }
  }

  async function fetchOrderInfo(surl: string) {
    const { data } = await getOrderInfo(surl)
    if (data.status === 2)
      setPreview(true)
    setOrderInfo(data)
    generateProducts(data.order_products)
  }

  useEffect(() => {
    if (surl) {
      (async () => {
        // 刷新 access_token
        if (!access_token) {
          try {
            const { data } = await refreshToken()
            updateAccessToken(data.access_token)
          }
          catch {
            navigate('/')
          }
        }

        // 验证短链和 token
        try {
          await verify(surl)
          await fetchOrderInfo(surl)
          await fetchPhotos()
        }
        catch (err) {
          console.error(err)
          // navigate('/404')
        }
      })()
    }
  }, [surl])

  return (
    <OrderInfoContext.Provider value={orderInfo}>
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
              defaultBg: '#1e293b',
              defaultColor: '#e2e8f0',
              defaultBorderColor: '#334155',
              defaultActiveBg: '#0f172a',
              defaultActiveBorderColor: '#1e293b',
              defaultActiveColor: '#e2e8f0',
              defaultHoverBg: '#334155',
              defaultHoverBorderColor: '#475569',
              defaultHoverColor: '#ffffff',
              textTextColor: '#94a3b8',
              textHoverBg: '#475569',
              textTextActiveColor: '#cbd5e1',
              textTextHoverColor: '#f8fafc',
            },
            Input: {
              activeBg: '#1e293b',
              activeBorderColor: '#475569',
              activeShadow: '#020617',
              hoverBorderColor: '#94a3b8',
            },
          },
        }}
      >
        <Layout className="h-screen bg-gray-500 p-4">
          {
            isPreview && <PreviewAlert />
          }

          <Header className="h-auto p-0 mb-4 bg-[transparent] rounded-xl ">
            <Navbar />
          </Header>

          <Layout className="bg-[transparent]">
            <Sider
              collapsed={collapsed}
              collapsedWidth={60}
              className={cs('rounded-xl shadow-md', collapsed ? 'bg-gradient-to-b from-darkBlueGray-1000 to-darkBlueGray-900 p-2' : 'bg-white p-4')}
              width={290}
            >
              <Sidebar collapsed={collapsed} maxSelectPhotos={orderInfo.max_select_photos} onClick={() => setCollapsed(!collapsed)} />
            </Sider>

            <Content className="bg-white ml-4 rounded-xl shadow-md overflow-hidden flex flex-col" onContextMenu={e => e.preventDefault()}>
              <Outlet />
            </Content>
          </Layout>

        </Layout>
      </ConfigProvider>
    </OrderInfoContext.Provider>
  )
}

export default MainLayout
