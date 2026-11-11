import { Router } from 'express'

import { CATEGORY_SLUGS, getArticleDetail, getArticles, searchArticles } from '../services/rss.service.js'

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

// GET /api/news/search?q=bong da&page=1
// Phải khai báo trước /:id, nếu không "search" sẽ bị hiểu là một id
router.get('/search', async (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : ''
  if (!q) return sendError(res, 400, 'Vui lòng nhập từ khóa tìm kiếm')
  const articles = await searchArticles(q)
  res.json(paginate(articles, readPaging(req.query)))
})

// GET /api/news/a1b2c3d4e5f6
router.get('/:id', async (req, res) => {
  const article = await getArticleDetail(req.params.id)
  if (!article) return sendError(res, 404, 'Không tìm thấy bài viết')
  res.json(article)
})

// Express 5 tự chuyển lỗi của hàm async tới đây; trả đúng dạng lỗi chung của API
router.use((err, req, res, next) => {
  console.error('[news]', err)
  sendError(res, 502, 'Không lấy được tin từ các báo, vui lòng thử lại sau')
})

export default router
