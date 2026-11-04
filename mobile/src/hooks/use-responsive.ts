import { useWindowDimensions } from 'react-native'

// Từ 768px trở lên (tablet, hoặc điện thoại xoay ngang) thì chia 2 cột danh sách | chi tiết
const TABLET_MIN_WIDTH = 768

export function useResponsive() {
  const { width, height } = useWindowDimensions()
  return {
    width,
    height,
    isLandscape: width > height,
    isWide: width >= TABLET_MIN_WIDTH,
  }
}
