import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, ConfigProvider, Flex, Layout, Space, Typography } from 'antd'
import { Content, Header } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import { useState } from 'react'
import { PhotoGrid } from '../components/PhotoGrid.tsx'
import { ProductCard } from '../components/ProductCard.tsx'
import { ProductTypeTabs } from '../components/ProductTypeTabs.tsx'

const { Title } = Typography

export function Page() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <ConfigProvider theme={{
      components: {
        Card: {

        },
      },
    }}
    >
      <Layout className="h-screen overflow-hidden">
        <Header className="bg-white text-white select-none shadow-sm z-10 flex justify-between items-center">

          <div className="text-black-title text-2xl font-bold">Select Photo Oline</div>
          <Avatar size={32} icon={<UserOutlined />} />

        </Header>
        <Layout>
          <Sider
            collapsed={collapsed}
            collapsedWidth={0}
            className="bg-white  "
            width={290}
          >
            <div className="relative overflow-hidden overflow-y-auto w-full flex justify-center p-4">
              <Space direction="vertical" size="middle">
                <Title level={3} className="text-black-title">产品列表</Title>
                <ProductCard title="陌上花开14寸相册" total={30} selected={15} />
                <ProductCard title="陌上花开12寸相册" total={25} selected={5} />
                <ProductCard title="抹上花开组合框" total={25} selected={25} />
                <ProductCard title="陌上花开10寸摆台" total={25} selected={23} />
              </Space>
            </div>
          </Sider>
          <Content className="bg-[#f0f2f5] overflow-y-auto" onContextMenu={e => e.preventDefault()}>
            <div className="flex-grow container mx-auto p-4">
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
      </Layout>
    </ConfigProvider>

  )
}
