import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import type { CategorySlug } from '@/constants/categories'
import type { Article, Paginated } from '@/types/article'

import { fetchArticle, fetchNews, searchNews } from './api'

// Key của cache TanStack Query. Gom một chỗ để làm mới (invalidate) đúng nhóm dữ liệu
export const newsKeys = {
  all: ['news'] as const,
  list: (category?: CategorySlug) => ['news', 'list', category ?? 'all'] as const,
  search: (q: string) => ['news', 'search', q] as const,
  detail: (id: string) => ['news', 'detail', id] as const,
}

/** Trang tiếp theo cần tải, hoặc undefined nếu đã hết bài */
function nextPage(last: Paginated<Article>) {
  return last.hasMore ? last.page + 1 : undefined
}

/**
 * Tin mới nhất (hoặc theo chuyên mục), tải thêm từng trang khi cuộn.
 * Màn hình dùng: data.pages.flatMap(p => p.items), fetchNextPage(), refetch()
 */
export function useNews(category?: CategorySlug, options: { enabled?: boolean } = {}) {
  return useInfiniteQuery({
    queryKey: newsKeys.list(category),
    queryFn: ({ pageParam }) => fetchNews({ category, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: nextPage,
    enabled: options.enabled ?? true,
  })
}

/**
 * Tìm bài theo từ khóa. Từ khóa rỗng thì không gọi API.
 * Màn hình nên debounce (chờ người dùng ngừng gõ) rồi mới truyền q vào đây.
 */
export function useSearchNews(q: string) {
  const query = q.trim()
  return useInfiniteQuery({
    queryKey: newsKeys.search(query),
    queryFn: ({ pageParam }) => searchNews({ q: query, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: nextPage,
    enabled: query.length > 0,
  })
}

/** Bài đầy đủ (có nội dung) cho màn chi tiết. Nội dung bài ít đổi nên giữ cache 10 phút */
export function useArticle(id: string | undefined) {
  return useQuery({
    queryKey: newsKeys.detail(id ?? ''),
    queryFn: () => fetchArticle(id!),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  })
}
