import axios, { AxiosResponse } from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
  timeout: 60000
})

export default {
  healthCheck(): Promise<AxiosResponse> {
    return client.get('/health-check')
  }
}