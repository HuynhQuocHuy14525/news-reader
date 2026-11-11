import { isAxiosError } from 'axios'

import type { ApiError } from '@/types/api'

/** Đổi lỗi khi gọi API thành câu tiếng Việt để hiện cho người dùng */
export function getErrorMessage(error: unknown) {
  if (isAxiosError<ApiError>(error)) {
    // Backend trả lỗi đúng dạng { error: { message } } (docs/api.md)
    const message = error.response?.data?.error?.message
    if (message) return message
    // Không có phản hồi: sai địa chỉ EXPO_PUBLIC_API_URL, backend chưa chạy, hoặc mất mạng
    if (!error.response) return 'Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.'
  }
  return 'Đã có lỗi xảy ra, vui lòng thử lại.'
}
