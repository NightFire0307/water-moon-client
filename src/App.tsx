import { useEffect } from 'react'
import { Outlet } from 'react-router'
import { getOrderInfo } from './apis/order'
import FullScreenLoading from './components/FullScreenLoading/FullScreenLoading'
import { useOrderStore } from './stores/useOrderStore'
import { usePhotosStore } from './stores/usePhotosStore'
import { useProductsStore } from './stores/useProductsStore'
import './App.css'

function App() {
  const { generateProducts } = useProductsStore()
  const { fetchPhotos } = usePhotosStore()
  const { setOrderInfo } = useOrderStore()

  const fetchOrderInfo = async () => {
    const { data } = await getOrderInfo()
    setOrderInfo(data)
    generateProducts(data.order_products)
  }

  useEffect(() => {
    fetchPhotos()
    fetchOrderInfo()
  }, [])

  return (
    <>
      <Outlet />
      <FullScreenLoading />
    </>
  )
}

export default App
