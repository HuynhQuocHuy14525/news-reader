import { useState } from 'react'
import { FlatList, RefreshControl } from 'react-native'
import { Separator, XStack } from 'tamagui'

import { ArticleCard } from '@/features/news/components/ArticleCard'
import { ArticleListSkeleton } from '@/features/news/components/ArticleCardSkeleton'
import { EmptyState, ErrorState } from '@/features/news/components/ListStates'
import { getErrorMessage } from '@/features/news/errors'

import { useBookmarks } from '../hooks'
import { BookmarkButton } from './BookmarkButton'

/** Danh sách bài đã lưu: kéo để làm mới, mỗi dòng có nút bỏ lưu bên phải */
export function BookmarkList() {
  const { data, isPending, isError, error, refetch } = useBookmarks()
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  if (isPending) return <ArticleListSkeleton />
  if (isError && !data) return <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <XStack items="center" pr="2">
          <XStack flex={1} minW={0}>
            <ArticleCard article={item} />
          </XStack>
          <BookmarkButton article={item} compact />
        </XStack>
      )}
      ItemSeparatorComponent={() => <Separator mx="3" />}
      ListEmptyComponent={
        <EmptyState icon="🔖" message="Chưa có bài nào. Bấm nút Lưu bài ở trang chi tiết để đọc lại sau." />
      }
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={data?.length ? undefined : { flexGrow: 1 }}
    />
  )
}
