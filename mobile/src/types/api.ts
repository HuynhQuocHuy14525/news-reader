/** Mọi lỗi từ backend đều có dạng này, kèm mã HTTP 4xx/5xx */
export interface ApiError {
  error: { message: string }
}
