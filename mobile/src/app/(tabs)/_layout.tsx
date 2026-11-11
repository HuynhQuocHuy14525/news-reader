import { Tabs } from 'expo-router'

// Thanh tab dưới cùng: 5 tab theo đúng thứ tự trong docs/phan-cong.md
export default function TabsLayout() {
  return (
    // Các màn hình tự vẽ tiêu đề nên tắt tiêu đề mặc định của Tabs
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Trang chủ' }} />
      <Tabs.Screen name="categories" options={{ title: 'Chuyên mục' }} />
      <Tabs.Screen name="search" options={{ title: 'Tìm kiếm' }} />
      <Tabs.Screen name="bookmarks" options={{ title: 'Đã lưu' }} />
      <Tabs.Screen name="profile" options={{ title: 'Cá nhân' }} />
    </Tabs>
  )
}
