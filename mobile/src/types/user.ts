export interface User {
  id: string
  name: string
  email: string
}

/** Trả về từ POST /api/auth/login và /api/auth/register */
export interface AuthResponse {
  token: string
  user: User
}
