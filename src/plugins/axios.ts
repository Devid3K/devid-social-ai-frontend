import axios from 'axios'
import { API_BASE_URL } from '@/constants/api'

const axiosIns = axios.create({
  baseURL: API_BASE_URL,
})

axiosIns.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem('token') || 'null')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

axiosIns.interceptors.response.use(
  (response) => {
    const { method } = response.config
    switch (method) {
      case 'post':
      case 'put':
      case 'patch':
        window.$notification?.success({
          content: 'บันทึกสำเร็จ',
          meta: response.data?.message,
          duration: 2500,
          keepAliveOnHover: true,
        })
        break
      case 'delete':
        window.$notification?.success({
          content: 'ลบสำเร็จ',
          meta: response.data?.message,
          duration: 2500,
          keepAliveOnHover: true,
        })
        break
    }
    return response
  },
  async (error) => {
    if (error.config?.method !== 'get') {
      window.$notification?.error({
        content: 'ทำรายการไม่สำเร็จ',
        meta: error.response?.data?.message || 'Unknown error',
        duration: 2500,
        keepAliveOnHover: true,
      })
    }
    if (error.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default axiosIns
