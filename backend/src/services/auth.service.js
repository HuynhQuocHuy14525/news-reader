import { randomUUID } from 'node:crypto'

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { createJsonStore } from './json-store.js'

const TOKEN_EXPIRES_IN = '30d'

// Mỗi người dùng lưu: { id, name, email, passwordHash, createdAt }
const users = createJsonStore('users', [])

/** Lỗi có kèm mã HTTP, route bắt lại để trả về { error: { message } } */
export class AuthError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

function getSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('Thiếu JWT_SECRET trong backend/.env')
  return secret
}

/** Bỏ mật khẩu đã băm, chỉ trả về đúng kiểu User trong docs/api.md */
function toPublicUser(user) {
  return { id: user.id, name: user.name, email: user.email }
}

/** Tạo AuthResponse: token + thông tin người dùng */
function createAuthResponse(user) {
  const token = jwt.sign({ sub: user.id }, getSecret(), { expiresIn: TOKEN_EXPIRES_IN })
  return { token, user: toPublicUser(user) }
}

export async function register({ name, email, password }) {
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await users.update((list) => {
    if (list.some((u) => u.email === email)) {
      throw new AuthError(409, 'Email này đã được đăng ký')
    }
    const newUser = { id: randomUUID(), name, email, passwordHash, createdAt: new Date().toISOString() }
    list.push(newUser)
    return newUser
  })
  return createAuthResponse(user)
}

export async function login({ email, password }) {
  const list = await users.read()
  const user = list.find((u) => u.email === email)
  // Sai email hay sai mật khẩu đều báo chung một câu, không để lộ email nào đã đăng ký
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new AuthError(401, 'Email hoặc mật khẩu không đúng')
  }
  return createAuthResponse(user)
}

/** Kiểm tra token, trả về id người dùng; token sai hoặc hết hạn thì trả về null */
export function verifyToken(token) {
  try {
    const payload = jwt.verify(token, getSecret())
    return typeof payload.sub === 'string' ? payload.sub : null
  } catch {
    return null
  }
}

export async function getUserById(id) {
  const list = await users.read()
  const user = list.find((u) => u.id === id)
  return user ? toPublicUser(user) : null
}
