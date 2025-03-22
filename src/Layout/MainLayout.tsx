import type { IOrder } from '@/types/order.ts'
import { refreshToken, validSurlAndToken } from '@/apis/login.ts'
import { getOrderInfo } from '@/apis/order.ts'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { useCustomStore } from '@/stores/customStore.tsx'
import { usePhotosStore } from '@/stores/photosStore.tsx'
import { useProductsStore } from '@/stores/productsStore.tsx'
import { Layout } from 'antd'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router'

const { Sider, Content, Header } = Layout

function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [orderInfo, setOrderInfo] = useState<IOrder>({})
  const access_Token = useCustomStore(state => state.access_token)
  const fetchPhotos = usePhotosStore(state => state.fetchPhotos)
  const generateProducts = useProductsStore(state => state.generateProducts)
  const updateAccessToken = useCustomStore(state => state.updateAccessToken)

  const { surl } = useParams()
  const navigate = useNavigate()

  async function verify(surl: string) {
    try {
      const res = await validSurlAndToken(surl)
    }
    catch {
      navigate('/')
    }
  }

  async function fetchOrderInfo(surl: string) {
    const { data } = await getOrderInfo(surl)
    console.log(data)
    setOrderInfo(data)
    generateProducts(data.order_products)
  }

  useEffect(() => {
    if (surl) {
      (async () => {
        // 刷新 access_token
        if (!access_Token) {
          try {
            const { data } = await refreshToken(surl)
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
          console.log(err)
          // navigate('/404')
        }
      })()
    }
  }, [surl])

  return (
    <Layout className="h-screen bg-gray-500 p-4">
      <Header className="h-auto p-0 mb-4 bg-[transparent] rounded-xl ">
        <Navbar />
      </Header>

      <Layout className="bg-[transparent]">
        <Sider
          collapsed={collapsed}
          collapsedWidth={65}
          className="bg-white rounded-xl shadow-md p-4"
          width={290}
        >
          <Sidebar collapsed={collapsed} maxSelectPhotos={orderInfo.max_select_photos} onClick={() => setCollapsed(!collapsed)} />
        </Sider>

        <Content className="bg-white ml-4 rounded-xl shadow-md overflow-hidden flex flex-col" onContextMenu={e => e.preventDefault()}>
          <Outlet />
        </Content>
      </Layout>

    </Layout>
  )
}

export default MainLayout
