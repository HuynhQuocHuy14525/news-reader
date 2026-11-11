# CLAUDE.md – News Reader

Bài tập lớn môn Lập trình thiết bị di động, **2 người làm chung repo này, mỗi người dùng Claude Code riêng**.
Đọc `README.md` (yêu cầu của thầy, danh sách màn hình, kế hoạch) và `docs/api.md` (hợp đồng API) trước khi làm.
Các bước nhỏ của từng người và chỗ nối giữa 2 phần nằm trong `docs/phan-cong.md`. Khi người dùng không nói rõ làm gì, làm bước đầu tiên chưa xong trong phần của họ.

## Bạn đang làm việc với ai

Chạy `git config user.name` để biết người dùng là ai, rồi chỉ làm trong phần của họ:

| Người | Phần | Được sửa |
|---|---|---|
| Huỳnh Quốc Huy | A | `backend/src/routes/news.js`, `backend/src/services/rss.service.js`, `mobile/src/features/news/`, màn hình A trong README (trang chủ, chuyên mục, tìm kiếm, chi tiết bài, onboarding), `mobile/src/hooks/use-responsive.ts`, `mobile/eas.json` |
| Đào Tiến Dũng | B | `backend/src/routes/{auth,bookmarks,ai}.js`, `backend/src/services/ai.service.js`, `mobile/src/features/{auth,bookmarks,ai}/`, `mobile/src/app/(tabs)/_layout.tsx`, màn hình B trong README |

Nếu người dùng nhờ sửa file thuộc phần của người kia: **nhắc họ trước**, đề nghị báo cho người kia hoặc mở GitHub Issue thay vì tự sửa.

## File dùng chung (sửa phải cẩn thận)

`mobile/src/types/`, `mobile/src/constants/`, `mobile/src/services/`, `mobile/src/app/_layout.tsx`, `docs/api.md`, `backend/src/index.js`, `package.json`, `README.md`.

- Không đổi tên hay xóa trường trong `types/` mà người kia đang dùng. Chỉ **thêm** trường mới; muốn đổi thì người dùng phải thống nhất với người kia trước.
- Đổi API thì sửa `docs/api.md` và `mobile/src/types/` **trong cùng PR**, ghi rõ trong mô tả PR.
- Thêm route vào `backend/src/index.js` chỉ thêm 1 dòng `import` và 1 dòng `app.use(...)`, không sửa dòng của người khác.

## Quy trình Git (bắt buộc)

- Không bao giờ commit hay push lên `main`. Kiểm tra `git branch` trước khi commit.
- Bắt đầu việc mới: `git switch main && git pull && git switch -c feature/<ten>` (sửa lỗi: `fix/<ten>`).
- Commit: `<loại>(<phạm vi>): <mô tả tiếng Việt>`, loại là `feat|fix|refactor|style|docs|chore`. Ví dụ `feat(news): thêm API đọc RSS`.
- Commit nhỏ, mỗi commit một việc. Người dùng phải giải thích được từng commit khi thầy hỏi, nên sau khi viết code hãy giải thích ngắn cho họ.
- Push nhánh rồi để người dùng mở Pull Request, điền mẫu `.github/pull_request_template.md`. Người kia review rồi mới merge.
- Trước khi kết thúc việc: chạy `npm run typecheck` trong `mobile/`.

## Quy ước code

- `mobile/src/app/` chỉ chứa màn hình. Logic, hook, component để ở `features/<tên>/` (`api.ts`, `hooks.ts`, `components/`).
- Mọi request đi qua `apiClient` trong `mobile/src/services/api-client.ts`. Lấy dữ liệu bằng TanStack Query (`useQuery`, `useInfiniteQuery`, `useMutation`).
- Giao diện dùng component Tamagui. Token **không có `$`** và dùng tên viết tắt: `p="4"`, `gap="4"`, `items="center"`, `justify="center"`, `bg="background"`. Viết `$4`, `padding`, `alignItems` sẽ lỗi TypeScript.
- Cài thư viện cho app: `npx expo install <tên>`, không dùng `npm install`.
- Expo SDK 58: tra tài liệu đúng phiên bản (xem `mobile/AGENTS.md`), không dựa vào trí nhớ.
- Backend: Express 5, ES modules (`import`), Node chạy `npm run dev`.
- Không đặt khóa bí mật trong app (`EXPO_PUBLIC_*` bị nhúng vào APK). Khóa AI chỉ trong `backend/.env`. Không commit `.env`.
- Cần dữ liệu của phần người kia mà chưa có API: tạo dữ liệu giả đúng kiểu trong `types/` để dựng giao diện trước.
