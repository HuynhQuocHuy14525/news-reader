import type { CategorySlug } from '@/constants/categories'
import { apiClient } from '@/services/api-client'
import type { Article, ArticleDetail, Paginated } from '@/types/article'

// Hàm gọi API tin tức (docs/api.md, mục "Tin tức"). Màn hình không gọi trực tiếp mà dùng hook trong hooks.ts

export const NEWS_PAGE_SIZE = 20

// Backend deploy gói miễn phí (Render) ngủ sau 15 phút không dùng, lần gọi đầu mất ~30–50 giây để thức dậy.
// apiClient mặc định chờ 10 giây, nên request tin tức chờ lâu hơn để khỏi báo lỗi oan.
const NEWS_TIMEOUT_MS = 60 * 1000

export async function fetchNews(params: { category?: CategorySlug; page: number }) {
  const { data } = await apiClient.get<Paginated<Article>>('/news', {
    params: { ...params, limit: NEWS_PAGE_SIZE },
    timeout: NEWS_TIMEOUT_MS,
  })
  return data
}

export async function searchNews(params: { q: string; page: number }) {
  const { data } = await apiClient.get<Paginated<Article>>('/news/search', {
    params: { ...params, limit: NEWS_PAGE_SIZE },
    timeout: NEWS_TIMEOUT_MS,
  })
  return data
}

export async function fetchArticle(id: string) {
  const { data } = await apiClient.get<ArticleDetail>(`/news/${id}`, { timeout: NEWS_TIMEOUT_MS })
  return data
}
