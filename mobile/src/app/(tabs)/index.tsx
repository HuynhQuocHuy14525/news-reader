import { YStack } from 'tamagui'

import { NewsList } from '@/features/news/components/NewsList'
import { ScreenHeader } from '@/features/news/components/ScreenHeader'
import { useNews } from '@/features/news/hooks'

// Màn hình #4 Trang chủ: tin mới nhất của mọi chuyên mục
export default function HomeScreen() {
  const news = useNews()
  const today = new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' })

  return (
    <YStack flex={1} bg="background">
      <ScreenHeader title="Tin mới" subtitle={today} />
      <NewsList query={news} />
    </YStack>
  )
}
