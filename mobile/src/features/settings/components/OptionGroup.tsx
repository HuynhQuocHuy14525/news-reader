import { Text, XStack, YStack } from 'tamagui'

const PRIMARY = '#0090FF'

interface OptionGroupProps<T extends string> {
  title: string
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}

/** Nhóm nút chọn 1 trong nhiều (giống radio), nút đang chọn tô màu xanh */
export function OptionGroup<T extends string>({ title, options, value, onChange }: OptionGroupProps<T>) {
  return (
    <YStack gap="2">
      <Text fontSize="sm" fontWeight="700" color="color-11" textTransform="uppercase">
        {title}
      </Text>
      <XStack gap="2" flexWrap="wrap" role="radiogroup" aria-label={title}>
        {options.map((option) => {
          const active = option.value === value
          return (
            <Text
              key={option.value}
              px="4"
              py="2.5"
              rounded="full"
              fontWeight="600"
              color={active ? 'white' : 'color'}
              bg={active ? undefined : 'color-3 press:color-5'}
              style={active ? { backgroundColor: PRIMARY } : undefined}
              onPress={() => onChange(option.value)}
              role="radio"
              aria-checked={active}
            >
              {option.label}
            </Text>
          )
        })}
      </XStack>
    </YStack>
  )
}
