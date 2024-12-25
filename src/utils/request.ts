import axios from 'axios'

// create an axios instance
const service = axios.create({
  timeout: 8000,
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    config.headers['apifox-token'] = 'jOWPle3VNCvdXJbo0jyh9KW24rbJUPaY'
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
    // const res = response.data;
    // if (res.success == true) {
    //   return res;
    // } else {
    //   Message.error({
    //     content: res.errorMessage,
    //     duration: 3000,
    //   });
    //   return Promise.reject(new Error(res.errorMessage));
    // }
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default service
