import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useAuth } from '@/features/auth/hooks'
import type { Article } from '@/types/article'

import { addBookmark, getBookmarks, removeBookmark } from './api'

// Mỗi tài khoản một cache riêng, đổi tài khoản không bị lẫn bài của người trước
const bookmarksKey = (userId: string | undefined) => ['bookmarks', userId] as const

/** Danh sách bài đã lưu của người đang đăng nhập. Chưa đăng nhập thì không gọi API */
export function useBookmarks() {
  const { user } = useAuth()
  return useQuery({
    queryKey: bookmarksKey(user?.id),
    queryFn: getBookmarks,
    enabled: !!user,
  })
}

/** Bài này đã được lưu chưa (dùng chung cache với useBookmarks, không gọi thêm API) */
export function useIsBookmarked(articleId: string) {
  const { data } = useBookmarks()
  return !!data?.some((a) => a.id === articleId)
}

/**
 * Lưu / bỏ lưu một bài. Cập nhật giao diện ngay lập tức (optimistic update),
 * server báo lỗi thì trả lại như cũ.
 */
export function useToggleBookmark() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const key = bookmarksKey(user?.id)

  return useMutation({
    mutationFn: async ({ article, saved }: { article: Article; saved: boolean }) => {
      if (saved) await removeBookmark(article.id)
      else await addBookmark(article)
    },

    onMutate: async ({ article, saved }) => {
      // Dừng lần tải đang chạy để nó không ghi đè lên dữ liệu vừa sửa
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<Article[]>(key)
      queryClient.setQueryData<Article[]>(key, (list = []) => {
        const others = list.filter((a) => a.id !== article.id)
        return saved ? others : [article, ...others]
      })
      return { previous }
    },

    onError: (_error, _vars, context) => {
      queryClient.setQueryData(key, context?.previous)
    },

    // Xong (dù thành công hay lỗi) thì tải lại từ server cho chắc đúng
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  })
}
