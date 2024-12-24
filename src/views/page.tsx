import { LockOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Button, Flex, FloatButton, Layout, Space, Typography } from 'antd'
import { Content, Header } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import { useEffect, useState } from 'react'
import { PhotoGrid } from '../components/PhotoGrid.tsx'
import { ProductCard } from '../components/ProductCard.tsx'
import { ProductTypeTabs } from '../components/ProductTypeTabs.tsx'
import { UserProfile } from '../components/UserProfile.tsx'

const { Title } = Typography

export interface IType {
  id: number
  name: string
}

export interface IProduct {
  productId: number
  title: string
  total: number
  selected: IPhoto[]
  // 产品所属类别
  type: string
}

export interface IPhoto {
  photoId: number
  src: string
  name: string
}

export function Page() {
  const [collapsed, setCollapsed] = useState(false)
  const [products, setProducts] = useState<IProduct[]>([])
  const [photos, setPhotos] = useState<IPhoto[]>([])

  // 模拟获取产品列表
  function fetchProducts() {
    setTimeout(() => {
      setProducts([
        {
          productId: 33,
          title: '陌上花开48寸大框',
          total: 1,
          selected: [],
          type: '主框',
        },
        {
          productId: 44,
          title: '陌上花开8寸摆台',
          total: 1,
          selected: [],
          type: '摆台',
        },
      ])
    }, 120)
  }

  // 模拟获取图片列表
  function fetchPhotos() {
    setTimeout(() => {
      setPhotos([
        {
          photoId: 11,
          src: 'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp',
          name: '123.jpg',
        },
        {
          photoId: 22,
          src: 'https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473091540282-9b846e7965e3.webp',
          name: '456.jpg',
        },
        {
          photoId: 33,
          src: 'https://gw.alipayobjects.com/zos/antfincdn/x43I27A55%26/photo-1438109491414-7198515b166b.webp',
          name: '789.jpg',
        },
      ])
    })
  }

  useEffect(() => {
    fetchProducts()
    fetchPhotos()
  }, [])

  function handleClick(photoId: number, productId: number) {
    const photo = photos.find(photo => photo.photoId === photoId)
    if (!photo)
      return

    setProducts((prevProducts) => {
      return prevProducts.map((product) => {
        if (product.productId === productId) {
          return {
            ...product,
            selected: [...product.selected, photo],
          }
        }
        return product
      })
    })
  }

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
              <PhotoGrid photos={photos} products={products} onClick={handleClick} />
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
