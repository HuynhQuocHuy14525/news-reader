import { apiClient } from '@/services/api-client'
import type { Article } from '@/types/article'

// GET /bookmarks 🔒 → bài mới lưu đứng đầu
export async function getBookmarks() {
  const { data } = await apiClient.get<Article[]>('/bookmarks')
  return data
}

// POST /bookmarks 🔒
export async function addBookmark(article: Article) {
  const { data } = await apiClient.post<Article>('/bookmarks', article)
  return data
}

// DELETE /bookmarks/:articleId 🔒
export async function removeBookmark(articleId: string) {
  await apiClient.delete(`/bookmarks/${encodeURIComponent(articleId)}`)
}
