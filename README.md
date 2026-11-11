# News Reader

Ứng dụng đọc báo tổng hợp tin từ nhiều nguồn RSS, có AI tóm tắt và hỏi đáp về bài viết. Trên tablet hoặc khi xoay ngang, màn hình chia 2 cột: danh sách bên trái, chi tiết bên phải.

Bài tập lớn môn **Lập trình cho thiết bị di động** (422000181701 – DHKTPM19ATT).

## Thành viên

| Họ tên | MSSV | GitHub | Phụ trách chính |
|---|---|---|---|
| Huỳnh Quốc Huy | 23654001 | [@HuynhQuocHuy14525](https://github.com/HuynhQuocHuy14525) | **A**: tin tức, chuyên mục, tìm kiếm, responsive, deploy backend, build APK |
| Đào Tiến Dũng | 23658461 | [@dunghdtt](https://github.com/dunghdtt) | **B**: điều hướng, tài khoản, bài đã lưu, AI, cài đặt |

## Tính năng

1. Xem tin mới nhất, kéo để làm mới, cuộn để tải thêm
2. Xem tin theo chuyên mục
3. Tìm kiếm bài viết
4. Đọc chi tiết bài viết, mở bài gốc
5. Lưu bài để đọc sau
6. Lịch sử bài đã đọc
7. Đăng ký / đăng nhập
8. AI tóm tắt bài báo
9. Hỏi đáp với AI về nội dung bài
10. Chọn chủ đề quan tâm khi mở app lần đầu
11. Cài đặt giao diện sáng/tối, cỡ chữ

## Công nghệ

| Phần | Công nghệ |
|---|---|
| App | Expo SDK 58, Expo Router, TypeScript |
| Giao diện | Tamagui (config v6) |
| Gọi API | Axios + TanStack Query |
| Animation | React Native Reanimated |
| Backend | Node.js + Express (đọc RSS các báo ra JSON, gọi AI) |
| Build | EAS Build (file APK) |

## Đối chiếu yêu cầu đề bài

✅ xong · 🟡 đã cấu hình, đang làm · ⬜ chưa làm

| # | Yêu cầu | Cách đáp ứng | Vị trí trong code | Trạng thái |
|---|---|---|---|---|
| 1 | ~10 chức năng, 10–15 màn hình | 11 chức năng, 13 màn hình (bảng bên dưới) | `mobile/src/app/` | ⬜ |
| 2 | Có backend | Express: tin tức từ RSS, tài khoản, bài đã lưu, AI | `backend/` | 🟡 |
| 3 | Dùng Axios để gọi API | Một instance Axios dùng chung | `mobile/src/services/api-client.ts` | 🟡 |
| 4 | Dùng Expo Project | Tạo bằng `create-expo-app` | `mobile/` | ✅ |
| 5 | Build & phân phối qua internet | EAS Build ra APK, gửi link/QR để tải | `mobile/eas.json` | 🟡 |
| 6 | AI basic | Tóm tắt bài, hỏi đáp về bài (gọi qua backend) | `mobile/src/features/ai/`, `backend/` | ⬜ |
| 7 | Redux Toolkit hoặc TanStack Query | TanStack Query: cache tin, kéo làm mới, cuộn vô hạn | `mobile/src/services/query-client.ts`, `mobile/src/features/*/` | 🟡 |
| 8 | Chạy trên thiết bị thật | Expo Go trên Android, cài APK | — | ⬜ |
| 9 | Responsive (xoay ngang, tablet, iPad) | Cho phép xoay ngang, hỗ trợ iPad; màn hình rộng hiện lưới nhiều cột và chia đôi danh sách/chi tiết | `mobile/app.json`, `mobile/src/hooks/use-responsive.ts` | 🟡 |
| 10 | Animation basic | Card hiện dần, skeleton khi tải, hiệu ứng nút lưu bài | `mobile/src/components/`, `mobile/src/features/news/` | ⬜ |
| 11 | TamaGUI | `TamaguiProvider` bọc toàn app, mọi màn hình dùng component Tamagui | `mobile/tamagui.config.ts`, `mobile/src/app/_layout.tsx` | 🟡 |
| 12 | Link GitHub | Repo này | — | ✅ |

## Danh sách màn hình

Đường dẫn tính từ `mobile/src/app/`. A = Huy, B = Dũng.

| # | Màn hình | File | Phụ trách |
|---|---|---|---|
| 1 | Giới thiệu & chọn chủ đề | `onboarding.tsx` | A |
| 2 | Đăng nhập | `(auth)/login.tsx` | B |
| 3 | Đăng ký | `(auth)/register.tsx` | B |
| 4 | Trang chủ (tin mới) | `(tabs)/index.tsx` | A |
| 5 | Chuyên mục | `(tabs)/categories.tsx` | A |
| 6 | Tin theo chuyên mục | `category/[slug].tsx` | A |
| 7 | Tìm kiếm | `(tabs)/search.tsx` | A |
| 8 | Chi tiết bài viết | `article/[id].tsx` | A |
| 9 | AI tóm tắt & hỏi đáp | `ai/[id].tsx` (modal) | B |
| 10 | Bài đã lưu | `(tabs)/bookmarks.tsx` | B |
| 11 | Lịch sử đọc | `history.tsx` | B |
| 12 | Cá nhân | `(tabs)/profile.tsx` | B |
| 13 | Cài đặt | `settings.tsx` | B |

## Kế hoạch 3 tuần

| Tuần | A (Huy) | B (Dũng) |
|---|---|---|
| 1 | Backend đọc RSS (`/api/news`), trang chủ, chuyên mục | Thanh tab + điều hướng, đăng ký/đăng nhập |
| 2 | Chi tiết bài, tìm kiếm, chia 2 cột trên tablet | Bài đã lưu, lịch sử, AI tóm tắt & hỏi đáp |
| 3 | Animation, deploy backend, build APK | Onboarding, cài đặt, sửa lỗi, chụp ảnh `docs/` |

## Cấu trúc thư mục

```
news-reader/
├── mobile/                     # App Expo
│   ├── src/
│   │   ├── app/                # CHỈ chứa màn hình (Expo Router: mỗi file = 1 màn hình)
│   │   ├── features/           # Code theo chức năng: api.ts, hooks.ts, components/, types.ts
│   │   │   ├── news/
│   │   │   ├── auth/
│   │   │   ├── bookmarks/
│   │   │   └── ai/
│   │   ├── components/         # Component dùng chung (ErrorView, Skeleton, ...)
│   │   ├── services/           # api-client.ts (Axios), query-client.ts (TanStack Query)
│   │   ├── hooks/              # Hook dùng chung (use-responsive, ...)
│   │   ├── constants/          # Hằng số (danh sách chuyên mục, ...)
│   │   ├── types/              # Kiểu dữ liệu dùng chung (Article, User, ...)
│   │   └── utils/              # Hàm tiện ích (formatDate, ...)
│   ├── assets/
│   ├── tamagui.config.ts
│   ├── app.json
│   ├── eas.json
│   └── .env.example
├── backend/                    # API Express
│   ├── src/
│   │   ├── routes/             # health, news, auth, bookmarks, ai
│   │   ├── services/           # rss.service (đọc RSS), ai.service (gọi AI)
│   │   └── index.js
│   └── .env.example
├── docs/                       # Ảnh chụp màn hình, báo cáo
├── .github/                    # Mẫu Pull Request
└── README.md
```

Quy tắc:

- Màn hình trong `app/` chỉ lo hiển thị và gọi hook trong `features/`. Expo Router coi mọi file trong `app/` là một màn hình, nên component, hook, hàm tiện ích phải để ngoài.
- Mọi request đi qua `services/api-client.ts`.
- Chia theo `features/` để 2 người làm song song mà ít sửa trùng file.

## Cài đặt & chạy

Cần: Node.js LTS, Git, điện thoại Android cài Expo Go. Máy tính và điện thoại phải dùng chung một mạng Wi-Fi.

**Backend**

```bash
cd backend
npm install
cp .env.example .env
npm run dev               # http://localhost:3000/api/health
```

**App**

```bash
cd mobile
npm install
cp .env.example .env      # sửa EXPO_PUBLIC_API_URL thành IP máy tính, ví dụ http://192.168.1.10:3000/api
npx expo start            # mở Expo Go, quét mã QR
```

Điện thoại không hiểu `localhost` là máy tính của bạn, nên phải dùng IP trong mạng LAN (xem bằng `ipconfig` trên Windows).

Trước khi tạo Pull Request, chạy `npm run typecheck` trong `mobile/`.

## Build APK

```bash
cd mobile
npx eas-cli@latest login
npx eas-cli@latest build -p android --profile preview
```

Profile `preview` trong `mobile/eas.json` đã cấu hình build ra APK. Trước khi build, sửa `EXPO_PUBLIC_API_URL` trong đó thành địa chỉ backend đã deploy. File `.env` nằm trong `.gitignore` nên EAS không mang lên máy build. Backend phải chạy online (ví dụ Render, Railway) thì APK cài trên máy khác mới gọi được API.

**Link tải APK:** _(cập nhật sau khi build)_

## Quy ước làm việc nhóm

- `main` luôn chạy được. Mỗi chức năng một nhánh `feature/<ten>`, sửa lỗi `fix/<ten>`.
- Không push thẳng vào `main`: mở Pull Request, người còn lại xem rồi mới merge.
- Trước khi tạo nhánh mới: `git switch main && git pull`.
- Commit message: `<loại>(<phạm vi>): <mô tả>`, loại gồm `feat`, `fix`, `refactor`, `style`, `docs`, `chore`.
  Ví dụ: `feat(news): thêm màn hình chi tiết bài viết`.
- Không commit `.env`, `node_modules/`. Khóa AI chỉ để trong `backend/.env`, không bao giờ để trong app (biến `EXPO_PUBLIC_` bị nhúng vào APK, ai cũng đọc được).
- Cài thư viện cho app bằng `npx expo install <tên>` thay vì `npm install`, để lấy đúng bản hợp với SDK.
- Ai làm phần nào tự commit phần đó, để giải thích được khi thầy hỏi.
- API giữa app và backend ghi trong [docs/api.md](docs/api.md). Đổi API thì sửa file này trong cùng PR.
- Cả nhóm dùng Claude Code: luật cho AI nằm ở [CLAUDE.md](CLAUDE.md), Claude tự đọc khi mở dự án.

## Ghi chú Tamagui (config v6)

Token viết **không có dấu `$`** và phải dùng tên viết tắt:

```tsx
<YStack flex={1} items="center" justify="center" gap="4" p="4" bg="background">
  <Text fontSize="lg">Xin chào</Text>
</YStack>
```

Code mẫu cũ trên mạng dùng `$4`, `alignItems`, `padding` sẽ báo lỗi TypeScript.

Tamagui 3 còn đổi thêm:

- Bỏ `pressStyle`, `hoverStyle`: viết trạng thái ngay trong giá trị, ví dụ `bg="background press:background-press"`, `opacity="1 press:0.8"`.
- Tên màu có gạch nối: `color-10`, `border-color`, `background-press`.
- `Button` bỏ `chromeless`, chỉ còn `variant="outlined"`.
- Trên web, `lineHeight` dạng số không đơn vị bị hiểu là hệ số nhân (xem `ArticleDetailView.tsx`).
Viết tắt hay dùng: `p` `px` `py` `m` `mx` `my` (padding/margin), `items` `justify` (căn), `bg`, `rounded`, `w` `h`.
