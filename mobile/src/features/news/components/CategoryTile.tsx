import { router, type Href } from 'expo-router'
import { Text, YStack } from 'tamagui'

import type { CategoryItem } from '../categories'

/** Một ô chuyên mục trong lưới. Bấm vào thì mở danh sách tin của chuyên mục đó */
export function CategoryTile({ category }: { category: CategoryItem }) {
  return (
    <YStack
      flex={1}
      h={110}
      p="4"
      rounded="4"
      justify="space-between"
      style={{ backgroundColor: category.color }}
      opacity="1 press:0.8"
      onPress={() => router.push(`/category/${category.slug}` as Href)}
      role="button"
      aria-label={category.name}
    >
      <Text fontSize="3xl">{category.icon}</Text>
      <Text fontSize="lg" fontWeight="700" color="white">
        {category.name}
      </Text>
    </YStack>
  )
}
