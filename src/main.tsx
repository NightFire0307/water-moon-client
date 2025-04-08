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
      theme={{
        token: {
          colorBgElevated: '#334155',
          colorText: '#f8fafc',
          colorTextDisabled: '#64748b',
          colorTextDescription: '#94a3b8',
          controlItemBgHover: '#475569',
        },
        components: {
          Modal: {
            contentBg: '#1e293b',
          },
          Button: {
            borderColorDisabled: '#475569',
            defaultBg: '#1e293b',
            defaultColor: '#e2e8f0',
            defaultBorderColor: '#334155',
            defaultActiveBg: '#0f172a',
            defaultActiveBorderColor: '#1e293b',
            defaultActiveColor: '#e2e8f0',
            defaultHoverBg: '#334155',
            defaultHoverBorderColor: '#475569',
            defaultHoverColor: '#ffffff',
            textTextColor: '#94a3b8',
            textHoverBg: '#475569',
            textTextActiveColor: '#cbd5e1',
            textTextHoverColor: '#f8fafc',
          },
          Input: {
            activeBg: '#1e293b',
            activeBorderColor: '#475569',
            activeShadow: '#020617',
            hoverBorderColor: '#94a3b8',
          },
        },
      }}
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
