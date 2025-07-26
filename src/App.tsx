import { Outlet } from 'react-router'
import './App.css'
import FullScreenLoading from './components/FullScreenLoading/FullScreenLoading'

function App() {
  return (
    <>
      <Outlet />
      <FullScreenLoading />
    </>
  )
}

export default App
