import { router, type Href } from 'expo-router'
import { ScrollView } from 'react-native'
import { Text } from 'tamagui'

import type { CategorySlug } from '@/constants/categories'

import { findCategory } from '../categories'

interface InterestChipsProps {
  interests: CategorySlug[]
  /** undefined = "Tất cả" */
  value: CategorySlug | undefined
  onChange: (slug: CategorySlug | undefined) => void
}

/** Hàng nút cuộn ngang trên trang chủ: Tất cả + các chủ đề quan tâm + nút sửa */
export function InterestChips({ interests, value, onChange }: InterestChipsProps) {
  const chips = [undefined, ...interests]
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
      {chips.map((slug) => {
        const category = findCategory(slug)
        const active = slug === value
        return (
          <Text
            key={slug ?? 'all'}
            px="3"
            py="1.5"
            rounded="full"
            fontSize="sm"
            fontWeight="600"
            color={active ? 'white' : 'color'}
            bg={active ? undefined : 'color-3 press:color-5'}
            style={active ? { backgroundColor: category?.color ?? '#0090FF' } : undefined}
            onPress={() => onChange(slug)}
            role="tab"
            aria-selected={active}
          >
            {category ? `${category.icon} ${category.name}` : 'Tất cả'}
          </Text>
        )
      })}
      <Text
        px="3"
        py="1.5"
        rounded="full"
        fontSize="sm"
        color="color-10"
        borderWidth={1}
        borderColor="border-color"
        onPress={() => router.push('/onboarding' as Href)}
        role="button"
      >
        {interests.length ? '✎ Sửa' : '＋ Chọn chủ đề'}
      </Text>
    </ScrollView>
  )
}
