import { router, type Href } from 'expo-router'
import { useState } from 'react'
import { Text } from 'tamagui'

import { AuthLayout, FormError, FormField, SubmitButton } from '@/features/auth/components/AuthLayout'
import { useLogin } from '@/features/auth/hooks'
import { getErrorMessage } from '@/features/news/errors'

// Màn hình #2 Đăng nhập
export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const login = useLogin()

  const submit = () => {
    if (!email.trim() || !password) return setFormError('Vui lòng nhập email và mật khẩu')
    setFormError(null)
    login.mutate(
      { email: email.trim(), password },
      // Đăng nhập xong quay lại màn trước (thường là tab Cá nhân)
      { onSuccess: () => (router.canGoBack() ? router.back() : router.replace('/profile' as Href)) },
    )
  }

  return (
    <AuthLayout title="Đăng nhập" subtitle="Đăng nhập để lưu bài và đọc lại trên mọi thiết bị.">
      <FormField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="ban@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
      />
      <FormField
        label="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        placeholder="Mật khẩu"
        secureTextEntry
        autoCapitalize="none"
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="done"
        onSubmitEditing={submit}
      />
      <FormError message={formError ?? (login.error ? getErrorMessage(login.error) : null)} />
      <SubmitButton loading={login.isPending} onPress={submit}>
        Đăng nhập
      </SubmitButton>
      <Text text="center" color="color-11" onPress={() => router.replace('/register' as Href)}>
        Chưa có tài khoản?{' '}
        <Text color="#0090FF" fontWeight="600">
          Đăng ký
        </Text>
      </Text>
    </AuthLayout>
  )
}
