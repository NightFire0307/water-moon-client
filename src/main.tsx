import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import App from './App.tsx'
import { Login } from './views/login'
import './index.css'
import './assets/normal.css'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ConfigProvider
      locale={zhCN}
    >
      <Routes>
        <Route path="/">
          <Route path=":token" element={<App />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </ConfigProvider>
  </BrowserRouter>,
)
