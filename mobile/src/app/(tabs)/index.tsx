import { YStack } from 'tamagui'

import { NewsSplitView } from '@/features/news/components/NewsSplitView'
import { ScreenHeader } from '@/features/news/components/ScreenHeader'
import { useNews } from '@/features/news/hooks'

// Màn hình #4 Trang chủ: tin mới nhất của mọi chuyên mục
export default function HomeScreen() {
  const news = useNews()
  const today = new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' })

  return (
    <YStack flex={1} bg="background">
      <ScreenHeader title="Tin mới" subtitle={today} />
      <NewsSplitView query={news} />
    </YStack>
  )
}
