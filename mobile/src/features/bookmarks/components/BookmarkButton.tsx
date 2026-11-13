import { router, type Href } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import { Button, YStack, useTheme } from 'tamagui'

import { useAuth } from '@/features/auth/hooks'
import type { Article } from '@/types/article'

import { useIsBookmarked, useToggleBookmark } from '../hooks'

const PRIMARY = '#0090FF'

interface BookmarkButtonProps {
  article: Article
  /** true: chỉ hiện icon tròn nhỏ (dùng trong danh sách). Mặc định: nút có chữ (màn chi tiết bài) */
  compact?: boolean
}

/** Nút lưu / bỏ lưu bài. Chưa đăng nhập thì mở màn Đăng nhập */
export function BookmarkButton({ article, compact }: BookmarkButtonProps) {
  const theme = useTheme()
  const { isLoggedIn } = useAuth()
  const saved = useIsBookmarked(article.id)
  const toggle = useToggleBookmark()

  const onPress = () => {
    if (!isLoggedIn) return router.push('/login' as Href)
    toggle.mutate({ article, saved })
  }

  const icon = (
    <SymbolView
      name={saved ? { ios: 'bookmark.fill', android: 'bookmark' } : { ios: 'bookmark', android: 'bookmark_border' }}
      tintColor={saved ? PRIMARY : theme.color.val}
      size={compact ? 22 : 20}
    />
  )
  const label = saved ? 'Bỏ lưu bài' : 'Lưu bài'

  if (compact) {
    return (
      <YStack
        w="11"
        h="11"
        rounded="full"
        items="center"
        justify="center"
        bg="transparent press:background-press"
        onPress={onPress}
        role="button"
        aria-label={label}
        aria-pressed={saved}
      >
        {icon}
      </YStack>
    )
  }

  return (
    <Button variant="outlined" icon={icon} onPress={onPress} aria-label={label} aria-pressed={saved}>
      {saved ? 'Đã lưu' : 'Lưu bài'}
    </Button>
  )
}
