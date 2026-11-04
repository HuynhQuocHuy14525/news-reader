import { Button, Text, YStack } from 'tamagui'

import { useResponsive } from '@/hooks/use-responsive'

// Màn hình tạm để kiểm tra khung, sẽ thay bằng (tabs)/index.tsx
export default function HomeScreen() {
  const { width, isWide } = useResponsive()
  return (
    <YStack flex={1} items="center" justify="center" gap="4" p="4" bg="background">
      <Text fontSize="2xl">News Reader</Text>
      <Text>
        Rộng {Math.round(width)}px · {isWide ? 'chia 2 cột' : '1 cột'}
      </Text>
      <Button>Tamagui đã chạy!</Button>
    </YStack>
  )
}
