/**
 * "Vừa xong", "5 phút trước", "3 giờ trước", "2 ngày trước", quá 7 ngày thì hiện ngày "04/11/2026".
 * `now` để truyền vào khi cần cố định thời gian (ví dụ lúc kiểm thử).
 */
export function formatRelativeTime(iso: string, now: Date = new Date()) {
  const date = new Date(iso)
  const minutes = Math.floor((now.getTime() - date.getTime()) / 60_000)

  if (Number.isNaN(minutes)) return ''
  if (minutes < 1) return 'Vừa xong'
  if (minutes < 60) return `${minutes} phút trước`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} giờ trước`
  const days = Math.floor(hours / 24)
  if (days <= 7) return `${days} ngày trước`

  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`
}
