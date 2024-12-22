import { ConfigProvider, Layout, Space } from 'antd'
import { Content, Header } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import { ProductCard } from '../components/ProductCard.tsx'
import { ProductTypeTabs } from '../components/ProductTypeTabs.tsx'

export function Page() {
  return (
    <ConfigProvider theme={{
      components: {
        Card: {

        },
      },
    }}
    >
      <Layout className="h-screen overflow-hidden">
        <Header className="  text-white select-none"> Select Photo Online </Header>
        <Layout>
          <Sider
            className="relative bg-white flex justify-center overflow-y-auto p-4 text-[0]"
            width={280}
          >
            <Space direction="vertical">
              <ProductCard title="陌上花开14寸相册" total={30} selected={0} />
              <ProductCard title="陌上花开12寸相册" total={25} selected={0} />
            </Space>
          </Sider>
          <Content className="bg-white overflow-y-auto">
            <div className="flex-grow container mx-auto p-4">
              <ProductTypeTabs />
            </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>

  )
}
