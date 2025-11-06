import App from '@/App.tsx'
import AuthLayout from '@/Layout/AuthLayout.tsx'
import Error404Page from '@/views/errorPage/404.tsx'
import { lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import './index.css'
import './assets/normal.css'
import 'simplebar-react/dist/simplebar.min.css'

export const Login = lazy(() => import('@/views/login/login.tsx'))
export const OrderInfoPage = lazy(() => import('@/views/orderInfo/OrderInfoPage.tsx'))
export const PreSelectPage = lazy(() => import('@/views/preselect/PreSelectPage.tsx'))
export const ProductSelectPage = lazy(() => import('@/views/productselect/ProductSelectPage.tsx'))
export const PreviewPage = lazy(() => import('@/views/preview/PreviewMode.tsx'))

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/login" element={<AuthLayout />}>
          <Route index element={<Login />} />
        </Route>

        <Route path="/" element={<App />}>
          <Route path="order-info" element={<OrderInfoPage />} />
          <Route path="pre-select" element={<PreSelectPage />} />
          <Route path="product-select" element={<ProductSelectPage />} />
          <Route path="preview" element={<PreviewPage />} />
        </Route>

        <Route path="/404" element={<Error404Page />} />
      </Routes>
    </Suspense>
  </BrowserRouter>,
)
