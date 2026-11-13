import { router, type Href } from 'expo-router'
import { Button, Spinner, Text, YStack } from 'tamagui'

import { useAuth } from '@/features/auth/hooks'
import { BookmarkList } from '@/features/bookmarks/components/BookmarkList'
import { useBookmarks } from '@/features/bookmarks/hooks'
import { ScreenHeader } from '@/features/news/components/ScreenHeader'

const PRIMARY = '#0090FF'

// Màn hình #10 Bài đã lưu
export default function BookmarksScreen() {
  const { isLoggedIn, isLoading } = useAuth()
  const { data } = useBookmarks()

  return (
    <YStack flex={1} bg="background">
      <ScreenHeader title="Đã lưu" subtitle={isLoggedIn && data ? `${data.length} bài` : undefined} />
      {isLoading ? (
        <Spinner mt="6" />
      ) : isLoggedIn ? (
        <BookmarkList />
      ) : (
        // Bài đã lưu nằm trên server theo tài khoản, nên phải đăng nhập mới xem được
        <YStack flex={1} items="center" justify="center" gap="4" p="6">
          <Text fontSize="5xl">🔖</Text>
          <Text text="center" color="color-11">
            Đăng nhập để lưu bài và đọc lại trên mọi thiết bị.
          </Text>
          <Button color="white" style={{ backgroundColor: PRIMARY }} onPress={() => router.push('/login' as Href)}>
            Đăng nhập
          </Button>
        </YStack>
      )}
    </YStack>
  )
}
