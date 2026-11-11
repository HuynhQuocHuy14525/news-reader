import { useEffect } from 'react'
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import { XStack, YStack } from 'tamagui'

/** Khung xám cùng kích thước ArticleCard, hiện trong lúc chờ tải tin */
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

/** Vài dòng skeleton liền nhau, cả khối nhấp nháy nhẹ để người dùng biết đang tải */
export function ArticleListSkeleton({ count = 6 }: { count?: number }) {
  const opacity = useSharedValue(1)
  // Người dùng bật "giảm chuyển động" trong cài đặt máy thì không nhấp nháy
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (reduceMotion) return
    // Mờ xuống 0.4 rồi sáng lại, lặp mãi (-1), true = chạy ngược lại mỗi lượt
    opacity.value = withRepeat(withTiming(0.4, { duration: 800, easing: Easing.inOut(Easing.ease) }), -1, true)
  }, [opacity, reduceMotion])

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }))

  return (
    <Animated.View style={style}>
      {Array.from({ length: count }, (_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </Animated.View>
  )
}
