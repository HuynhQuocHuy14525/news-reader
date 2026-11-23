import AsyncStorage from '@react-native-async-storage/async-storage'
import { useSyncExternalStore } from 'react'
import { useColorScheme } from 'react-native'

// Cài đặt giao diện lưu ngay trên máy (AsyncStorage), không cần đăng nhập.
// Không dùng TanStack Query vì app/_layout.tsx đọc giao diện ở ngoài QueryClientProvider.
const STORAGE_KEY = 'news-reader:settings'

export type ThemeSetting = 'system' | 'light' | 'dark'
export type FontSizeSetting = 'small' | 'medium' | 'large' | 'xlarge'

export interface Settings {
  theme: ThemeSetting
  fontSize: FontSizeSetting
}

/** Cỡ chữ nội dung bài (px) theo từng mức. Mặc định 17, bằng cỡ chữ cũ của màn chi tiết bài */
export const FONT_SIZES: Record<FontSizeSetting, number> = {
  small: 15,
  medium: 17,
  large: 20,
  xlarge: 23,
}

const DEFAULT_SETTINGS: Settings = { theme: 'system', fontSize: 'medium' }

let current: Settings = DEFAULT_SETTINGS
/** true khi người dùng đã đổi cài đặt trước lúc đọc xong từ máy, khi đó giữ lựa chọn mới */
let changedBeforeLoad = false
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((notify) => notify())
}

/** Chỉ nhận giá trị hợp lệ, dữ liệu cũ hỏng thì dùng mặc định */
function parse(raw: string | null): Settings {
  try {
    const saved = raw ? JSON.parse(raw) : {}
    return {
      theme: ['system', 'light', 'dark'].includes(saved.theme) ? saved.theme : DEFAULT_SETTINGS.theme,
      fontSize: saved.fontSize in FONT_SIZES ? saved.fontSize : DEFAULT_SETTINGS.fontSize,
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

// Đọc cài đặt đã lưu ngay khi app khởi động
AsyncStorage.getItem(STORAGE_KEY)
  .then((raw) => {
    if (changedBeforeLoad) return
    current = parse(raw)
    emit()
  })
  .catch(() => {})

/** Đổi một hoặc nhiều cài đặt: giao diện đổi ngay, rồi ghi xuống máy */
export function updateSettings(change: Partial<Settings>) {
  changedBeforeLoad = true
  current = { ...current, ...change }
  emit()
  return AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(current))
}

/** Cài đặt hiện tại; component tự vẽ lại khi người dùng đổi */
export function useSettings() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => current,
  )
}

/** Cỡ chữ nội dung bài (số px). Phần A dùng ở màn chi tiết bài (docs/phan-cong.md) */
export function useFontSize() {
  return FONT_SIZES[useSettings().fontSize]
}

/** Giao diện thật sự dùng: chọn "Theo máy" thì lấy theo cài đặt sáng/tối của điện thoại */
export function useAppTheme(): 'light' | 'dark' {
  const { theme } = useSettings()
  const system = useColorScheme()
  if (theme === 'system') return system === 'dark' ? 'dark' : 'light'
  return theme
}
