import { Text, YStack } from 'tamagui'

// Màn hình tạm, sau khi làm đăng nhập sẽ hiện thông tin tài khoản
export default function ProfileScreen() {
  return (
    <YStack flex={1} items="center" justify="center" gap="2" p="4" bg="background">
      <Text fontSize="xl">Cá nhân</Text>
      <Text color="gray">Bạn chưa đăng nhập</Text>
    </YStack>
  )
}
