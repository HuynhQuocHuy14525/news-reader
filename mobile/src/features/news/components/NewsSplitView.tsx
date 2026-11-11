import { useState, type ComponentProps } from 'react'
import { Text, XStack, YStack } from 'tamagui'

import { useResponsive } from '@/hooks/use-responsive'

import { ArticleDetailView } from './ArticleDetailView'
import { NewsList } from './NewsList'

type NewsSplitViewProps = Omit<ComponentProps<typeof NewsList>, 'onPressArticle' | 'selectedId'>

/**
 * Danh sách bài tự đổi theo độ rộng màn hình:
 * - Điện thoại dọc: chỉ có danh sách, bấm bài thì mở màn chi tiết.
 * - Tablet / xoay ngang: chia 2 cột, bấm bài bên trái thì nội dung hiện bên phải.
 */
export function NewsSplitView(props: NewsSplitViewProps) {
  const { isWide, listWidth } = useResponsive()
  const [selectedId, setSelectedId] = useState<string>()

  if (!isWide) return <NewsList {...props} />

  // Chưa chọn bài nào thì mở sẵn bài đầu tiên cho cột phải khỏi trống
  const firstId = props.query.data?.pages[0]?.items[0]?.id
  const shownId = selectedId ?? firstId

  return (
    <XStack flex={1}>
      <YStack w={listWidth} borderRightWidth={1} borderColor="border-color">
        <NewsList {...props} selectedId={shownId} onPressArticle={(a) => setSelectedId(a.id)} />
      </YStack>
      <YStack flex={1}>
        {shownId ? (
          // key: đổi bài thì tạo lại khung để cuộn về đầu bài mới
          <ArticleDetailView key={shownId} id={shownId} />
        ) : (
          <YStack flex={1} items="center" justify="center">
            <Text color="color-10">Chọn một bài để đọc</Text>
          </YStack>
        )}
      </YStack>
    </XStack>
  )
}
