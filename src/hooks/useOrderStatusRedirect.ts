import { useFullScreenLoading } from '@/components/FullScreenLoading/useFullScreenLoading'
import { useOrderStore } from '@/stores/useOrderStore'
import { OrderStatus } from '@/types/user/order'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'

function useOrderStatusRedirect() {
  const navigate = useNavigate()
  const location = useLocation()
  const { order } = useOrderStore()
  const { showLoading, hideLoading } = useFullScreenLoading()

  useEffect(() => {
    // 如果在登录页，不进行跳转
    if (location.pathname === '/login' || location.pathname === '/order-info' || !order)
      return

    let targetPath = ''
    if (order.status === OrderStatus.PRE_SELECT && location.pathname !== '/pre-select') {
      targetPath = '/pre-select'
    }
    else if (order.status === OrderStatus.PRODUCT_SELECT && location.pathname !== '/product-select') {
      targetPath = '/product-select'
    }
    else if (order.status === OrderStatus.SUBMITTED && location.pathname !== '/preview') {
      targetPath = '/preview'
    }

    if (targetPath) {
      showLoading('正在跳转，请稍候...')
      navigate(targetPath)
      setTimeout(hideLoading, 500)
    }
  }, [order, navigate, location, showLoading, hideLoading])
}

export default useOrderStatusRedirect
