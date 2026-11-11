import type { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query'
import { useState, type ReactElement } from 'react'
import { FlatList, RefreshControl } from 'react-native'
import { Separator, Spinner, YStack } from 'tamagui'

import type { Article, Paginated } from '@/types/article'

import { getErrorMessage } from '../errors'
import { ArticleCard } from './ArticleCard'
import { ArticleListSkeleton } from './ArticleCardSkeleton'
import { EmptyState, ErrorState } from './ListStates'

type NewsQuery = UseInfiniteQueryResult<InfiniteData<Paginated<Article>>>

interface NewsListProps {
  /** Kết quả của useNews(...) hoặc useSearchNews(...) */
  query: NewsQuery
  emptyMessage?: string
  /** Phần hiện phía trên danh sách, cuộn cùng danh sách (ví dụ tiêu đề) */
  header?: ReactElement
  onPressArticle?: (article: Article) => void
}

/**
 * Danh sách bài dùng chung cho trang chủ, chuyên mục, tìm kiếm.
 * Tự lo: đang tải (skeleton), lỗi (nút thử lại), trống, kéo để làm mới, cuộn để tải thêm.
 */
export function NewsList({ query, emptyMessage = 'Chưa có bài viết nào', header, onPressArticle }: NewsListProps) {
  const { data, isPending, isError, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = query
  // Tự giữ trạng thái kéo làm mới, vì isRefetching cũng bật khi app tự tải lại ngầm
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  const onEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage()
  }

  if (isPending) {
    return (
      <YStack flex={1}>
        {header}
        <ArticleListSkeleton />
      </YStack>
    )
  }

  if (isError && !data) {
    return (
      <YStack flex={1}>
        {header}
        <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
      </YStack>
    )
  }

  // Có bài mới chen vào giữa lúc cuộn thì trang sau có thể lặp lại bài của trang trước, nên lọc trùng theo id
  const seen = new Set<string>()
  const articles = (data?.pages ?? [])
    .flatMap((page) => page.items)
    .filter((a) => !seen.has(a.id) && !!seen.add(a.id))

  return (
    <FlatList
      data={articles}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ArticleCard article={item} onPress={onPressArticle} />}
      ItemSeparatorComponent={() => <Separator mx="3" />}
      ListHeaderComponent={header}
      ListEmptyComponent={<EmptyState message={emptyMessage} />}
      ListFooterComponent={isFetchingNextPage ? <Spinner my="4" /> : undefined}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      onEndReached={onEndReached}
      // Còn nửa màn hình nữa là hết thì tải trang tiếp, người dùng ít phải chờ
      onEndReachedThreshold={0.5}
      contentContainerStyle={articles.length === 0 ? { flexGrow: 1 } : undefined}
    />
  )
}
