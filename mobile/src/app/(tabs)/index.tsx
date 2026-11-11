import { Redirect, type Href } from 'expo-router'
import { useState } from 'react'
import { YStack } from 'tamagui'

import type { CategorySlug } from '@/constants/categories'
import { InterestChips } from '@/features/news/components/InterestChips'
import { NewsSplitView } from '@/features/news/components/NewsSplitView'
import { ScreenHeader } from '@/features/news/components/ScreenHeader'
import { useNews } from '@/features/news/hooks'
import { useInterests } from '@/features/news/interests'

// Màn hình #4 Trang chủ: tin mới nhất, lọc nhanh theo chủ đề quan tâm
export default function HomeScreen() {
  const interests = useInterests()
  const [filter, setFilter] = useState<CategorySlug>()
  const news = useNews(filter)
  const today = new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' })

  // Lần đầu mở app (chưa lưu chủ đề nào) thì chuyển sang màn giới thiệu
  if (interests.data === null) return <Redirect href={'/onboarding' as Href} />

  return (
    <YStack flex={1} bg="background">
      <ScreenHeader title="Tin mới" subtitle={today}>
        {interests.data && <InterestChips interests={interests.data} value={filter} onChange={setFilter} />}
      </ScreenHeader>
      <NewsSplitView query={news} />
    </YStack>
  )
}
