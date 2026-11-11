import { useEffect, useState } from 'react'
import { Platform, useWindowDimensions } from 'react-native'

// Từ 768px trở lên (tablet, hoặc điện thoại xoay ngang) thì chia 2 cột danh sách | chi tiết
const TABLET_MIN_WIDTH = 768

/**
 * Bản web dựng HTML sẵn trên máy chủ, lúc đó chưa biết màn hình rộng bao nhiêu.
 * Lần vẽ đầu trên web phải giống máy chủ (coi như màn hẹp), vẽ xong mới dùng độ rộng thật,
 * nếu không React báo lỗi "Hydration failed". Trên điện thoại không có bước này.
 */
function useIsMounted() {
  const [mounted, setMounted] = useState(Platform.OS !== 'web')
  useEffect(() => setMounted(true), [])
  return mounted
}

export function useResponsive() {
  const { width, height } = useWindowDimensions()
  const mounted = useIsMounted()
  const isWide = mounted && width >= TABLET_MIN_WIDTH
  return {
    width,
    height,
    isLandscape: width > height,
    isWide,
    /** Độ rộng cột danh sách khi chia 2 cột: khoảng 40% màn hình, trong khoảng 340–440px */
    listWidth: Math.min(440, Math.max(340, Math.round(width * 0.4))),
  }
}
