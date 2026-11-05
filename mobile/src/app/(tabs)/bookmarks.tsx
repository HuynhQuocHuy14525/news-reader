import { Text, YStack } from 'tamagui'

// Màn hình tạm, tuần 2 sẽ hiện danh sách bài đã lưu
export default function BookmarksScreen() {
  return (
    <YStack flex={1} items="center" justify="center" gap="2" p="4" bg="background">
      <Text fontSize="xl">Bài đã lưu</Text>
      <Text color="gray">Chưa có bài nào được lưu</Text>
    </YStack>
  )
}
