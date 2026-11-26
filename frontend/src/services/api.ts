import axios, { AxiosError } from 'axios'

const API_BASE = '/api'

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    localStorage.setItem('access_token', token)
  } else {
    delete api.defaults.headers.common['Authorization']
    localStorage.removeItem('access_token')
  }
}

export const clearAuth = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user')
  delete api.defaults.headers.common['Authorization']
}

const initAuth = () => {
  const token = localStorage.getItem('access_token')
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
}
initAuth()

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearAuth()
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export { API_BASE }
export default api
