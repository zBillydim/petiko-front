import axios from 'axios'

export const baseURL = 'http://127.0.0.1:8000/api/'
export const api = axios.create({
  baseURL
})
