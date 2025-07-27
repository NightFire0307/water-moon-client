import { useEffect } from 'react'
import { Outlet } from 'react-router'
import FullScreenLoading from './components/FullScreenLoading/FullScreenLoading'
import { usePhotosStore } from './stores/usePhotosStore'
import './App.css'

function App() {
  const { fetchPhotos } = usePhotosStore()

  useEffect(() => {
    fetchPhotos()
  }, [])

  return (
    <>
      <Outlet />
      <FullScreenLoading />
    </>
  )
}

export default App
