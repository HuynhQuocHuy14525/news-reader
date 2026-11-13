import { FlatList } from 'react-native'
import { Separator, Text, XStack, YStack } from 'tamagui'

import { ArticleCard } from '@/features/news/components/ArticleCard'
import { ArticleListSkeleton } from '@/features/news/components/ArticleCardSkeleton'
import { EmptyState } from '@/features/news/components/ListStates'
import { formatRelativeTime } from '@/features/news/format'

import { removeFromHistory, useHistory } from '../history'

/** Danh sách bài đã đọc, mỗi dòng ghi lúc đọc và có nút xóa khỏi lịch sử */
export function HistoryList() {
  const { data, isPending } = useHistory()

  if (isPending) return <ArticleListSkeleton />

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.article.id}
      renderItem={({ item }) => (
        <YStack>
          <Text fontSize="xs" color="color-10" px="3" pt="2">
            Đã đọc {formatRelativeTime(item.readAt).toLowerCase()}
          </Text>
          <XStack items="center" pr="2">
            <XStack flex={1} minW={0}>
              <ArticleCard article={item.article} />
            </XStack>
            <YStack
              w="10"
              h="10"
              rounded="full"
              items="center"
              justify="center"
              bg="transparent press:background-press"
              onPress={() => removeFromHistory(item.article.id)}
              role="button"
              aria-label="Xóa khỏi lịch sử"
            >
              <Text color="color-10">✕</Text>
            </YStack>
          </XStack>
        </YStack>
      )}
      ItemSeparatorComponent={() => <Separator mx="3" />}
      ListEmptyComponent={<EmptyState icon="🕘" message="Chưa đọc bài nào. Bài bạn mở sẽ hiện ở đây." />}
      contentContainerStyle={data?.length ? undefined : { flexGrow: 1 }}
    />
  )
}
