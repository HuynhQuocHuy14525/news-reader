import type { CategorySlug } from '@/constants/categories'

// Hợp đồng chung giữa app và backend. Sửa file này thì sửa cả docs/api.md
export interface Article {
  id: string
  title: string
  /** Đoạn mô tả ngắn lấy từ RSS, dạng chữ thường (không có HTML) */
  summary: string
  /** Link bài gốc trên trang báo */
  url: string
  imageUrl: string | null
  /** Mã nguồn, ví dụ 'vnexpress' */
  source: string
  /** Tên hiển thị, ví dụ 'VnExpress' */
  sourceName: string
  category: CategorySlug
  /** Thời gian đăng, chuỗi ISO 8601 */
  publishedAt: string
}

/** Bài viết đầy đủ, trả về từ GET /api/news/:id */
export interface ArticleDetail extends Article {
  /** Nội dung bài dạng chữ thường, các đoạn cách nhau bằng \n\n */
  content: string
}

export interface Paginated<T> {
  items: T[]
  page: number
  hasMore: boolean
}
