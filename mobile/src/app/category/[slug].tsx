import { useLocalSearchParams } from 'expo-router'
import { YStack } from 'tamagui'

import { findCategory } from '@/features/news/categories'
import { EmptyState } from '@/features/news/components/ListStates'
import { NewsSplitView } from '@/features/news/components/NewsSplitView'
import { ScreenHeader } from '@/features/news/components/ScreenHeader'
import { useNews } from '@/features/news/hooks'

// Màn hình #6 Tin theo chuyên mục, ví dụ /category/cong-nghe
export default function CategoryNewsScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>()
  const category = findCategory(slug)
  // Hook phải gọi trước mọi lệnh return; slug sai thì không gọi API
  const news = useNews(category?.slug, { enabled: !!category })

  const header = (
    <ScreenHeader showBack title={category ? `${category.icon} ${category.name}` : 'Chuyên mục'} subtitle="Chuyên mục" />
  )

  if (!category) {
    return (
      <YStack flex={1} bg="background">
        {header}
        <EmptyState icon="🤔" message="Không tìm thấy chuyên mục này" />
      </YStack>
    )
  }

  return (
    <YStack flex={1} bg="background">
      {header}
      <NewsSplitView query={news} emptyMessage="Chuyên mục này chưa có bài viết" />
    </YStack>
  )
}
