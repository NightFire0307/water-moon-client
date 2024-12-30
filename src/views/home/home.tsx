import {
  LockOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import { animated, config, useTrail } from '@react-spring/web'
import { Button, Flex, FloatButton, Layout, Space, Typography } from 'antd'
import { Content, Header } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import { useEffect, useState } from 'react'
import { PhotoGrid } from '../../components/PhotoGrid.tsx'
import { ProductCard } from '../../components/ProductCard.tsx'
import { Tabs } from '../../components/Tabs.tsx'
import { UserProfile } from '../../components/UserProfile.tsx'
import { useProductsStore } from '../../stores/productsStore.tsx'
import { ConfirmModal } from './components/ConfirmModal.tsx'

const { Title } = Typography

export function Home() {
  const [collapsed, setCollapsed] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const { products } = useProductsStore()
  const [trail, api] = useTrail(
    products.length,
    () => ({ from: { opacity: 0, scale: 0.5 }, config: config.gentle }),
  )

  useEffect(() => {
    api.start({ opacity: 1, scale: 1 })
  }, [])

  return (
    <Layout className="h-screen overflow-hidden">
      <Sider
        collapsed={collapsed}
        collapsedWidth={0}
        className="bg-white"
        width={290}
      >
        <div className="relative overflow-hidden overflow-y-auto w-full flex justify-center p-4">
          <Space direction="vertical" size="middle">
            <Title level={3} className="text-black-title">产品列表</Title>
            {
              trail.map((style, index) => (
                <animated.div key={products[index].productId} style={style}>
                  <ProductCard
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
          <UserProfile />
        </Header>
        <Content className="bg-[#f0f2f5] overflow-y-auto p-4 " onContextMenu={e => e.preventDefault()}>
          <div className="flex-grow container">
            <Space direction="vertical" size="middle">
              <Flex gap="middle" justify="space-between">
                <Tabs />
              </Flex>
              <PhotoGrid />
            </Space>
          </div>
        </Content>
      </Layout>

      <FloatButton.Group shape="circle" style={{ insetInlineEnd: 60 }}>
        <FloatButton.BackTop tooltip="返回顶部" />
        <FloatButton
          tooltip="提交选片结果"
          icon={<LockOutlined />}
          onClick={() => setConfirmOpen(true)}
        >
        </FloatButton>
      </FloatButton.Group>

      <ConfirmModal open={confirmOpen} onCancel={() => setConfirmOpen(false)} onSubmit={() => {}} />
    </Layout>
  )
}
