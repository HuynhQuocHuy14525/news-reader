import axios from 'axios'

// Mọi request trong app đều đi qua instance này
export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
})

// Token đăng nhập hiện tại, do features/auth cập nhật khi đăng nhập / đăng xuất
let authToken: string | null = null

export function setAuthToken(token: string | null) {
  authToken = token
}

// Tự gắn "Authorization: Bearer <token>" vào mọi request khi đã đăng nhập (API có 🔒 trong docs/api.md)
apiClient.interceptors.request.use((config) => {
  if (authToken) config.headers.Authorization = `Bearer ${authToken}`
  return config
})
