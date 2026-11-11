import { ScrollView } from 'react-native'
import { XStack, YStack } from 'tamagui'

import { CATEGORY_LIST } from '@/features/news/categories'
import { CategoryTile } from '@/features/news/components/CategoryTile'
import { ScreenHeader } from '@/features/news/components/ScreenHeader'
import { useResponsive } from '@/hooks/use-responsive'

// Màn hình #5 Chuyên mục: lưới các chuyên mục, điện thoại 2 cột, màn rộng 4 cột
export default function CategoriesScreen() {
  const { isWide } = useResponsive()
  const columns = isWide ? 4 : 2

  // Chia danh sách thành từng hàng, mỗi hàng `columns` ô
  const rows = []
  for (let i = 0; i < CATEGORY_LIST.length; i += columns) rows.push(CATEGORY_LIST.slice(i, i + columns))

  return (
    <YStack flex={1} bg="background">
      <ScreenHeader title="Chuyên mục" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {rows.map((row) => (
          <XStack key={row[0].slug} gap="3">
            {row.map((c) => (
              <CategoryTile key={c.slug} category={c} />
            ))}
          </XStack>
        ))}
      </ScrollView>
    </YStack>
  )
}
