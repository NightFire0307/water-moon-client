import { refreshToken, validateToken } from '@/apis/login'
import { useAuthStore } from '@/stores/useAuthStore'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

function withAuthGuard<T extends object>(
  WrappedComponent: React.ComponentType<T>,
) {
  return (props: T) => {
    const { setAccessToken } = useAuthStore()
    const navigate = useNavigate()
    const location = useLocation()
    const [loading, setLoading] = useState(true)

    function isTokenExpired(token: string) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const exp = payload.exp * 1000 // 转换为毫秒
        return exp < Date.now()
      }
      catch {
        return true // 如果解析失败，认为 token 已过期
      }
    }

    // 校验权限
    const checkAuth = async () => {
      if (['/', '/login'].includes(location.pathname))
        return false
      const accessToken = sessionStorage.getItem('access_token')

      // 如果没有 access_token，尝试刷新
      if (!accessToken || isTokenExpired(accessToken)) {
        try {
          // 尝试刷新 access_token
          const { data } = await refreshToken()
          setAccessToken(data.accessToken)
          return true
        }
        catch (err) {
          return false
        }
      }
      else {
        if (!isTokenExpired(accessToken))
          return true

        // 验证 access_token
        const { data } = await validateToken()
        if (data.valid) {
          return true
        }
        else {
          // 如果 access_token 无效，尝试刷新 Token
          sessionStorage.removeItem('access_token')
          try {
            const { data } = await refreshToken()
            setAccessToken(data.accessToken)
          }
          catch (err) {
            return false
          }
        }
      }

      return true
    }

    useEffect(() => {
      checkAuth()
        .then((isAuthenticated) => {
          setLoading(false)
          if (!isAuthenticated) {
            navigate('/login')
          }
        })
    }, [])

    if (loading)
      return null
    return <WrappedComponent {...props} />
  }
}

export default withAuthGuard
