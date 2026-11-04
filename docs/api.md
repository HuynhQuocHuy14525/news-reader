# API giữa app và backend

Đây là hợp đồng chung. Ai đổi một API thì sửa file này **trong cùng Pull Request** và ghi rõ trong mô tả PR.
Kiểu dữ liệu tương ứng nằm ở `mobile/src/types/`.

- Địa chỉ gốc: `EXPO_PUBLIC_API_URL`, ví dụ `http://192.168.1.10:3000/api`
- Dữ liệu gửi và nhận đều là JSON.
- Lỗi: trả mã HTTP 4xx/5xx kèm `{ "error": { "message": "Mô tả lỗi bằng tiếng Việt" } }`
- API có ghi 🔒 thì phải gửi header `Authorization: Bearer <token>`.

## Tin tức (A – Huy)

| Method | Đường dẫn | Query / Body | Trả về |
|---|---|---|---|
| GET | `/health` | | `{ status: "ok", time }` |
| GET | `/news` | `category?` (slug), `page?` (mặc định 1), `limit?` (mặc định 20) | `Paginated<Article>` |
| GET | `/news/search` | `q` (bắt buộc), `page?`, `limit?` | `Paginated<Article>` |
| GET | `/news/:id` | | `ArticleDetail` (có thêm `content`) |

`id` do backend tạo từ link bài gốc, nên cùng một bài thì `id` luôn giống nhau.

Ví dụ một `Article`:

```json
{
  "id": "a1b2c3d4",
  "title": "Tiêu đề bài báo",
  "summary": "Đoạn mô tả ngắn...",
  "url": "https://vnexpress.net/...",
  "imageUrl": "https://i1-vnexpress.vnecdn.net/...jpg",
  "source": "vnexpress",
  "sourceName": "VnExpress",
  "category": "cong-nghe",
  "publishedAt": "2026-11-04T08:30:00.000Z"
}
```

Danh sách slug chuyên mục: `mobile/src/constants/categories.ts`.

## Tài khoản (B – Dũng)

| Method | Đường dẫn | Body | Trả về |
|---|---|---|---|
| POST | `/auth/register` | `{ name, email, password }` | `AuthResponse` |
| POST | `/auth/login` | `{ email, password }` | `AuthResponse` |
| GET | `/auth/me` 🔒 | | `User` |

## Bài đã lưu (B – Dũng)

| Method | Đường dẫn | Body | Trả về |
|---|---|---|---|
| GET | `/bookmarks` 🔒 | | `Article[]` |
| POST | `/bookmarks` 🔒 | `Article` | `Article` |
| DELETE | `/bookmarks/:articleId` 🔒 | | `204` |

Lịch sử đọc lưu ngay trên máy (AsyncStorage), không cần API.

## AI (B – Dũng)

| Method | Đường dẫn | Body | Trả về |
|---|---|---|---|
| POST | `/ai/summary` | `{ articleId }` | `{ summary: string }` |
| POST | `/ai/chat` | `{ articleId, question, history?: { role: "user" \| "assistant", content }[] }` | `{ answer: string }` |

Backend tự lấy nội dung bài bằng hàm của phần tin tức (dùng chung `rss.service`), app không cần gửi nội dung lên.
Khóa AI chỉ nằm trong `backend/.env`.
