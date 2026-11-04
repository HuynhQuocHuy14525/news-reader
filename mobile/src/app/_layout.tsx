import { QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { useColorScheme } from 'react-native'
import { TamaguiProvider } from 'tamagui'

import { queryClient } from '@/services/query-client'
import tamaguiConfig from '../../tamagui.config'

export default function RootLayout() {
  const colorScheme = useColorScheme()
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme === 'dark' ? 'dark' : 'light'}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }} />
      </QueryClientProvider>
    </TamaguiProvider>
  )
}
