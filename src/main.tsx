import App from '@/App.tsx'
import AuthLayout from '@/Layout/AuthLayout.tsx'
import Error404Page from '@/views/errorPage/404.tsx'
import Home from '@/views/home/home.tsx'
import Login from '@/views/login/login.tsx'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import './index.css'
import './assets/normal.css'
import 'simplebar-react/dist/simplebar.min.css'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ConfigProvider
      locale={zhCN}
    >
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Login />} />
        </Route>

        <Route path="/share/init" element={<AuthLayout />}>
          <Route index element={<Login />} />
        </Route>

        <Route path="/s/:surl" element={<App />}>
          <Route index element={<Home />} />
        </Route>

        <Route path="/404" element={<Error404Page />} />
      </Routes>
    </ConfigProvider>
  </BrowserRouter>,
)
