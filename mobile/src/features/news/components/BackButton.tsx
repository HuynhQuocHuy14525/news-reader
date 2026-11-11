import { router } from 'expo-router'
import { Text, YStack } from 'tamagui'

/** Nút quay lại. Mở thẳng bằng đường dẫn (không có trang trước) thì về trang chủ */
export function BackButton() {
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'))
  return (
    <YStack
      w="10"
      h="10"
      rounded="full"
      items="center"
      justify="center"
      bg="transparent press:background-press"
      onPress={goBack}
      role="button"
      aria-label="Quay lại"
    >
      <Text fontSize="2xl">←</Text>
    </YStack>
  )
}
