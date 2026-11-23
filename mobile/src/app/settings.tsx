import { ScrollView } from 'react-native'
import { Text, YStack } from 'tamagui'

import { ScreenHeader } from '@/features/news/components/ScreenHeader'
import { OptionGroup } from '@/features/settings/components/OptionGroup'
import {
  type FontSizeSetting,
  type ThemeSetting,
  updateSettings,
  useFontSize,
  useSettings,
} from '@/features/settings/settings-store'

const THEME_OPTIONS: { value: ThemeSetting; label: string }[] = [
  { value: 'system', label: '📱 Theo máy' },
  { value: 'light', label: '☀️ Sáng' },
  { value: 'dark', label: '🌙 Tối' },
]

const FONT_SIZE_OPTIONS: { value: FontSizeSetting; label: string }[] = [
  { value: 'small', label: 'Nhỏ' },
  { value: 'medium', label: 'Vừa' },
  { value: 'large', label: 'Lớn' },
  { value: 'xlarge', label: 'Rất lớn' },
]

// Màn hình #13 Cài đặt (mở từ tab Cá nhân). Đổi là áp dụng ngay, tự lưu trên máy
export default function SettingsScreen() {
  const settings = useSettings()
  const fontSize = useFontSize()

  return (
    <YStack flex={1} bg="background">
      <ScreenHeader title="Cài đặt" showBack />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 28, maxWidth: 560, width: '100%', alignSelf: 'center' }}>
        <OptionGroup
          title="Giao diện"
          options={THEME_OPTIONS}
          value={settings.theme}
          onChange={(theme) => updateSettings({ theme })}
        />

        <OptionGroup
          title="Cỡ chữ bài viết"
          options={FONT_SIZE_OPTIONS}
          value={settings.fontSize}
          onChange={(size) => updateSettings({ fontSize: size })}
        />

        {/* Xem trước cỡ chữ ngay khi chọn */}
        <YStack gap="2" p="4" rounded="4" bg="color-2" borderWidth={1} borderColor="border-color">
          <Text fontSize="xs" color="color-10" textTransform="uppercase">
            Xem trước
          </Text>
          <Text style={{ fontSize, lineHeight: Math.round(fontSize * 1.6) }}>
            Đọc báo nhanh, gọn, ở một nơi. Cỡ chữ này sẽ dùng cho nội dung bài viết.
          </Text>
        </YStack>
      </ScrollView>
    </YStack>
  )
}
