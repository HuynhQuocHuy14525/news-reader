import { useInfiniteQuery } from '@tanstack/react-query'

import type { CategorySlug } from '@/constants/categories'
import type { Article, Paginated } from '@/types/article'

import { fetchNews } from './api'

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
export function useNews(category?: CategorySlug) {
  return useInfiniteQuery({
    queryKey: newsKeys.list(category),
    queryFn: ({ pageParam }) => fetchNews({ category, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: nextPage,
  })
}
