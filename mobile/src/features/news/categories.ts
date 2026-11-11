import { CATEGORIES, type CategorySlug } from '@/constants/categories'

// Biểu tượng và màu riêng của từng chuyên mục, chỉ dùng cho giao diện phần tin tức
const CATEGORY_STYLE: Record<CategorySlug, { icon: string; color: string }> = {
  'thoi-su': { icon: '📰', color: '#E5484D' },
  'the-gioi': { icon: '🌏', color: '#0090FF' },
  'kinh-doanh': { icon: '💼', color: '#F76B15' },
  'cong-nghe': { icon: '💻', color: '#8E4EC6' },
  'the-thao': { icon: '⚽', color: '#30A46C' },
  'giai-tri': { icon: '🎬', color: '#D6409F' },
  'suc-khoe': { icon: '🩺', color: '#12A594' },
  'giao-duc': { icon: '🎓', color: '#3E63DD' },
}

export const CATEGORY_LIST = CATEGORIES.map((c) => ({ ...c, ...CATEGORY_STYLE[c.slug] }))

export type CategoryItem = (typeof CATEGORY_LIST)[number]

/** Tìm chuyên mục theo slug trên đường dẫn, slug lạ thì trả về undefined */
export function findCategory(slug: string | undefined) {
  return CATEGORY_LIST.find((c) => c.slug === slug)
}
