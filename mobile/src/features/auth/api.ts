import { apiClient } from '@/services/api-client'
import type { AuthResponse, User } from '@/types/user'

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput extends LoginInput {
  name: string
}

// POST /auth/login
export async function login(input: LoginInput) {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', input)
  return data
}

// POST /auth/register
export async function register(input: RegisterInput) {
  const { data } = await apiClient.post<AuthResponse>('/auth/register', input)
  return data
}

// GET /auth/me 🔒 (token được api-client tự gắn)
export async function getMe() {
  const { data } = await apiClient.get<User>('/auth/me')
  return data
}
