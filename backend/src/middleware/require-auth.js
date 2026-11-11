import { getUserById, verifyToken } from '../services/auth.service.js'

/**
 * Middleware cho các API có 🔒 trong docs/api.md.
 * Đọc header "Authorization: Bearer <token>", hợp lệ thì gắn req.user rồi cho đi tiếp,
 * không hợp lệ thì trả về 401.
 */
export async function requireAuth(req, res, next) {
  const [scheme, token] = (req.headers.authorization ?? '').split(' ')
  const userId = scheme === 'Bearer' && token ? verifyToken(token) : null
  const user = userId ? await getUserById(userId) : null
  if (!user) {
    return res.status(401).json({ error: { message: 'Bạn cần đăng nhập để dùng chức năng này' } })
  }
  req.user = user
  next()
}
