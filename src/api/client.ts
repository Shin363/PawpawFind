import axios from 'axios'
import { env } from '@/config/env'

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl || undefined,
  timeout: 20_000,
  headers: {
    Accept: 'application/json',
  },
})
