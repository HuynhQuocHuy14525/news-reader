import axios from 'axios'

// Mọi request trong app đều đi qua instance này
export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
})
