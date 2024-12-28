import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  LockOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { animated, config, useTrail } from '@react-spring/web'
import { Button, Flex, FloatButton, Layout, Modal, Space, Typography } from 'antd'
import { Content, Header } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import { useEffect, useState } from 'react'
import { PhotoGrid } from '../../components/PhotoGrid.tsx'
import { ProductCard } from '../../components/ProductCard.tsx'
import { Tabs } from '../../components/Tabs.tsx'
import { UserProfile } from '../../components/UserProfile.tsx'
import { useProductsStore } from '../../stores/productsStore.tsx'

const { Title } = Typography

export function Home() {
  const [collapsed, setCollapsed] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const { products } = useProductsStore()
  const [trail, api] = useTrail(
    products.length,
    () => ({ from: { opacity: 0, scale: 0.5 }, config: config.default }),
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

      <Modal
        title="确认提交"
        open={confirmOpen}
        okText="确认提交"
        onCancel={() => setConfirmOpen(false)}
      >
        {/* <p className="text-[red] font-bold">提交选片结果后将无法更改，是否确认提交？</p> */}
        <div>选片校验结果</div>
        <Space direction="vertical" className="w-full text-base mt-4">
          <Flex justify="space-between">
            <div>产品1</div>
            <Flex gap={8}>
              <div className="font-bold">应选：3张 / 实选：5张</div>
              <LoadingOutlined className="text-xl" />
            </Flex>
          </Flex>

          <Flex justify="space-between">
            <div>产品2</div>
            <Flex gap={8}>
              <div className="font-bold">应选：6张 / 实选：5张</div>
              <WarningOutlined className="text-xl text-gold-700" />
            </Flex>
          </Flex>

          <Flex justify="space-between">
            <div>产品3</div>
            <Flex gap={8}>
              <div className="font-bold">应选：5张 / 实选：5张</div>
              <CheckCircleOutlined className="text-xl text-[#52c41a]" />
            </Flex>
          </Flex>

          <Flex justify="space-between">
            <div>产品4</div>
            <Flex gap={8}>
              <div className="font-bold">应选：3张 / 实选：5张</div>
              <CloseCircleOutlined className="text-xl text-[red]" />
            </Flex>
          </Flex>
        </Space>
      </Modal>
    </Layout>
  )
}
