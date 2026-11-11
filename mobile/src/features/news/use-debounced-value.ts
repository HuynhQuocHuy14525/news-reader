import { useEffect, useState } from 'react'

/**
 * Trả về `value` sau khi nó ngừng thay đổi `delay` ms.
 * Dùng cho ô tìm kiếm: gõ "bong da" chỉ gọi API 1 lần thay vì 7 lần.
 */
export function useDebouncedValue<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    // Gõ tiếp trước khi hết giờ thì hủy hẹn giờ cũ
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}
