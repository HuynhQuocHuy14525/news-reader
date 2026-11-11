import { Router } from 'express'

import { CATEGORY_SLUGS, getArticles } from '../services/rss.service.js'

const router = Router()

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 50

/** Đọc page/limit từ query, giá trị sai thì dùng mặc định */
function readPaging(query) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1)
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number.parseInt(query.limit, 10) || DEFAULT_LIMIT))
  return { page, limit }
}

/** Cắt mảng thành 1 trang theo dạng Paginated<T> trong docs/api.md */
function paginate(items, { page, limit }) {
  const start = (page - 1) * limit
  return {
    items: items.slice(start, start + limit),
    page,
    hasMore: start + limit < items.length,
  }
}

function sendError(res, status, message) {
  res.status(status).json({ error: { message } })
}

// GET /api/news?category=cong-nghe&page=1&limit=20
router.get('/', async (req, res) => {
  const { category } = req.query
  if (category && !CATEGORY_SLUGS.includes(category)) {
    return sendError(res, 400, `Chuyên mục "${category}" không tồn tại`)
  }
  const articles = await getArticles(category)
  res.json(paginate(articles, readPaging(req.query)))
})

// Express 5 tự chuyển lỗi của hàm async tới đây; trả đúng dạng lỗi chung của API
router.use((err, req, res, next) => {
  console.error('[news]', err)
  sendError(res, 502, 'Không lấy được tin từ các báo, vui lòng thử lại sau')
})

export default router
