import axios from 'axios'

// create an axios instance
const service = axios.create({
  timeout: 8000,
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    console.error(error)
    return Promise.reject(error)
  },
)

// response interceptor
service.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default service
