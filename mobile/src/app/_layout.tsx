import { QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { TamaguiProvider } from 'tamagui'

import { useAppTheme } from '@/features/settings/settings-store'
import { queryClient } from '@/services/query-client'
import tamaguiConfig from '../../tamagui.config'

export default function RootLayout() {
  // Sáng / tối theo lựa chọn trong màn Cài đặt (mặc định: theo máy)
  const theme = useAppTheme()
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={theme}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }} />
      </QueryClientProvider>
    </TamaguiProvider>
  )
}
