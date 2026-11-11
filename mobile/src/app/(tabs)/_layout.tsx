import { Tabs } from 'expo-router'
import { SymbolView, type SymbolViewProps } from 'expo-symbols'
import type { ColorValue } from 'react-native'
import { useTheme } from 'tamagui'

// Vẽ icon cho tab. name có 2 tên: iOS dùng SF Symbols, Android dùng Material Symbols.
// color và size do Tabs truyền vào (tab đang chọn có màu khác)
function tabIcon(name: SymbolViewProps['name']) {
  return ({ color, size }: { color: ColorValue; size: number }) => (
    <SymbolView name={name} tintColor={color} size={size} />
  )
}

// Thanh tab dưới cùng: 5 tab theo đúng thứ tự trong docs/phan-cong.md
export default function TabsLayout() {
  // Lấy màu từ theme Tamagui để thanh tab đổi theo giao diện sáng/tối
  const theme = useTheme()
  return (
    <Tabs
      screenOptions={{
        // Các màn hình tự vẽ tiêu đề nên tắt tiêu đề mặc định của Tabs
        headerShown: false,
        tabBarActiveTintColor: theme.color.val,
        tabBarInactiveTintColor: theme['color-10'].val,
        tabBarStyle: { backgroundColor: theme.background.val, borderTopColor: theme['color-4'].val },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Trang chủ', tabBarIcon: tabIcon({ ios: 'house.fill', android: 'home' }) }}
      />
      <Tabs.Screen
        name="categories"
        options={{ title: 'Chuyên mục', tabBarIcon: tabIcon({ ios: 'square.grid.2x2.fill', android: 'grid_view' }) }}
      />
      <Tabs.Screen
        name="search"
        options={{ title: 'Tìm kiếm', tabBarIcon: tabIcon({ ios: 'magnifyingglass', android: 'search' }) }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{ title: 'Đã lưu', tabBarIcon: tabIcon({ ios: 'bookmark.fill', android: 'bookmark' }) }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Cá nhân', tabBarIcon: tabIcon({ ios: 'person.fill', android: 'person' }) }}
      />
    </Tabs>
  )
}
