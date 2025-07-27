import App from '@/App.tsx'
import AuthLayout from '@/Layout/AuthLayout.tsx'
import Error404Page from '@/views/errorPage/404.tsx'
import Home from '@/views/home/home.tsx'
import Login from '@/views/login/login.tsx'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import OrderInfoPage from './views/orderInfo'
import PreSelectPage from './views/preselect/PreSelectPage'
import ProductSelectPage from './views/productselect/ProductSelectPage'
import './index.css'
import './assets/normal.css'
import 'simplebar-react/dist/simplebar.min.css'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>

    <Routes>
      <Route path="/" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
      </Route>

      <Route path="/share/init" element={<AuthLayout />}>
        <Route index element={<Login />} />
      </Route>

      <Route path="/s/:surl" element={<App />}>
        <Route index element={<Home />} />
      </Route>

      <Route path="/order" element={<App />}>
        <Route index element={<Home />} />
      </Route>

      {/* 订单信息页面 */}
      <Route path="/order-info" element={<App />}>
        <Route index element={<OrderInfoPage />} />
      </Route>

      {/* 预选照片页面 */}
      <Route path="/pre-select" element={<App />}>
        <Route index element={<PreSelectPage />} />
      </Route>

      {/* 照片分配页面 */}
      <Route path="/product-select" element={<App />}>
        <Route index element={<ProductSelectPage />} />
      </Route>

      <Route path="/404" element={<Error404Page />} />
    </Routes>
  </BrowserRouter>,
)
