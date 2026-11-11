import { useLocalSearchParams } from 'expo-router'
import { Share } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text, XStack, YStack } from 'tamagui'

import { ArticleDetailView } from '@/features/news/components/ArticleDetailView'
import { BackButton } from '@/features/news/components/BackButton'
import { useArticle } from '@/features/news/hooks'

// Màn hình #8 Chi tiết bài viết, ví dụ /article/8906ebff3746
export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const insets = useSafeAreaInsets()
  // Cùng key cache với ArticleDetailView nên không gọi API 2 lần
  const { data: article } = useArticle(id)

  const share = () => {
    if (article) Share.share({ message: `${article.title}\n${article.url}` })
  }

  return (
    <YStack flex={1} bg="background">
      <XStack
        px="2"
        pb="1"
        items="center"
        justify="space-between"
        borderBottomWidth={1}
        borderColor="border-color"
        style={{ paddingTop: insets.top + 4 }}
      >
        <BackButton />
        <Text fontWeight="600" color="color-10" numberOfLines={1} flex={1} text="center">
          {article?.sourceName ?? ''}
        </Text>
        <Text px="3" py="2" fontSize="lg" onPress={share} role="button" aria-label="Chia sẻ" opacity={article ? 1 : 0}>
          ⤴
        </Text>
      </XStack>
      <ArticleDetailView id={id} />
    </YStack>
  )
}
