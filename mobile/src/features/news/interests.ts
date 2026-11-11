import AsyncStorage from '@react-native-async-storage/async-storage'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { CATEGORIES, type CategorySlug } from '@/constants/categories'

// Chủ đề người dùng chọn ở màn onboarding, lưu ngay trên máy (không cần đăng nhập)
const STORAGE_KEY = 'news-reader:interests'
const interestsKey = ['interests'] as const

/** null = chưa qua onboarding (lần đầu mở app) */
async function loadInterests(): Promise<CategorySlug[] | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY)
  if (raw === null) return null
  try {
    const saved: unknown = JSON.parse(raw)
    // Chỉ giữ slug còn tồn tại, phòng khi danh sách chuyên mục thay đổi
    const valid = CATEGORIES.map((c) => c.slug)
    return Array.isArray(saved) ? valid.filter((slug) => saved.includes(slug)) : []
  } catch {
    return []
  }
}

async function saveInterests(slugs: CategorySlug[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(slugs))
  return slugs
}

/** Đọc chủ đề quan tâm. data === null nghĩa là chưa chọn lần nào */
export function useInterests() {
  return useQuery({ queryKey: interestsKey, queryFn: loadInterests, staleTime: Infinity })
}

/** Lưu chủ đề quan tâm, các màn đang dùng useInterests() tự cập nhật theo */
export function useSaveInterests() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: saveInterests,
    onSuccess: (slugs) => queryClient.setQueryData(interestsKey, slugs),
  })
}
