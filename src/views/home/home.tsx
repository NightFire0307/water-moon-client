import type { IOrder } from '@/types/order.ts'
import type { FC } from 'react'
import { refreshToken, validSurlAndToken } from '@/apis/login.ts'
import { getOrderInfo } from '@/apis/order.ts'
import { PreviewModeContext } from '@/App.tsx'
import { PhotoGrid } from '@/components/PhotoGrid.tsx'
import { useCustomStore } from '@/stores/customStore.tsx'
import { usePhotosStore } from '@/stores/photosStore.tsx'
import { useProductsStore } from '@/stores/productsStore.tsx'
import { ProductCardGroup } from '@/views/home/components/ProductCardGroup.tsx'
import {
  AppstoreOutlined,
  CameraOutlined,
  LeftOutlined,
  LockOutlined,
  RightOutlined,
} from '@ant-design/icons'
import { animated, useTrail } from '@react-spring/web'
import { Button, ConfigProvider, Divider, FloatButton, Layout, Space, Tooltip } from 'antd'
import { Content } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ConfirmModal } from './components/ConfirmModal.tsx'

const CollapseButton: FC = () => {
  const products = useProductsStore(state => state.products)
  const trail = useTrail(products.length, {
    opacity: 1,
    scale: 1,
    from: { opacity: 0, scale: 0.5 },
  })

  return (
    <ConfigProvider theme={{
      components: {
        Button: {
          defaultBg: '#1e293b',
          defaultColor: '#f1f5f9',
          defaultBorderColor: '#464c54',
          defaultHoverBg: '#324054',
          defaultHoverBorderColor: '#2a364a',
          defaultHoverColor: '#fff',
        },
      },
    }}
    >
      <Tooltip title="全部照片" placement="right">
        <Button className="h-10" block icon={<AppstoreOutlined />} />
      </Tooltip>
      <Divider />
      <Space direction="vertical" className="w-full">
        {
          trail.map((style, index) => (
            <animated.div style={style} key={products[index].productId}>
              <Tooltip title={products[index].title} placement="right">
                <Button className="h-10 rounded-md text-darkBlueGray-500" block icon={<CameraOutlined />}>
                  {products[index].productId}
                </Button>
              </Tooltip>
            </animated.div>
          ))
        }
      </Space>
    </ConfigProvider>
  )
}

export function Home() {
  const [collapsed, setCollapsed] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [orderInfo, setOrderInfo] = useState<IOrder>({})
  const previewMode = useContext(PreviewModeContext)
  const access_Token = useCustomStore(state => state.access_token)
  const fetchPhotos = usePhotosStore(state => state.fetchPhotos)
  const generateProducts = useProductsStore(state => state.generateProducts)
  const updateAccessToken = useCustomStore(state => state.updateAccessToken)

  const { short_url } = useParams()
  const navigate = useNavigate()

  function handleSubmit() {
    setConfirmLoading(true)
    setTimeout(() => {
      setConfirmOpen(false)
      setConfirmLoading(false)
    }, 2000)
  }

  async function verify(surl: string) {
    try {
      const res = await validSurlAndToken(surl)
      console.log(res)
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
    if (short_url) {
      (async () => {
        // 刷新 access_token
        if (!access_Token) {
          try {
            const { data } = await refreshToken(short_url)
            updateAccessToken(data.access_token)
          }
          catch {
            navigate('/')
          }
        }

        // 验证短链和 token
        try {
          await verify(short_url)
          await fetchOrderInfo(short_url)
          await fetchPhotos()
        }
        catch {
          navigate('/404')
        }
      })()
    }
  }, [short_url])

  return (
    <Layout className="h-screen bg-gray-500 p-4">
      <Sider
        collapsed={collapsed}
        collapsedWidth={65}
        className="bg-white rounded-xl shadow-md p-4"
        width={290}
      >
        <div className="flex justify-between  items-center mb-4">
          {
            !collapsed && (
              <div className="flex items-center gap-2">
                <div className="w-[4px] h-5 bg-darkBlueGray-800 rounded-lg" />
                <div className="text-xl font-bold text-darkBlueGray-800">产品列表</div>
              </div>
            )
          }
          <Button
            type="text"
            block
            className="max-w-[50px]"
            icon={!collapsed ? <LeftOutlined className="text-darkBlueGray-900" /> : <RightOutlined className="text-darkBlueGray-900" />}
            onClick={() => setCollapsed(!collapsed)}
          >
          </Button>
        </div>
        {
          !collapsed
            ? <ProductCardGroup maxSelectPhotos={orderInfo.max_select_photos} />
            : <CollapseButton />
        }
      </Sider>

      <Content className="bg-white overflow-y-auto ml-4 mr-4 rounded-xl p-4 shadow-md" onContextMenu={e => e.preventDefault()}>
        <div className="flex items-center gap-2">
          <div className="w-[4px] h-5 bg-darkBlueGray-800 rounded-lg" />
          <div className="text-xl font-bold text-darkBlueGray-800">全部照片库</div>
          <div className="text-darkBlueGray-600 font-medium">(13 张照片)</div>
        </div>
        <PhotoGrid />
      </Content>

      {
        !previewMode && (
          <FloatButton.Group shape="circle" style={{ insetInlineEnd: 60 }}>
            <FloatButton.BackTop tooltip="返回顶部" />
            <FloatButton
              tooltip="提交选片结果"
              icon={<LockOutlined />}
              onClick={() => setConfirmOpen(true)}
            >
            </FloatButton>
          </FloatButton.Group>
        )
      }

      <ConfirmModal
        open={confirmOpen}
        confirmLoading={confirmLoading}
        onCancel={() => setConfirmOpen(false)}
        onSubmit={handleSubmit}
      />
    </Layout>
  )
}
