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

/** Một khối nội dung trong bài, theo đúng thứ tự trên trang báo gốc */
export type ArticleBlock =
  | { type: 'paragraph'; text: string }
  /** Tiêu đề phụ giữa bài */
  | { type: 'heading'; text: string }
  | {
      type: 'image'
      url: string
      caption: string | null
      /** Rộng / cao. null nếu báo không ghi kích thước, app tự đo khi ảnh tải xong */
      aspectRatio: number | null
    }

/** Bài viết đầy đủ, trả về từ GET /api/news/:id */
export interface ArticleDetail extends Article {
  /** Nội dung bài dạng chữ thường, các đoạn cách nhau bằng \n\n (phần AI dùng) */
  content: string
  /** Nội dung bài có cả tiêu đề phụ và ảnh, để app hiển thị. Rỗng nếu không tải được trang gốc */
  blocks: ArticleBlock[]
}

export interface Paginated<T> {
  items: T[]
  page: number
  hasMore: boolean
}
