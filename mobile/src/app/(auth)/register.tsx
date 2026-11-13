import { router, type Href } from 'expo-router'
import { useState } from 'react'
import { Text } from 'tamagui'

import { AuthLayout, FormError, FormField, SubmitButton } from '@/features/auth/components/AuthLayout'
import { useRegister } from '@/features/auth/hooks'
import { getErrorMessage } from '@/features/news/errors'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 6

/** Kiểm tra nhanh trên máy trước khi gửi (backend vẫn kiểm tra lại), trả về câu lỗi hoặc null */
function validate(name: string, email: string, password: string, confirm: string) {
  if (!name) return 'Vui lòng nhập họ tên'
  if (!EMAIL_PATTERN.test(email)) return 'Email không hợp lệ'
  if (password.length < MIN_PASSWORD_LENGTH) return `Mật khẩu phải có ít nhất ${MIN_PASSWORD_LENGTH} ký tự`
  if (password !== confirm) return 'Mật khẩu nhập lại không khớp'
  return null
}

// Màn hình #3 Đăng ký
export default function RegisterScreen() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const register = useRegister()

  const submit = () => {
    const error = validate(name.trim(), email.trim(), password, confirm)
    setFormError(error)
    if (error) return
    register.mutate(
      { name: name.trim(), email: email.trim(), password },
      // Đăng ký xong là đã đăng nhập luôn, quay lại màn trước
      { onSuccess: () => (router.canGoBack() ? router.back() : router.replace('/profile' as Href)) },
    )
  }

  return (
    <AuthLayout title="Đăng ký" subtitle="Tạo tài khoản miễn phí để lưu bài viết yêu thích.">
      <FormField
        label="Họ tên"
        value={name}
        onChangeText={setName}
        placeholder="Nguyễn Văn A"
        autoComplete="name"
        textContentType="name"
        returnKeyType="next"
      />
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
        placeholder={`Ít nhất ${MIN_PASSWORD_LENGTH} ký tự`}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="next"
      />
      <FormField
        label="Nhập lại mật khẩu"
        value={confirm}
        onChangeText={setConfirm}
        placeholder="Nhập lại mật khẩu"
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="done"
        onSubmitEditing={submit}
      />
      <FormError message={formError ?? (register.error ? getErrorMessage(register.error) : null)} />
      <SubmitButton loading={register.isPending} onPress={submit}>
        Tạo tài khoản
      </SubmitButton>
      <Text text="center" color="color-11" onPress={() => router.replace('/login' as Href)}>
        Đã có tài khoản?{' '}
        <Text color="#0090FF" fontWeight="600">
          Đăng nhập
        </Text>
      </Text>
    </AuthLayout>
  )
}
