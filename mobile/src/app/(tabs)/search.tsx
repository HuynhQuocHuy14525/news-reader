import { useState } from 'react'
import { Input, Text, XStack, YStack } from 'tamagui'

import { EmptyState } from '@/features/news/components/ListStates'
import { NewsList } from '@/features/news/components/NewsList'
import { ScreenHeader } from '@/features/news/components/ScreenHeader'
import { useSearchNews } from '@/features/news/hooks'
import { useDebouncedValue } from '@/features/news/use-debounced-value'

// Từ khóa gợi ý khi ô tìm kiếm còn trống
const SUGGESTIONS = ['bóng đá', 'AI', 'giá vàng', 'thời tiết', 'iPhone', 'tuyển sinh']

// Màn hình #7 Tìm kiếm
export default function SearchScreen() {
  const [text, setText] = useState('')
  const keyword = useDebouncedValue(text.trim())
  const results = useSearchNews(keyword)

  return (
    <YStack flex={1} bg="background">
      <ScreenHeader title="Tìm kiếm">
        <Input
          value={text}
          onChangeText={setText}
          placeholder="Nhập từ khóa, ví dụ: bong da"
          returnKeyType="search"
          autoCorrect={false}
          clearButtonMode="while-editing"
          aria-label="Ô tìm kiếm"
        />
      </ScreenHeader>

      {keyword ? (
        <NewsList query={results} emptyMessage={`Không tìm thấy bài nào có "${keyword}"`} />
      ) : (
        <YStack flex={1}>
          <YStack px="4" gap="3">
            <Text fontSize="sm" color="color-10">
              Gợi ý
            </Text>
            <XStack flexWrap="wrap" gap="2">
              {SUGGESTIONS.map((s) => (
                <Text
                  key={s}
                  px="3"
                  py="1.5"
                  rounded="full"
                  bg="color-3 press:color-5"
                  onPress={() => setText(s)}
                  role="button"
                >
                  {s}
                </Text>
              ))}
            </XStack>
          </YStack>
          <EmptyState icon="🔍" message="Tìm theo tiêu đề và mô tả, gõ không dấu cũng được" />
        </YStack>
      )}
    </YStack>
  )
}
