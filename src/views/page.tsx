import { LockOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Button, Flex, FloatButton, Layout, Space, Typography } from 'antd'
import { Content, Header } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import { useState } from 'react'
import { PhotoGrid } from '../components/PhotoGrid.tsx'
import { ProductCard } from '../components/ProductCard.tsx'
import { ProductTypeTabs } from '../components/ProductTypeTabs.tsx'
import { UserProfile } from '../components/UserProfile.tsx'

const { Title } = Typography

interface IProduct {
  id: number
  title: string
  total: number
  selected: number
}

export function Page() {
  const [collapsed, setCollapsed] = useState(false)

  const products: IProduct[] = [
    {
      id: 1,
      title: '陌上花开14寸相册',
      total: 30,
      selected: 15,
    },
    {
      id: 2,
      title: '陌上花开12寸相册',
      total: 25,
      selected: 5,
    },
    {
      id: 3,
      title: '陌上花开10寸摆台',
      total: 1,
      selected: 1,
    },
    {
      id: 4,
      title: '陌上花开8寸摆台',
      total: 1,
      selected: 2,
    },
  ]

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
                    key={product.id}
                    title={product.title}
                    selected={product.selected}
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
