// Danh sách chuyên mục dùng chung cho app và backend (backend giữ bản sao cùng slug)
export const CATEGORIES = [
  { slug: 'thoi-su', name: 'Thời sự' },
  { slug: 'the-gioi', name: 'Thế giới' },
  { slug: 'kinh-doanh', name: 'Kinh doanh' },
  { slug: 'cong-nghe', name: 'Công nghệ' },
  { slug: 'the-thao', name: 'Thể thao' },
  { slug: 'giai-tri', name: 'Giải trí' },
  { slug: 'suc-khoe', name: 'Sức khỏe' },
  { slug: 'giao-duc', name: 'Giáo dục' },
] as const

export type CategorySlug = (typeof CATEGORIES)[number]['slug']
