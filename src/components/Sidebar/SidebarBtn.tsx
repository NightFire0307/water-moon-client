import type { FC } from 'react'
import { useProductsStore } from '@/stores/productsStore.tsx'
import { AppstoreOutlined, CameraOutlined } from '@ant-design/icons'
import { animated, useTrail } from '@react-spring/web'
import { Button, ConfigProvider, Divider, Space, Tooltip } from 'antd'

const SidebarBtn: FC = () => {
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

export default SidebarBtn
