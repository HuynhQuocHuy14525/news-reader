import { createHash } from 'node:crypto'

import * as cheerio from 'cheerio'
import { XMLParser } from 'fast-xml-parser'

// Bản sao slug của mobile/src/constants/categories.ts. Thêm chuyên mục thì sửa cả 2 nơi.
export const CATEGORY_SLUGS = [
  'thoi-su',
  'the-gioi',
  'kinh-doanh',
  'cong-nghe',
  'the-thao',
  'giai-tri',
  'suc-khoe',
  'giao-duc',
]

// Tuổi Trẻ và Thanh Niên dùng chung giao diện. '>' chỉ lấy đoạn văn trực tiếp trong bài,
// ảnh nằm trong <figure> hoặc khung div.VCSortableInPreviewMode (ảnh kèm chữ bên cạnh)
const TUOITRE_THANHNIEN_BLOCKS = [
  '[data-role="content"] > p',
  '[data-role="content"] > h2',
  '[data-role="content"] > h3',
  '[data-role="content"] figure',
  '[data-role="content"] > div.VCSortableInPreviewMode',
].join(', ')

// Mỗi báo đặt tên file RSS khác nhau, nên map slug chung -> tên file của báo đó
const SOURCES = [
  {
    id: 'vnexpress',
    name: 'VnExpress',
    rssBase: 'https://vnexpress.net/rss/',
    feeds: { 'cong-nghe': 'so-hoa' },
    // Các khối nội dung trên trang bài gốc (đoạn văn, tiêu đề phụ, ảnh), dùng cho /news/:id.
    // VnExpress ghi chú thích ảnh bằng p.Image nên lấy mọi p.Normal (kể cả trong bài ảnh)
    blockSelector: '.fck_detail p.Normal, .fck_detail h2, .fck_detail h3, .fck_detail figure',
  },
  {
    id: 'tuoitre',
    name: 'Tuổi Trẻ',
    rssBase: 'https://tuoitre.vn/rss/',
    feeds: { 'cong-nghe': 'nhip-song-so' },
    blockSelector: TUOITRE_THANHNIEN_BLOCKS,
  },
  {
    id: 'thanhnien',
    name: 'Thanh Niên',
    rssBase: 'https://thanhnien.vn/rss/',
    feeds: { 'kinh-doanh': 'kinh-te' },
    blockSelector: TUOITRE_THANHNIEN_BLOCKS,
  },
]

// Đọc lại RSS sau 5 phút, trong lúc đó dùng bản đã lưu để trả lời nhanh
const CACHE_TTL_MS = 5 * 60 * 1000
const FETCH_TIMEOUT_MS = 10 * 1000
const USER_AGENT = 'Mozilla/5.0 (NewsReader student project)'

const xmlParser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' })

/** key `${source}:${category}` -> { at, articles } */
const feedCache = new Map()
/** id -> Article, để /news/:id tìm lại được link bài gốc */
const articleById = new Map()
/** id -> ArticleDetail. Nội dung bài ít khi đổi nên giữ luôn, không hết hạn */
const detailById = new Map()

export async function fetchText(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  })
  if (!res.ok) throw new Error(`${url} trả về ${res.status}`)
  return res.text()
}

/** id ngắn, cố định theo link bài: cùng một bài luôn ra cùng id */
function makeId(url) {
  return createHash('sha1').update(url).digest('hex').slice(0, 12)
}

/** Bỏ thẻ HTML và giải mã ký tự như &ugrave; (Thanh Niên hay dùng) */
function toPlainText(html) {
  if (!html) return ''
  return cheerio.load(String(html), null, false).text().replace(/\s+/g, ' ').trim()
}

/**
 * Các báo ghi ngày theo nhiều kiểu:
 * - VnExpress: "Wed, 11 Nov 2026 15:36:45 +0700"
 * - Thanh Niên: "Wed, 11 Nov 26 19:18:06 +0700" (năm 2 chữ số, Node vẫn hiểu)
 * - Tuổi Trẻ: "11/10/2026 8:16:00 PM" (tháng/ngày/năm, giờ Việt Nam, không ghi múi giờ)
 */
function parseDate(value) {
  const str = String(value ?? '').trim()
  // \s+ vì Tuổi Trẻ dùng ký tự khoảng trắng hẹp (U+202F) trước AM/PM, không phải dấu cách thường
  const m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})\s+(AM|PM)$/i)
  if (m) {
    const [, month, day, year, hour, minute, second, ampm] = m
    let h = Number(hour) % 12
    if (ampm.toUpperCase() === 'PM') h += 12
    const pad = (n) => String(n).padStart(2, '0')
    // Ghi rõ +07:00 để server chạy múi giờ nào (Render dùng UTC) cũng ra đúng
    const iso = `${year}-${pad(month)}-${pad(day)}T${pad(h)}:${minute}:${second}+07:00`
    return new Date(iso).toISOString()
  }
  const date = new Date(str)
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString()
}

function findImage(item) {
  if (item.enclosure?.url) return item.enclosure.url
  const media = item['media:content'] ?? item['media:thumbnail']
  if (media?.url) return media.url
  // VnExpress để ảnh trong <img> của phần mô tả
  const match = String(item.description ?? '').match(/<img[^>]+src="([^"]+)"/)
  return match ? match[1] : null
}

function toArticle(item, source, category) {
  const url = toPlainText(item.link)
  return {
    id: makeId(url),
    title: toPlainText(item.title),
    summary: toPlainText(item.description),
    url,
    imageUrl: findImage(item),
    source: source.id,
    sourceName: source.name,
    category,
    publishedAt: parseDate(item.pubDate),
  }
}

async function loadFeed(source, category) {
  const key = `${source.id}:${category}`
  const cached = feedCache.get(key)
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.articles

  const file = source.feeds[category] ?? category
  const xml = await fetchText(`${source.rssBase}${file}.rss`)
  const items = xmlParser.parse(xml)?.rss?.channel?.item ?? []
  const articles = (Array.isArray(items) ? items : [items])
    .map((item) => toArticle(item, source, category))
    .filter((a) => a.url && a.title)

  for (const a of articles) articleById.set(a.id, a)
  feedCache.set(key, { at: Date.now(), articles })
  return articles
}

/**
 * Lấy tin của một chuyên mục (hoặc tất cả nếu không truyền), mới nhất trước.
 * Một báo bị lỗi thì bỏ qua báo đó, vẫn trả tin của các báo còn lại.
 */
export async function getArticles(category) {
  const categories = category ? [category] : CATEGORY_SLUGS
  const jobs = SOURCES.flatMap((source) => categories.map((c) => loadFeed(source, c)))
  const results = await Promise.allSettled(jobs)

  const failed = results.filter((r) => r.status === 'rejected')
  failed.forEach((r) => console.warn('[rss]', r.reason?.message))
  if (failed.length === results.length) throw new Error('Không đọc được nguồn RSS nào')

  // Một bài có thể nằm ở nhiều chuyên mục, chỉ giữ một lần
  const seen = new Set()
  return results
    .flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
    .filter((a) => !seen.has(a.id) && seen.add(a.id))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

/**
 * "Bóng Đá, U23!" -> " bong da u23 ": bỏ dấu, chữ thường, dấu câu thành khoảng trắng.
 * Thêm khoảng trắng 2 đầu để so khớp nguyên từ.
 */
function normalize(text) {
  const plain = text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
  return ` ${plain} `
}

/** Tìm bài có cả cụm từ khóa (nguyên từ, không phân biệt dấu) trong tiêu đề hoặc mô tả */
export async function searchArticles(q) {
  const phrase = normalize(q)
  if (!phrase.trim()) return []
  const articles = await getArticles()
  return articles.filter((a) => normalize(`${a.title} ${a.summary}`).includes(phrase))
}

const cleanText = (text) => text.replace(/\s+/g, ' ').trim()

/** Link ảnh thật: báo hay để ảnh mờ dạng data: trong src và link thật trong data-src (tải chậm) */
function imageSrc(img) {
  const src = img.attr('src') ?? ''
  return src.startsWith('http') ? src : (img.attr('data-src') ?? null)
}

/**
 * Đọc trang bài gốc thành danh sách khối theo đúng thứ tự trong bài:
 * đoạn văn, tiêu đề phụ, ảnh kèm chú thích.
 */
function extractBlocks($, selector) {
  const blocks = []
  const seenImages = new Set()

  $(selector).each((_, el) => {
    const $el = $(el)
    const tag = el.tagName

    if (tag === 'h2' || tag === 'h3') {
      const text = cleanText($el.text())
      if (text) blocks.push({ type: 'heading', text })
      return
    }

    if (tag === 'p') {
      // Đoạn chú thích nằm trong khung ảnh thì đã lấy cùng ảnh rồi
      if ($el.closest('figure').length) return
      const text = cleanText($el.text())
      if (text) blocks.push({ type: 'paragraph', text })
      return
    }

    // Còn lại là khung ảnh (figure hoặc div chứa ảnh)
    const img = $el.find('img').first()
    const url = img.length ? imageSrc(img) : null
    if (!url || seenImages.has(url)) return
    seenImages.add(url)

    // Ảnh đầu bài thường trùng ảnh bìa lấy từ RSS (app đã hiện ở trên cùng) nên bỏ qua
    if (blocks.length === 0) return

    const caption = cleanText($el.find('figcaption').text() || $el.find('p').text())
    // Tuổi Trẻ, Thanh Niên ghi kích thước gốc trong thuộc tính w, h
    const w = Number(img.attr('w') ?? img.attr('width'))
    const h = Number(img.attr('h') ?? img.attr('height'))
    blocks.push({
      type: 'image',
      url,
      caption: caption || null,
      aspectRatio: w > 0 && h > 0 ? Math.round((w / h) * 1000) / 1000 : null,
    })
  })

  return blocks
}

/**
 * Lấy bài đầy đủ (ArticleDetail) theo id: tìm link gốc rồi tải trang báo để lấy nội dung.
 * Trả về null nếu không có bài nào mang id này.
 * Phần AI (ai.service) cũng dùng hàm này để lấy nội dung bài.
 */
export async function getArticleDetail(id) {
  if (detailById.has(id)) return detailById.get(id)

  // Server vừa khởi động thì chưa có bài nào trong bộ nhớ, đọc RSS trước
  if (!articleById.has(id)) await getArticles()
  const article = articleById.get(id)
  if (!article) return null

  const source = SOURCES.find((s) => s.id === article.source)
  let blocks = []
  try {
    const $ = cheerio.load(await fetchText(article.url))
    blocks = extractBlocks($, source.blockSelector)
  } catch (err) {
    console.warn('[rss] không tải được bài gốc', article.url, err.message)
  }

  // content giữ dạng chữ thường (phần AI dùng), blocks để app vẽ bài giống trang báo
  const content = blocks
    .filter((b) => b.type !== 'image')
    .map((b) => b.text)
    .join('\n\n')

  // Trang báo đổi giao diện hoặc lỗi mạng: vẫn trả về mô tả ngắn để app hiển thị được
  const detail = { ...article, content: content || article.summary, blocks }
  // Chỉ lưu khi lấy được nội dung thật, để lần sau còn thử lại
  if (content) detailById.set(id, detail)
  return detail
}
