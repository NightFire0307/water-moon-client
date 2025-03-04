import type { IProduct } from '@/stores/productsStore.tsx'
import { refreshToken, validSurlAndToken } from '@/apis/login.ts'
import { getOrderInfo } from '@/apis/order.ts'
import { PreviewModeContext } from '@/App.tsx'
import { PhotoGrid } from '@/components/PhotoGrid.tsx'
import { ProductCard } from '@/components/ProductCard.tsx'
import { Tabs } from '@/components/Tabs.tsx'
import { UserProfile } from '@/components/UserProfile.tsx'
import { useCustomStore } from '@/stores/customStore.tsx'
import {
  LockOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import { animated, config, useTrail } from '@react-spring/web'
import { Alert, Button, Flex, FloatButton, Layout, Space } from 'antd'
import { Content, Header } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ConfirmModal } from './components/ConfirmModal.tsx'

export function Home() {
  const [collapsed, setCollapsed] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const previewMode = useContext(PreviewModeContext)
  const [products, setProducts] = useState<IProduct[]>([])
  const access_Token = useCustomStore(state => state.access_token)
  const updateAccessToken = useCustomStore(state => state.updateAccessToken)

  const [trail, api] = useTrail(
    products.length,
    () => ({ from: { opacity: 0, scale: 0.5 }, config: config.gentle }),
  )
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

    setProducts(data.order_products.map((product) => {
      return {
        productId: product.id,
        title: product.product.name,
        total: product.quantity,
        selected: product.product.select_photos,
        product_type: '未分类',
      }
    }))
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
        }
        catch {
          navigate('/404')
        }
      })()
    }
  }, [short_url])

  useEffect(() => {
    api.start({ opacity: 1, scale: 1 })
  }, [products])

  return (
    <Layout className="h-screen overflow-hidden">
      <Sider
        collapsed={collapsed}
        collapsedWidth={0}
        className="bg-white"
        width={290}
      >
        <div className="text-2xl font-bold p-4 mb-4">产品选片状态</div>
        <div className="flex justify-center overflow-hidden overflow-y-auto h-full w-full pr-4 pl-4">
          <Space direction="vertical" size="middle" className="w-full">
            {
              trail.map((style, index) => (
                <animated.div key={products[index].productId} style={style}>
                  <ProductCard
                    productId={products[index].productId}
                    title={products[index].title}
                    selected={products[index].selected.length}
                    total={products[index].total}
                  />
                </animated.div>
              ))
            }
          </Space>
        </div>
      </Sider>

      <Layout>
        <Header className="bg-white select-none shadow-sm z-10 flex justify-between items-center pl-4 pr-4">
          <Button icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)}></Button>
          {
            previewMode ? <Alert message="当前为预览模式，无法进行编辑操作" type="warning" /> : <Alert message="当前为选片模式" type="info" />
          }
          <UserProfile />
        </Header>
        <Content className="bg-[#f0f2f5] overflow-y-auto p-4 " onContextMenu={e => e.preventDefault()}>
          <div>
            <Flex gap="middle" justify="space-between">
              <Tabs />
            </Flex>
            <PhotoGrid />
          </div>
        </Content>
      </Layout>

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
