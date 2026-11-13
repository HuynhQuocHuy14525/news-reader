import { Image } from 'expo-image'
import { useState } from 'react'
import { Platform } from 'react-native'
import { Text, YStack } from 'tamagui'

import type { ArticleBlock, ArticleDetail } from '@/types/article'

/** Tỉ lệ tạm cho ảnh chưa biết kích thước, đổi lại khi ảnh tải xong */
const DEFAULT_IMAGE_RATIO = 3 / 2

/**
 * Khoảng cách dòng = cỡ chữ x hệ số. Trên điện thoại lineHeight tính bằng px,
 * còn trên web một số không có đơn vị được hiểu là hệ số nhân, nên phải tách 2 trường hợp.
 */
export function lineHeight(fontSize: number, ratio: number) {
  return Platform.OS === 'web' ? ratio : Math.round(fontSize * ratio)
}

/**
 * Thân bài: đoạn văn, tiêu đề phụ và ảnh kèm chú thích theo đúng thứ tự trên trang báo.
 * Backend cũ hoặc không tải được trang gốc thì blocks rỗng, khi đó hiện các đoạn trong content.
 */
export function ArticleBody({ article, fontSize }: { article: ArticleDetail; fontSize: number }) {
  const blocks: ArticleBlock[] = article.blocks?.length
    ? article.blocks
    : article.content.split('\n\n').map((text) => ({ type: 'paragraph', text }))

  return (
    <YStack gap="4">
      {blocks
        // Đoạn mô tả đã in đậm ở trên, không lặp lại
        .filter((block) => !(block.type === 'paragraph' && block.text === article.summary))
        .map((block, i) => (
          <BlockView key={i} block={block} fontSize={fontSize} />
        ))}
    </YStack>
  )
}

function BlockView({ block, fontSize }: { block: ArticleBlock; fontSize: number }) {
  switch (block.type) {
    case 'heading':
      return (
        <Text mt="2" fontSize={fontSize + 3} fontWeight="700" lineHeight={lineHeight(fontSize + 3, 1.4)}>
          {block.text}
        </Text>
      )
    case 'image':
      return <ArticleImage block={block} />
    default:
      return (
        <Text fontSize={fontSize} lineHeight={lineHeight(fontSize, 1.6)}>
          {block.text}
        </Text>
      )
  }
}

function ArticleImage({ block }: { block: Extract<ArticleBlock, { type: 'image' }> }) {
  // Báo không ghi kích thước thì đo khi ảnh tải xong để ảnh không bị cắt hay méo
  const [ratio, setRatio] = useState(block.aspectRatio ?? DEFAULT_IMAGE_RATIO)

  return (
    <YStack gap="2">
      <Image
        source={{ uri: block.url }}
        style={{ width: '100%', aspectRatio: ratio, borderRadius: 8 }}
        contentFit="cover"
        transition={200}
        accessibilityLabel={block.caption ?? undefined}
        onLoad={(e) => {
          const { width, height } = e.source
          if (!block.aspectRatio && width > 0 && height > 0) setRatio(width / height)
        }}
      />
      {block.caption && (
        <Text fontSize="sm" color="color-10" fontStyle="italic" text="center" lineHeight={lineHeight(14, 1.5)}>
          {block.caption}
        </Text>
      )}
    </YStack>
  )
}
