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

// Mỗi báo đặt tên file RSS khác nhau, nên map slug chung -> tên file của báo đó
const SOURCES = [
  {
    id: 'vnexpress',
    name: 'VnExpress',
    rssBase: 'https://vnexpress.net/rss/',
    feeds: { 'cong-nghe': 'so-hoa' },
  },
  {
    id: 'tuoitre',
    name: 'Tuổi Trẻ',
    rssBase: 'https://tuoitre.vn/rss/',
    feeds: { 'cong-nghe': 'nhip-song-so' },
  },
  {
    id: 'thanhnien',
    name: 'Thanh Niên',
    rssBase: 'https://thanhnien.vn/rss/',
    feeds: { 'kinh-doanh': 'kinh-te' },
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
