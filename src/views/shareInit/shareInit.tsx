import { Login } from '@/views/login/login.tsx'
import { useLocation } from 'react-router'

function ShareInit() {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const surl = queryParams.get('surl')
  const pwd = queryParams.get('pwd')

  if (surl) {
    return <Login surl={surl} pwd={pwd ?? ''} />
  }
  else {
    <h2>未找到页面</h2>
  }
}

export default ShareInit
