import { useOrderStore } from '@/stores/useOrderStore'
import { OrderStatus } from '@/types/user/order'
import { type ComponentType, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'

/**
 * 根据订单状态进行路由守卫
 * @param WrappedComponent
 * @returns
 */
const whiteList = ['/preview', '/order-info']

function withOrderStatusGuard<T extends object>(
  WrappedComponent: ComponentType<T>,
) {
  const ComponentWithGuard = (props: T) => {
    const order = useOrderStore(state => state.order)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
      if (!order || whiteList.includes(location.pathname))
        return

      switch (order.status) {
        case OrderStatus.PRE_SELECT:
          if (location.pathname !== '/pre-select') {
            navigate('/pre-select', { replace: true })
          }
          break
        case OrderStatus.PRODUCT_SELECT:
          if (location.pathname !== '/product-select') {
            navigate('/product-select', { replace: true })
          }
          break
        case OrderStatus.SUBMITTED:
          if (location.pathname !== '/preview') {
            navigate('/preview', { replace: true })
          }
          break
        default:
          break
      }
    }, [order?.status, navigate, location.pathname])

    return <WrappedComponent {...props} />
  }

  ComponentWithGuard.displayName = `withOrderStatusGuard(${WrappedComponent.displayName || WrappedComponent.name})`
  return ComponentWithGuard
}

export default withOrderStatusGuard
