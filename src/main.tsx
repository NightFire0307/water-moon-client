import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import App from '@/App.tsx'
import AuthLayout from '@/Layout/AuthLayout.tsx'
import Error404Page from '@/views/errorPage/404.tsx'
import Login from '@/views/login/login.tsx'
import OrderInfoPage from './views/orderInfo'
import PreSelectPage from './views/preselect/PreSelectPage'
import PreviewMode from './views/preview/PreviewMode'
import ProductSelectPage from './views/productselect/ProductSelectPage'
import './index.css'
import './assets/normal.css'
import 'simplebar-react/dist/simplebar.min.css'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>

    <Routes>
      <Route path="/login" element={<AuthLayout />}>
        <Route index element={<Login />} />
      </Route>

      <Route path="/" element={<App />}>
        <Route path="order-info" element={<OrderInfoPage />} />
        <Route path="pre-select" element={<PreSelectPage />} />
        <Route path="product-select" element={<ProductSelectPage />} />
        <Route path="preview" element={<PreviewMode />} />
      </Route>

      <Route path="/404" element={<Error404Page />} />
    </Routes>
  </BrowserRouter>,
)
