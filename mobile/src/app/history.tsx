import { Alert } from 'react-native'
import { Text, YStack } from 'tamagui'

import { HistoryList } from '@/features/bookmarks/components/HistoryList'
import { useClearHistory, useHistory } from '@/features/bookmarks/history'
import { ScreenHeader } from '@/features/news/components/ScreenHeader'

// Màn hình #11 Lịch sử đọc (mở từ tab Cá nhân)
export default function HistoryScreen() {
  const { data } = useHistory()
  const clear = useClearHistory()
  const count = data?.length ?? 0

  // Hỏi lại trước khi xóa vì không hoàn tác được
  const confirmClear = () =>
    Alert.alert('Xóa lịch sử đọc?', `Xóa toàn bộ ${count} bài trong lịch sử. Không thể hoàn tác.`, [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa hết', style: 'destructive', onPress: () => clear.mutate() },
    ])

  return (
    <YStack flex={1} bg="background">
      <ScreenHeader
        title="Lịch sử đọc"
        subtitle={count ? `${count} bài` : undefined}
        showBack
        right={
          count > 0 ? (
            <Text color="red" fontWeight="600" px="2" py="2" onPress={confirmClear} role="button">
              Xóa hết
            </Text>
          ) : undefined
        }
      />
      <HistoryList />
    </YStack>
  )
}
