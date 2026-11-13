import { Router } from 'express'

import { requireAuth } from '../middleware/require-auth.js'
import { createJsonStore } from '../services/json-store.js'

const router = Router()

// Mỗi người dùng một danh sách, bài mới lưu đứng đầu: { [userId]: Article[] }
const bookmarks = createJsonStore('bookmarks', {})

const MAX_BOOKMARKS = 500

function sendError(res, status, message) {
  res.status(status).json({ error: { message } })
}

function readString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

/**
 * Chỉ giữ đúng các trường của Article trong docs/api.md, bỏ trường lạ app gửi lên
 * (ví dụ `content` của ArticleDetail). Thiếu id / title / url thì trả về null.
 */
function toArticle(body) {
  const article = {
    id: readString(body?.id),
    title: readString(body?.title),
    summary: readString(body?.summary),
    url: readString(body?.url),
    imageUrl: readString(body?.imageUrl) || null,
    source: readString(body?.source),
    sourceName: readString(body?.sourceName),
    category: readString(body?.category),
    publishedAt: readString(body?.publishedAt),
  }
  return article.id && article.title && article.url ? article : null
}

// Mọi API bài đã lưu đều cần đăng nhập (🔒), requireAuth gắn req.user
router.use(requireAuth)

// GET /api/bookmarks → Article[] (mới lưu đứng đầu)
router.get('/', async (req, res) => {
  const all = await bookmarks.read()
  res.json(all[req.user.id] ?? [])
})

// POST /api/bookmarks  body: Article → Article
// Lưu lại bài đã có thì không thêm trùng, chỉ đưa bài đó lên đầu
router.post('/', async (req, res) => {
  const article = toArticle(req.body)
  if (!article) return sendError(res, 400, 'Dữ liệu bài viết không hợp lệ')

  await bookmarks.update((all) => {
    const list = (all[req.user.id] ?? []).filter((a) => a.id !== article.id)
    if (list.length >= MAX_BOOKMARKS) {
      throw Object.assign(new Error(), { status: 400, message: `Chỉ lưu được tối đa ${MAX_BOOKMARKS} bài` })
    }
    all[req.user.id] = [article, ...list]
  })
  res.status(201).json(article)
})

// DELETE /api/bookmarks/:articleId → 204 (bài chưa lưu cũng trả 204, gọi 2 lần không lỗi)
router.delete('/:articleId', async (req, res) => {
  await bookmarks.update((all) => {
    const list = all[req.user.id] ?? []
    all[req.user.id] = list.filter((a) => a.id !== req.params.articleId)
  })
  res.status(204).end()
})

// Express 5 tự chuyển lỗi của hàm async tới đây; trả đúng dạng lỗi chung của API
router.use((err, req, res, next) => {
  if (err.status) return sendError(res, err.status, err.message)
  console.error('[bookmarks]', err)
  sendError(res, 500, 'Lỗi máy chủ, vui lòng thử lại sau')
})

export default router
