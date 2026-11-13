import { router, type Href } from 'expo-router'
import { Button, Spinner, Text, YStack } from 'tamagui'

import { useAuth, useLogout } from '@/features/auth/hooks'
import { ScreenHeader } from '@/features/news/components/ScreenHeader'

const PRIMARY = '#0090FF'

// Màn hình #12 Cá nhân. Bản đầy đủ (lịch sử đọc, cài đặt) làm ở bước B9
export default function ProfileScreen() {
  const { user, isLoading } = useAuth()
  const logout = useLogout()

  return (
    <YStack flex={1} bg="background">
      <ScreenHeader title="Cá nhân" />
      <YStack p="4" gap="4" w="100%" maxW={480} self="center">
        {isLoading ? (
          <Spinner />
        ) : user ? (
          <>
            <YStack items="center" gap="2" py="4">
              <YStack w="20" h="20" rounded="full" items="center" justify="center" style={{ backgroundColor: PRIMARY }}>
                <Text fontSize="3xl" fontWeight="700" color="white">
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              </YStack>
              <Text fontSize="xl" fontWeight="700">
                {user.name}
              </Text>
              <Text color="color-11">{user.email}</Text>
            </YStack>
            <Button variant="outlined" onPress={logout}>
              Đăng xuất
            </Button>
          </>
        ) : (
          <>
            <YStack items="center" gap="2" py="4">
              <Text fontSize="5xl">👤</Text>
              <Text text="center" color="color-11">
                Đăng nhập để lưu bài viết và xem lại trên mọi thiết bị.
              </Text>
            </YStack>
            <Button color="white" style={{ backgroundColor: PRIMARY }} onPress={() => router.push('/login' as Href)}>
              Đăng nhập
            </Button>
            <Button variant="outlined" onPress={() => router.push('/register' as Href)}>
              Tạo tài khoản
            </Button>
          </>
        )}
      </YStack>
    </YStack>
  )
}
