import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './assets/normal.css'

createRoot(document.getElementById('root')!).render(
  <ConfigProvider
    locale={zhCN}
  >
    <App />
  </ConfigProvider>,
)
