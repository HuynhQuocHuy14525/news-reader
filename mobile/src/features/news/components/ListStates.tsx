import { Button, Text, YStack } from 'tamagui'

/** Hiện khi tải tin bị lỗi, có nút thử lại */
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <YStack flex={1} items="center" justify="center" gap="4" p="6">
      <Text fontSize="4xl">😕</Text>
      <Text text="center" color="color-11">
        {message}
      </Text>
      {onRetry && <Button onPress={onRetry}>Thử lại</Button>}
    </YStack>
  )
}

/** Hiện khi danh sách không có bài nào (ví dụ tìm không ra) */
export function EmptyState({ message, icon = '📰' }: { message: string; icon?: string }) {
  return (
    <YStack flex={1} items="center" justify="center" gap="3" p="6">
      <Text fontSize="4xl">{icon}</Text>
      <Text text="center" color="color-11">
        {message}
      </Text>
    </YStack>
  )
}
