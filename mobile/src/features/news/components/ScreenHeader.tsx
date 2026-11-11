import type { ReactNode } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text, XStack, YStack } from 'tamagui'

interface ScreenHeaderProps {
  title: string
  subtitle?: string
  /** Nút hoặc phần tử đặt bên phải tiêu đề */
  right?: ReactNode
  /** Phần đặt dưới tiêu đề, ví dụ ô tìm kiếm */
  children?: ReactNode
}

/** Tiêu đề lớn đầu màn hình, tự chừa khoảng tai thỏ / thanh trạng thái */
export function ScreenHeader({ title, subtitle, right, children }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets()
  return (
    <YStack px="4" pb="3" gap="3" bg="background" style={{ paddingTop: insets.top + 12 }}>
      <XStack items="center" justify="space-between" gap="3">
        <YStack flex={1}>
          {subtitle && (
            <Text fontSize="xs" color="color-10" textTransform="uppercase">
              {subtitle}
            </Text>
          )}
          <Text fontSize="3xl" fontWeight="800">
            {title}
          </Text>
        </YStack>
        {right}
      </XStack>
      {children}
    </YStack>
  )
}
