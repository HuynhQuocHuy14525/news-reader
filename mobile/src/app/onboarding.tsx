import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, Text, XStack, YStack } from 'tamagui'

import type { CategorySlug } from '@/constants/categories'
import { CATEGORY_LIST } from '@/features/news/categories'
import { useInterests, useSaveInterests } from '@/features/news/interests'

const PRIMARY = '#0090FF'

const FEATURES = [
  { icon: '📰', text: 'Tin mới từ VnExpress, Tuổi Trẻ, Thanh Niên' },
  { icon: '✨', text: 'AI tóm tắt bài và trả lời câu hỏi' },
  { icon: '📱', text: 'Đọc thoải mái trên điện thoại lẫn tablet' },
]

// Màn hình #1 Giới thiệu & chọn chủ đề, tự mở ở lần đầu dùng app (xem (tabs)/index.tsx)
export default function OnboardingScreen() {
  const insets = useSafeAreaInsets()
  const { data: saved } = useInterests()
  const saveInterests = useSaveInterests()
  const [selected, setSelected] = useState<CategorySlug[]>([])

  // Mở lại màn này để sửa thì chọn sẵn các chủ đề đã lưu
  useEffect(() => {
    if (saved) setSelected(saved)
  }, [saved])

  const toggle = (slug: CategorySlug) =>
    setSelected((cur) => (cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug]))

  const finish = async (slugs: CategorySlug[]) => {
    await saveInterests.mutateAsync(slugs)
    router.replace('/')
  }

  return (
    <YStack flex={1} bg="background" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <ScrollView contentContainerStyle={{ padding: 24, gap: 24, maxWidth: 640, width: '100%', alignSelf: 'center' }}>
        <YStack gap="2" pt="4">
          <Text fontSize="5xl">📰</Text>
          <Text fontSize="4xl" fontWeight="800">
            News Reader
          </Text>
          <Text color="color-11">Đọc báo nhanh, gọn, ở một nơi.</Text>
        </YStack>

        <YStack gap="3">
          {FEATURES.map((f) => (
            <XStack key={f.text} gap="3" items="center">
              <Text fontSize="xl">{f.icon}</Text>
              <Text flex={1}>{f.text}</Text>
            </XStack>
          ))}
        </YStack>

        <YStack gap="3">
          <Text fontSize="xl" fontWeight="700">
            Bạn quan tâm chủ đề nào?
          </Text>
          <Text fontSize="sm" color="color-10">
            Chủ đề đã chọn hiện ngay đầu trang chủ. Chọn bao nhiêu cũng được.
          </Text>
          <XStack flexWrap="wrap" gap="2">
            {CATEGORY_LIST.map((c) => {
              const active = selected.includes(c.slug)
              return (
                <Text
                  key={c.slug}
                  px="4"
                  py="2"
                  rounded="full"
                  fontWeight="600"
                  color={active ? 'white' : 'color'}
                  bg={active ? undefined : 'color-3 press:color-5'}
                  style={active ? { backgroundColor: c.color } : undefined}
                  onPress={() => toggle(c.slug)}
                  role="checkbox"
                  aria-checked={active}
                >
                  {c.icon} {c.name}
                </Text>
              )
            })}
          </XStack>
        </YStack>
      </ScrollView>

      <XStack p="4" gap="3" borderTopWidth={1} borderColor="border-color">
        <Button flex={1} variant="outlined" onPress={() => finish([])} disabled={saveInterests.isPending}>
          Bỏ qua
        </Button>
        <Button
          flex={2}
          color="white"
          style={{ backgroundColor: PRIMARY }}
          onPress={() => finish(selected)}
          disabled={selected.length === 0 || saveInterests.isPending}
          opacity={selected.length === 0 ? 0.5 : 1}
        >
          {selected.length ? `Bắt đầu đọc (${selected.length})` : 'Chọn ít nhất 1 chủ đề'}
        </Button>
      </XStack>
    </YStack>
  )
}
