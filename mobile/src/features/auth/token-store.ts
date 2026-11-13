import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import { useSyncExternalStore } from 'react'
import { Platform } from 'react-native'

import { setAuthToken } from '@/services/api-client'

// Lưu token trên máy để mở lại app vẫn còn đăng nhập.
// Điện thoại: SecureStore (Keychain / Keystore, được mã hóa). Web không có SecureStore nên dùng AsyncStorage.
const STORAGE_KEY = 'news-reader.auth-token'

const storage =
  Platform.OS === 'web'
    ? {
        get: () => AsyncStorage.getItem(STORAGE_KEY),
        set: (value: string) => AsyncStorage.setItem(STORAGE_KEY, value),
        remove: () => AsyncStorage.removeItem(STORAGE_KEY),
      }
    : {
        get: () => SecureStore.getItemAsync(STORAGE_KEY),
        set: (value: string) => SecureStore.setItemAsync(STORAGE_KEY, value),
        remove: () => SecureStore.deleteItemAsync(STORAGE_KEY),
      }

/** undefined = đang đọc từ máy (vừa mở app), null = chưa đăng nhập */
let currentToken: string | null | undefined
const listeners = new Set<() => void>()

function setCurrent(token: string | null) {
  currentToken = token
  setAuthToken(token)
  listeners.forEach((notify) => notify())
}

// Đọc token đã lưu ngay khi app khởi động
storage
  .get()
  .catch(() => null)
  .then((token) => {
    // Nếu trong lúc đọc người dùng đã đăng nhập thì giữ token mới
    if (currentToken === undefined) setCurrent(token)
  })

export async function saveToken(token: string) {
  setCurrent(token)
  await storage.set(token)
}

export async function clearToken() {
  setCurrent(null)
  await storage.remove()
}

/** Token hiện tại; component tự vẽ lại khi đăng nhập / đăng xuất */
export function useToken() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => currentToken,
  )
}
