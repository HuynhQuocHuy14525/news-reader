import { useWindowDimensions } from 'react-native'

// Từ 768px trở lên (tablet, hoặc điện thoại xoay ngang) thì chia 2 cột danh sách | chi tiết
const TABLET_MIN_WIDTH = 768

export function useResponsive() {
  const { width, height } = useWindowDimensions()
  const isWide = width >= TABLET_MIN_WIDTH
  return {
    width,
    height,
    isLandscape: width > height,
    isWide,
    /** Độ rộng cột danh sách khi chia 2 cột: khoảng 40% màn hình, trong khoảng 340–440px */
    listWidth: Math.min(440, Math.max(340, Math.round(width * 0.4))),
  }
}
