import { Router } from 'express'

import { requireAuth } from '../middleware/require-auth.js'
import { AuthError, login, register } from '../services/auth.service.js'

const router = Router()

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 6

function sendError(res, status, message) {
  res.status(status).json({ error: { message } })
}

/** Lấy chuỗi từ body, bỏ khoảng trắng 2 đầu; không phải chuỗi thì trả về '' */
function readString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

// POST /api/auth/register  { name, email, password } → AuthResponse
router.post('/register', async (req, res) => {
  const name = readString(req.body?.name)
  const email = readString(req.body?.email).toLowerCase()
  const password = typeof req.body?.password === 'string' ? req.body.password : ''

  if (!name) return sendError(res, 400, 'Vui lòng nhập họ tên')
  if (!EMAIL_PATTERN.test(email)) return sendError(res, 400, 'Email không hợp lệ')
  if (password.length < MIN_PASSWORD_LENGTH) {
    return sendError(res, 400, `Mật khẩu phải có ít nhất ${MIN_PASSWORD_LENGTH} ký tự`)
  }

  res.status(201).json(await register({ name, email, password }))
})

// POST /api/auth/login  { email, password } → AuthResponse
router.post('/login', async (req, res) => {
  const email = readString(req.body?.email).toLowerCase()
  const password = typeof req.body?.password === 'string' ? req.body.password : ''
  if (!email || !password) return sendError(res, 400, 'Vui lòng nhập email và mật khẩu')

  res.json(await login({ email, password }))
})

// GET /api/auth/me 🔒 → User
router.get('/me', requireAuth, (req, res) => {
  res.json(req.user)
})

// Express 5 tự chuyển lỗi của hàm async tới đây; trả đúng dạng lỗi chung của API
router.use((err, req, res, next) => {
  if (err instanceof AuthError) return sendError(res, err.status, err.message)
  console.error('[auth]', err)
  sendError(res, 500, 'Lỗi máy chủ, vui lòng thử lại sau')
})

export default router
