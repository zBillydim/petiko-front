import axios from 'axios'
import { baseURL } from './api'
import { parseCookies } from 'nookies'

export const getApiClient = (ctx?: any) => {
  const apiWithAuth = axios.create({
    baseURL
  })
  apiWithAuth.interceptors.request.use((config) => {
    const { petiko: token } = parseCookies()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })
  return apiWithAuth
}

export const apiWithAuth = getApiClient()
