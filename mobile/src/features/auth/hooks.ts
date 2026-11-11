import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useEffect } from 'react'

import type { AuthResponse } from '@/types/user'

import { getMe, login, register } from './api'
import { clearToken, saveToken, useToken } from './token-store'

const meKey = ['auth', 'me'] as const

/**
 * Trạng thái đăng nhập, dùng ở mọi nơi (docs/phan-cong.md: A dùng để biết đã đăng nhập chưa).
 * - isLoading: vừa mở app, đang đọc token / lấy thông tin tài khoản
 * - isLoggedIn: đã đăng nhập và lấy được user
 */
export function useAuth() {
  const token = useToken()
  const me = useQuery({
    queryKey: meKey,
    queryFn: getMe,
    enabled: !!token,
    staleTime: Infinity,
    retry: false,
  })

  // Token hết hạn hoặc tài khoản không còn: backend trả 401 thì tự đăng xuất
  const unauthorized = isAxiosError(me.error) && me.error.response?.status === 401
  useEffect(() => {
    if (unauthorized) clearToken()
  }, [unauthorized])

  const user = token ? (me.data ?? null) : null
  return {
    user,
    token: token ?? null,
    isLoggedIn: !!user,
    isLoading: token === undefined || (!!token && me.isPending),
  }
}

/** Lưu token + thông tin tài khoản sau khi đăng nhập / đăng ký thành công */
function useOnAuthSuccess() {
  const queryClient = useQueryClient()
  return async ({ token, user }: AuthResponse) => {
    queryClient.setQueryData(meKey, user)
    await saveToken(token)
  }
}

export function useLogin() {
  const onSuccess = useOnAuthSuccess()
  return useMutation({ mutationFn: login, onSuccess })
}

export function useRegister() {
  const onSuccess = useOnAuthSuccess()
  return useMutation({ mutationFn: register, onSuccess })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return async () => {
    await clearToken()
    queryClient.removeQueries({ queryKey: meKey })
  }
}
