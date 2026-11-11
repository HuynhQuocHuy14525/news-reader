import { Image } from 'expo-image'
import { openBrowserAsync } from 'expo-web-browser'
import { Platform, ScrollView } from 'react-native'
import { Button, Spinner, Text, XStack, YStack } from 'tamagui'

import type { ArticleDetail } from '@/types/article'

import { findCategory } from '../categories'
import { getErrorMessage } from '../errors'
import { formatRelativeTime } from '../format'
import { useArticle } from '../hooks'
import { ErrorState } from './ListStates'

// Cỡ chữ nội dung bài. TODO(B10): thay bằng useFontSize() khi phần Cài đặt của Dũng xong
const BODY_FONT_SIZE = 17
/**
 * Khoảng cách dòng = cỡ chữ x hệ số. Trên điện thoại lineHeight tính bằng px,
 * còn trên web một số không có đơn vị được hiểu là hệ số nhân, nên phải tách 2 trường hợp.
 */
function lineHeight(fontSize: number, ratio: number) {
  return Platform.OS === 'web' ? ratio : Math.round(fontSize * ratio)
}

/**
 * Nội dung một bài: ảnh, tiêu đề, nguồn, các đoạn văn, nút mở bài gốc.
 * Dùng ở màn /article/[id] và ở cột phải khi chia 2 cột trên tablet.
 */
export function ArticleDetailView({ id }: { id: string }) {
  const { data: article, isPending, isError, error, refetch } = useArticle(id)

  if (isPending) {
    return (
      <YStack flex={1} items="center" justify="center">
        <Spinner size="large" />
      </YStack>
    )
  }
  if (isError) return <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
      {article.imageUrl && (
        <Image
          source={{ uri: article.imageUrl }}
          style={{ width: '100%', aspectRatio: 16 / 9 }}
          contentFit="cover"
          transition={200}
        />
      )}
      <YStack p="4" gap="4" maxW={760} w="100%" self="center">
        <ArticleMeta article={article} />
        <Text fontSize={24} fontWeight="800" lineHeight={lineHeight(24, 1.3)}>
          {article.title}
        </Text>
        {/* Đoạn mô tả in đậm như sapo của báo */}
        <Text fontWeight="600" fontSize={BODY_FONT_SIZE} lineHeight={lineHeight(BODY_FONT_SIZE, 1.6)}>
          {article.summary}
        </Text>
        {article.content
          .split('\n\n')
          .filter((p) => p !== article.summary)
          .map((paragraph, i) => (
            <Text key={i} fontSize={BODY_FONT_SIZE} lineHeight={lineHeight(BODY_FONT_SIZE, 1.6)}>
              {paragraph}
            </Text>
          ))}

        {/* TODO(B5): <BookmarkButton article={article} /> khi phần Bài đã lưu của Dũng xong */}
        {/* TODO(B8): nút "Tóm tắt bằng AI" -> router.push('/ai/' + article.id) khi màn AI của Dũng xong */}

        <Button mt="2" onPress={() => openBrowserAsync(article.url)}>
          {`Đọc bài gốc trên ${article.sourceName}`}
        </Button>
      </YStack>
    </ScrollView>
  )
}

function ArticleMeta({ article }: { article: ArticleDetail }) {
  const category = findCategory(article.category)
  return (
    <XStack items="center" gap="2" flexWrap="wrap">
      {category && (
        <Text
          fontSize="xs"
          fontWeight="700"
          color="white"
          px="2"
          py="0.5"
          rounded="1"
          style={{ backgroundColor: category.color }}
        >
          {category.name.toUpperCase()}
        </Text>
      )}
      <Text fontSize="sm" color="color-10">
        {article.sourceName} · {formatRelativeTime(article.publishedAt)}
      </Text>
    </XStack>
  )
}
