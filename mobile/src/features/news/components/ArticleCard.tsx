import { Image } from 'expo-image'
import { router, type Href } from 'expo-router'
import { Text, XStack, YStack } from 'tamagui'

import type { Article } from '@/types/article'

import { formatRelativeTime } from '../format'

const THUMB_WIDTH = 112
const THUMB_HEIGHT = 80

interface ArticleCardProps {
  article: Article
  /** Mặc định mở màn chi tiết. Truyền vào khi muốn làm việc khác, ví dụ hiện bài ở cột phải trên tablet */
  onPress?: (article: Article) => void
  /** Bài đang mở ở cột phải (màn rộng), tô nền khác để dễ nhận ra */
  selected?: boolean
}

/** Một dòng bài viết trong danh sách: ảnh nhỏ bên trái, tiêu đề + nguồn + thời gian bên phải */
export function ArticleCard({ article, onPress, selected }: ArticleCardProps) {
  const handlePress = () => {
    if (onPress) return onPress(article)
    // `as Href` vì màn /article/[id] (bước A7) chưa có thì typed routes chưa biết đường dẫn này
    router.push(`/article/${article.id}` as Href)
  }

  return (
    <XStack
      gap="3"
      p="3"
      // Tamagui 3: trạng thái nhấn viết ngay trong giá trị (press:...), không còn pressStyle
      bg={selected ? 'color-4' : 'background press:background-press'}
      onPress={handlePress}
      role="button"
      aria-label={article.title}
      aria-selected={selected}
    >
      <Image
        source={article.imageUrl ? { uri: article.imageUrl } : null}
        style={{ width: THUMB_WIDTH, height: THUMB_HEIGHT, borderRadius: 8, backgroundColor: '#8882' }}
        contentFit="cover"
        transition={200}
      />
      {/* minW={0}: cho phép cột chữ co lại để tiêu đề xuống dòng thay vì tràn ra ngoài */}
      <YStack flex={1} minW={0} gap="1" justify="space-between">
        <Text fontWeight="600" numberOfLines={3}>
          {article.title}
        </Text>
        <Text fontSize="xs" color="color-10" numberOfLines={1}>
          {article.sourceName} · {formatRelativeTime(article.publishedAt)}
        </Text>
      </YStack>
    </XStack>
  )
}
