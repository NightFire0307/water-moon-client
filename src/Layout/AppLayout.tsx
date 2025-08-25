import type { FC } from 'react'
import { Layout } from 'antd'
import { Header } from 'antd/es/layout/layout'
import { Outlet } from 'react-router'

const AppLayout: FC = () => {
  return (
    <Layout>
      <Header></Header>
      <Outlet />
    </Layout>
  )
}

export default AppLayout
