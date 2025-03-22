import AuthLayout from '@/Layout/AuthLayout.tsx'
import MainLayout from '@/Layout/MainLayout.tsx'
import Home from '@/views/home/home.tsx'
import Login from '@/views/login/login.tsx'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import './index.css'
import './assets/normal.css'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ConfigProvider
      locale={zhCN}
    >
      <Routes>
        <Route path="/s/:surl" element={<MainLayout />}>
          <Route index element={<Home />} />
        </Route>

        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Login />} />
        </Route>
      </Routes>
    </ConfigProvider>
  </BrowserRouter>,
)
