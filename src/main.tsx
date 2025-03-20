import Error404 from '@/views/errorPage/404.tsx'
import ShareInit from '@/views/shareInit/shareInit.tsx'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import App from './App.tsx'
import './index.css'
import './assets/normal.css'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ConfigProvider
      locale={zhCN}
    >
      <Routes>
        <Route path="/">
          <Route path="share/init" element={<ShareInit />} />
          <Route path="s/:short_url" element={<App />} />
          <Route path="/404" element={<Error404 />} />
        </Route>
      </Routes>
    </ConfigProvider>
  </BrowserRouter>,
)
