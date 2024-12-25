import { LockOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Button, Flex, FloatButton, Layout, Space, Typography } from 'antd'
import { Content, Header } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import { useState } from 'react'
import { PhotoGrid } from '../components/PhotoGrid.tsx'
import { ProductCard } from '../components/ProductCard.tsx'
import { ProductTypeTabs } from '../components/ProductTypeTabs.tsx'
import { UserProfile } from '../components/UserProfile.tsx'
import { useProductsStore } from '../stores/productsStore.tsx'

const { Title } = Typography

export function Page() {
  const [collapsed, setCollapsed] = useState(false)
  const { products } = useProductsStore()

  return (
    <Layout className="h-screen overflow-hidden">
      <Header className="bg-white text-white select-none shadow-sm z-10 flex justify-between items-center">
        <div className="text-black-title text-2xl font-bold">Select Photo Oline</div>
        <UserProfile />
      </Header>
      <Layout>
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
                products.map(product => (
                  <ProductCard
                    key={product.productId}
                    title={product.title}
                    selected={product.selected.length}
                    total={product.total}
                  />
                ))
              }
            </Space>
          </div>
        </Sider>
        <Content className="bg-[#f0f2f5] overflow-y-auto p-4 mx-auto" onContextMenu={e => e.preventDefault()}>
          <div className="flex-grow container">
            <Space direction="vertical" size="middle">
              <Flex gap="middle">
                <Button icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)}></Button>
                <ProductTypeTabs />
              </Flex>
              <PhotoGrid />
            </Space>
          </div>
        </Content>
      </Layout>

      <FloatButton.Group shape="circle" style={{ insetInlineEnd: 60 }}>
        <FloatButton.BackTop tooltip="返回顶部" />
        <FloatButton type="primary" tooltip="提交选片结果" icon={<LockOutlined />}></FloatButton>
      </FloatButton.Group>
    </Layout>
  )
}
