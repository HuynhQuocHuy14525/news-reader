import { XStack, YStack } from 'tamagui'

/**
 * Khung xám cùng kích thước ArticleCard, hiện trong lúc chờ tải tin.
 * Hiệu ứng nhấp nháy sẽ thêm ở bước animation (A10).
 */
export function ArticleCardSkeleton() {
  return (
    <XStack gap="3" p="3" aria-hidden>
      <YStack w={112} h={80} rounded="2" bg="color-4" />
      <YStack flex={1} gap="2" py="1">
        <YStack h="4" rounded="1" bg="color-4" />
        <YStack h="4" w="80%" rounded="1" bg="color-4" />
        <YStack h="3" w="40%" rounded="1" bg="color-3" mt="auto" />
      </YStack>
    </XStack>
  )
}

/** Vài dòng skeleton liền nhau cho màn hình danh sách lúc mới mở */
export function ArticleListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <YStack>
      {Array.from({ length: count }, (_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </YStack>
  )
}
