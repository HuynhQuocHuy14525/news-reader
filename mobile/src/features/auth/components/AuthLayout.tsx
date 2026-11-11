import type { ReactNode } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { Button, Input, type InputProps, Spinner, Text, YStack } from 'tamagui'

import { ScreenHeader } from '@/features/news/components/ScreenHeader'

const PRIMARY = '#0090FF'

/** Khung chung của màn đăng nhập / đăng ký: tiêu đề có nút quay lại, bàn phím không che ô nhập */
export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <YStack flex={1} bg="background">
      <ScreenHeader title={title} showBack />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 16, gap: 16, maxWidth: 480, width: '100%', alignSelf: 'center' }}
        >
          <Text color="color-11">{subtitle}</Text>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </YStack>
  )
}

/** Ô nhập có nhãn phía trên */
export function FormField({ label, ...props }: InputProps & { label: string }) {
  return (
    <YStack gap="1.5">
      <Text fontSize="sm" fontWeight="600">
        {label}
      </Text>
      <Input aria-label={label} autoCorrect={false} {...props} />
    </YStack>
  )
}

/** Dòng báo lỗi màu đỏ, không có lỗi thì không hiện gì */
export function FormError({ message }: { message?: string | null }) {
  if (!message) return null
  return (
    <Text color="red" role="alert">
      {message}
    </Text>
  )
}

/** Nút chính, đang gửi thì hiện vòng xoay và không bấm được */
export function SubmitButton({ loading, onPress, children }: { loading: boolean; onPress: () => void; children: string }) {
  return (
    <Button
      color="white"
      style={{ backgroundColor: PRIMARY }}
      onPress={onPress}
      disabled={loading}
      opacity={loading ? 0.6 : 1}
      icon={loading ? <Spinner color="white" /> : undefined}
    >
      {children}
    </Button>
  )
}
