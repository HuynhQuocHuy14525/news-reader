import AsyncStorage from '@react-native-async-storage/async-storage'
import { useMutation, useQuery } from '@tanstack/react-query'

import { queryClient } from '@/services/query-client'
import type { Article } from '@/types/article'

// Lịch sử đọc lưu ngay trên máy (AsyncStorage), không cần đăng nhập, không gọi API (docs/api.md)
const STORAGE_KEY = 'news-reader:history'
const MAX_ITEMS = 100
const historyKey = ['history'] as const

export interface HistoryItem {
  article: Article
  /** Lần mở gần nhất, chuỗi ISO 8601 */
  readAt: string
}

async function loadHistory(): Promise<HistoryItem[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    const saved: unknown = JSON.parse(raw)
    return Array.isArray(saved) ? (saved as HistoryItem[]) : []
  } catch {
    return []
  }
}

/** Ghi xuống máy rồi cập nhật cache, màn Lịch sử đang mở tự vẽ lại */
async function saveHistory(items: HistoryItem[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  queryClient.setQueryData(historyKey, items)
  return items
}

/** Chỉ giữ các trường của Article (bỏ `content` dài của ArticleDetail) cho nhẹ bộ nhớ */
function pickArticle(a: Article): Article {
  return {
    id: a.id,
    title: a.title,
    summary: a.summary,
    url: a.url,
    imageUrl: a.imageUrl,
    source: a.source,
    sourceName: a.sourceName,
    category: a.category,
    publishedAt: a.publishedAt,
  }
}

// Các lần ghi chạy lần lượt, mở nhanh 2 bài liên tiếp không bị mất bài nào
let queue: Promise<unknown> = Promise.resolve()
function enqueue<T>(task: () => Promise<T>) {
  const next = queue.then(task)
  queue = next.catch(() => {})
  return next
}

/**
 * Ghi lại bài vừa đọc. Phần A gọi khi mở màn chi tiết bài (docs/phan-cong.md).
 * Bài đã có thì chuyển lên đầu, giữ tối đa 100 bài gần nhất.
 */
export function addToHistory(article: Article) {
  return enqueue(async () => {
    const items = await loadHistory()
    const others = items.filter((item) => item.article.id !== article.id)
    const entry = { article: pickArticle(article), readAt: new Date().toISOString() }
    return saveHistory([entry, ...others].slice(0, MAX_ITEMS))
  })
}

export function removeFromHistory(articleId: string) {
  return enqueue(async () => {
    const items = await loadHistory()
    return saveHistory(items.filter((item) => item.article.id !== articleId))
  })
}

export function clearHistory() {
  return enqueue(() => saveHistory([]))
}

/** Danh sách bài đã đọc, mới đọc đứng đầu */
export function useHistory() {
  return useQuery({ queryKey: historyKey, queryFn: loadHistory, staleTime: Infinity })
}

export function useClearHistory() {
  return useMutation({ mutationFn: clearHistory })
}
