# Phân công chi tiết

File này chia phần A (Huy) và B (Dũng) thành từng bước nhỏ. **Mỗi bước là một nhánh và một Pull Request.**
Claude Code: đọc file này cùng `CLAUDE.md`, `README.md`, `docs/api.md`, rồi làm **bước đầu tiên chưa xong** trong phần của người dùng. Bước nào đang phải chờ phần của người kia thì làm bước khác trước, hoặc tạo dữ liệu giả đúng kiểu trong `mobile/src/types/`.

Khi PR của một bước đã merge: đổi `⬜` thành `✅` ở bước đó, sửa ngay trong PR của bước đó.

Trạng thái: ⬜ chưa làm · 🟡 đang làm / chờ review · ✅ đã merge

---

## Phần A – Huỳnh Quốc Huy

| Bước | Việc | Nhánh | File chính | Trạng thái |
|---|---|---|---|---|
| A1 | Backend đọc RSS: `GET /news`, `/news/search`, `/news/:id` | `feature/news-api` | `backend/src/routes/news.js`, `backend/src/services/rss.service.js` | ✅ |
| A2 | Gọi API tin tức + hook TanStack Query (`useNews`, `useSearchNews`, `useArticle`) | `feature/news-hooks` | `mobile/src/features/news/api.ts`, `hooks.ts` | ✅ |
| A3 | Thẻ bài viết `ArticleCard` + khung chờ tải (skeleton) | `feature/news-card` | `mobile/src/features/news/components/` | ✅ |
| A4 | Trang chủ: tin mới, kéo để làm mới, cuộn để tải thêm (xóa file tạm `app/index.tsx`) | `feature/home` | `app/(tabs)/index.tsx` | ✅ |
| A5 | Chuyên mục + tin theo chuyên mục | `feature/categories` | `app/(tabs)/categories.tsx`, `app/category/[slug].tsx` | ✅ |
| A6 | Tìm kiếm | `feature/search` | `app/(tabs)/search.tsx` | ✅ |
| A7 | Chi tiết bài, nút mở bài gốc | `feature/article-detail` | `app/article/[id].tsx` | ✅ |
| A8 | Tablet / xoay ngang: lưới nhiều cột, chia 2 cột danh sách \| chi tiết | `feature/responsive` | `mobile/src/hooks/use-responsive.ts`, các màn hình A | ✅ |
| A9 | Onboarding: giới thiệu + chọn chủ đề quan tâm | `feature/onboarding` | `app/onboarding.tsx` | ✅ |
| A10 | Animation: thẻ bài hiện dần, skeleton | `feature/news-animation` | `mobile/src/features/news/` | ✅ |
| A11 | Deploy backend lên mạng (Render hoặc Railway) | `chore/deploy-backend` | | 🟡 |
| A12 | Build APK bằng EAS, đưa link tải lên README | `chore/build-apk` | `mobile/eas.json` | ⬜ |

## Phần B – Đào Tiến Dũng

| Bước | Việc | Nhánh | File chính | Trạng thái |
|---|---|---|---|---|
| B1 | Thanh tab 5 tab (xem mục "Thanh tab" bên dưới) | `feature/tabs-navigation` | `app/(tabs)/_layout.tsx` | ✅ |
| B2 | Backend tài khoản: `POST /auth/register`, `POST /auth/login`, `GET /auth/me` + middleware kiểm tra token | `feature/auth-api` | `backend/src/routes/auth.js` | ✅ |
| B3 | App tài khoản: gọi API, lưu token trên máy, màn đăng nhập/đăng ký | `feature/auth` | `mobile/src/features/auth/`, `app/(auth)/login.tsx`, `register.tsx` | ✅ |
| B4 | Backend bài đã lưu: `GET/POST /bookmarks`, `DELETE /bookmarks/:articleId` 🔒 | `feature/bookmarks-api` | `backend/src/routes/bookmarks.js` | ✅ |
| B5 | App bài đã lưu: nút `BookmarkButton` + màn bài đã lưu | `feature/bookmarks` | `mobile/src/features/bookmarks/`, `app/(tabs)/bookmarks.tsx` | ✅ |
| B6 | Lịch sử đọc (lưu trên máy bằng AsyncStorage) | `feature/history` | `mobile/src/features/bookmarks/` hoặc `features/history/`, `app/history.tsx` | ⬜ |
| B7 | Backend AI: `POST /ai/summary`, `POST /ai/chat` | `feature/ai-api` | `backend/src/routes/ai.js`, `backend/src/services/ai.service.js` | ⬜ |
| B8 | App AI: màn tóm tắt & hỏi đáp (modal) | `feature/ai` | `mobile/src/features/ai/`, `app/ai/[id].tsx` | ⬜ |
| B9 | Màn cá nhân: thông tin tài khoản, link tới lịch sử, cài đặt, đăng xuất | `feature/profile` | `app/(tabs)/profile.tsx` | ⬜ |
| B10 | Cài đặt: giao diện sáng/tối, cỡ chữ | `feature/settings` | `app/settings.tsx` | ⬜ |
| B11 | Animation nút lưu bài | `feature/bookmark-animation` | `mobile/src/features/bookmarks/` | ⬜ |
| B12 | Chụp ảnh màn hình cho báo cáo | `docs/screenshots` | `docs/screenshots/` | ⬜ |

Gợi ý cho B2 và B4 (Dũng tự quyết): lưu người dùng và bài đã lưu vào file JSON trong `backend/data/` (nhớ thêm thư mục này vào `.gitignore`), băm mật khẩu bằng `bcryptjs`, tạo token bằng `jsonwebtoken`, đặt khóa ký token trong `backend/.env`.

---

## Chỗ nối giữa 2 phần

Hai phần dùng code của nhau ở các chỗ dưới đây. **Tên và tham số phải đúng như bảng.** Muốn đổi thì nhắn người kia trước.
Phần nào chưa có thì người dùng tạm để trống hoặc dùng dữ liệu giả, không tự viết thay phần của người kia.

### Thanh tab (B1 làm, A tạo các màn hình)

`app/(tabs)/_layout.tsx` có 5 tab theo đúng thứ tự và tên file:

| Tab | File | Ai làm màn hình |
|---|---|---|
| Trang chủ | `(tabs)/index.tsx` | A |
| Chuyên mục | `(tabs)/categories.tsx` | A |
| Tìm kiếm | `(tabs)/search.tsx` | A |
| Đã lưu | `(tabs)/bookmarks.tsx` | B |
| Cá nhân | `(tabs)/profile.tsx` | B |

Màn hình của A chưa có thì Expo Router chỉ báo cảnh báo, B không cần tạo file thay.
Màn hình của A **tự vẽ tiêu đề** (có chừa tai thỏ), nên `Tabs` đặt `screenOptions={{ headerShown: false }}` để không bị 2 thanh tiêu đề.
Các màn `article/[id]`, `category/[slug]`, `ai/[id]`, `history`, `settings`, `onboarding`, `(auth)/*` nằm ngoài tab, mở chồng lên trên (Stack ở `app/_layout.tsx`).

### A làm, B dùng

| Thứ | Ở đâu | B dùng vào việc gì |
|---|---|---|
| `getArticleDetail(id)` → `ArticleDetail \| null` | `backend/src/services/rss.service.js` | B7: lấy nội dung bài để gửi cho AI |
| `<ArticleCard article={...} />` | `mobile/src/features/news/components/ArticleCard.tsx` (A3) | B5, B6: hiển thị danh sách bài đã lưu và lịch sử đọc |
| Bấm thẻ bài thì mở `/article/[id]` | A3 | B không cần tự viết điều hướng |

### B làm, A dùng (trong màn chi tiết bài A7)

| Thứ | Ở đâu | A dùng vào việc gì |
|---|---|---|
| `<BookmarkButton article={article} />` | `mobile/src/features/bookmarks/components/BookmarkButton.tsx` (B5) | Nút lưu bài trên màn chi tiết |
| `router.push('/ai/' + article.id)` | màn `app/ai/[id].tsx` (B8) | Nút "Tóm tắt bằng AI" trên màn chi tiết |
| `addToHistory(article: Article)` | `mobile/src/features/bookmarks/history.ts` hoặc `features/history/` (B6) | Gọi khi mở màn chi tiết |
| `useFontSize()` → số cỡ chữ | `mobile/src/features/settings/` (B10) | Cỡ chữ nội dung bài |
| `useAuth()` → `{ user, token, isLoggedIn }` | `mobile/src/features/auth/` (B3) | Biết người dùng đã đăng nhập chưa trước khi lưu bài |

### File dùng chung mà B sẽ phải sửa (nhớ ghi trong mô tả PR)

- `mobile/src/services/api-client.ts`: B3 **thêm** interceptor gắn `Authorization: Bearer <token>`, không sửa dòng có sẵn.
- `mobile/src/app/_layout.tsx`: B10 thay `useColorScheme()` bằng giao diện người dùng chọn. A9 cũng sẽ sửa file này để chuyển sang onboarding ở lần mở đầu tiên. Ai sửa trước thì báo người kia pull về.
- `backend/src/index.js`: mỗi route chỉ thêm 1 dòng `import` và 1 dòng `app.use(...)`.

---

## Thứ tự và chờ nhau

| Tuần | A (Huy) | B (Dũng) |
|---|---|---|
| 1 | A1 → A4 | B1 (làm trước, vì A4 cần thanh tab) → B2 → B3 |
| 2 | A5 → A8 | B4 → B8 |
| 3 | A9 → A12 | B9 → B12, sửa lỗi |

- A4 cần B1 thì mới thấy được thanh tab. **B1 nên merge sớm nhất.**
- B5, B6 cần A3 (`ArticleCard`). Chưa có thì dùng tạm một `Text` hiện tiêu đề bài.
- B7 cần A1 (`getArticleDetail`). A1 đã xong, chỉ chờ merge.
- A7 cần B5, B6, B8, B10. Chưa có thì A để nút giả hoặc dòng `// TODO(B5): BookmarkButton`.

## Ghi chú tiến độ phần A (11/11)

- A1–A10 đã push, mỗi bước một nhánh. Các nhánh **nối tiếp nhau** (nhánh sau tách từ nhánh trước), nên merge theo đúng thứ tự: `docs/phan-cong` → `feature/news-api` → `feature/news-hooks` → `feature/news-card` → `feature/home` → `feature/categories` → `feature/search` → `feature/article-detail` → `feature/responsive` → `feature/onboarding` → `feature/news-animation` → `chore/deploy-backend` → `docs/cap-nhat-tien-do`.
- Nhánh `feature/article-card` trên GitHub là bản cũ của A3, đã thay bằng `feature/news-card`, có thể xóa.
- B dùng được ngay: `ArticleCard` (`features/news/components/ArticleCard.tsx`), `getArticleDetail` (backend), AsyncStorage đã cài sẵn (A9).
- Màn chi tiết bài (`ArticleDetailView.tsx`) có sẵn chỗ chờ `TODO(B5)`, `TODO(B8)`, `TODO(B10)` cho phần của Dũng.

## Cần chốt

- **Onboarding**: `CLAUDE.md` và bảng màn hình trong README ghi là A, nhưng kế hoạch 3 tuần trong README ghi là B làm ở tuần 3. File này để **A làm (A9)**. Nếu cả 2 đồng ý thì sửa lại kế hoạch trong README cho khớp.
