# Giải thích phần A (Huy) – ôn trước khi vấn đáp

Mỗi mục là một câu thầy hay hỏi, câu trả lời ngắn để nói lại được, kèm link tới dòng code.
Cách ôn: đọc câu hỏi, tự trả lời thành tiếng, rồi mở link xem code có khớp không.

---

## 0. Nói tổng quan trong 30 giây

> App đọc báo lấy tin từ RSS của VnExpress, Tuổi Trẻ, Thanh Niên. **Backend Express** đọc RSS, đổi về một dạng JSON chung rồi trả cho app. **App Expo** gọi API bằng **Axios**, quản lý dữ liệu bằng **TanStack Query**, giao diện dùng **Tamagui**. Trên tablet hoặc khi xoay ngang thì chia 2 cột. Phần em làm: backend tin tức, trang chủ, chuyên mục, tìm kiếm, chi tiết bài, onboarding, responsive, animation.

Đường đi của dữ liệu:

```
Báo (RSS XML) → backend: rss.service.js đọc + chuẩn hóa → routes/news.js trả JSON
→ app: api.ts (Axios) → hooks.ts (TanStack Query, cache) → màn hình (Tamagui)
```

---

## 1. Backend

**Hỏi: Backend lấy tin ở đâu?**
Từ RSS của 3 báo, mỗi báo 8 chuyên mục, tổng 24 đường link. Danh sách nằm ở [`SOURCES`](../backend/src/services/rss.service.js#L19). Mỗi báo đặt tên file RSS khác nhau (VnExpress gọi công nghệ là `so-hoa`), nên có bảng `feeds` để đổi slug chung sang tên của từng báo.

**Hỏi: RSS là XML, làm sao thành JSON?**
Dùng thư viện `fast-xml-parser` đọc XML thành object ([`loadFeed`](../backend/src/services/rss.service.js#L128)), rồi đổi từng `<item>` thành `Article` đúng kiểu trong `mobile/src/types/article.ts`. Mô tả có thẻ HTML và ký tự như `&ugrave;`, nên dùng `cheerio` để bỏ thẻ và giải mã ([`toPlainText`](../backend/src/services/rss.service.js#L76)).

**Hỏi: `id` của bài lấy ở đâu?**
RSS không có id, nên em **băm link bài bằng SHA-1** rồi lấy 12 ký tự đầu ([`makeId`](../backend/src/services/rss.service.js#L71)). Cùng một link luôn ra cùng một id, nên mở lại bài hay lưu bài đều khớp.

**Hỏi: Có gì khó khi đọc RSS?**
Ngày đăng mỗi báo ghi một kiểu ([`parseDate`](../backend/src/services/rss.service.js#L87)). Tuổi Trẻ ghi `11/10/2026 8:16:00 PM`, không có múi giờ, và trước chữ PM là một **ký tự khoảng trắng đặc biệt (U+202F)**. Em phải tự tách ngày giờ và ghi rõ `+07:00`. Nếu không, server đặt ở nước ngoài (giờ UTC) sẽ hiển thị lệch 7 tiếng.

**Hỏi: Mỗi lần app gọi là backend lại tải 24 file RSS à?**
Không. Kết quả được **lưu tạm (cache) 5 phút** ([`CACHE_TTL_MS`](../backend/src/services/rss.service.js#L48)). Trong 5 phút đó backend trả ngay từ bộ nhớ, đo được dưới 1ms thay vì khoảng 0,5 giây.

**Hỏi: Một báo bị lỗi thì sao?**
Dùng [`Promise.allSettled`](../backend/src/services/rss.service.js#L152) chứ không phải `Promise.all`. Một báo lỗi thì bỏ qua báo đó, vẫn trả tin của các báo còn lại. Chỉ khi cả 24 link đều lỗi mới báo lỗi.

**Hỏi: Phân trang làm thế nào?**
Lấy danh sách đã sắp mới nhất trước, rồi cắt theo `page` và `limit` ([`paginate`](../backend/src/routes/news.js#L18)). Trả thêm `hasMore` để app biết còn trang sau không. `limit` tối đa 50, giá trị sai thì dùng mặc định ([`readPaging`](../backend/src/routes/news.js#L11)).

**Hỏi: Tìm kiếm không dấu làm sao?**
Hàm [`normalize`](../backend/src/services/rss.service.js#L170) đổi chữ về dạng không dấu và chữ thường (`Bóng Đá` → `bong da`), dùng `normalize('NFD')` để tách dấu ra rồi xóa. Cả từ khóa lẫn tiêu đề đều qua hàm này rồi mới so. Em so **nguyên cụm từ**: lúc đầu so từng từ thì gõ "bong da" lại ra cả "da tay", "bóng rổ".

**Hỏi: Sao route `/search` phải viết trước `/:id`?**
Express so route theo thứ tự từ trên xuống. Nếu `/:id` đứng trước thì `/news/search` sẽ bị hiểu là bài có id = "search".

**Hỏi: Nội dung đầy đủ của bài lấy ở đâu? RSS chỉ có mô tả ngắn mà.**
[`getArticleDetail`](../backend/src/services/rss.service.js#L194) tải trang HTML của bài gốc, dùng cheerio lấy các đoạn `<p>` theo bộ chọn riêng của từng báo ([`contentSelector`](../backend/src/services/rss.service.js#L27)). Với Tuổi Trẻ và Thanh Niên em dùng `>` (chỉ lấy con trực tiếp) để bỏ chú thích ảnh nằm trong `<figure>`. Không tải được trang gốc thì trả mô tả ngắn để app vẫn hiện được bài.

**Hỏi: Lỗi trả về thế nào?**
Theo hợp đồng trong `docs/api.md`: mã 4xx/5xx kèm `{ error: { message } }`. Express 5 tự chuyển lỗi của hàm `async` tới [middleware xử lý lỗi](../backend/src/routes/news.js#L58).

---

## 2. Axios (yêu cầu 3)

**Hỏi: Dùng Axios ở đâu?**
Có một instance chung [`apiClient`](../mobile/src/services/api-client.ts#L4) với `baseURL` lấy từ `.env`. Mọi request của app đều đi qua đây, ví dụ [`fetchNews`](../mobile/src/features/news/api.ts#L13). Sau này Dũng chỉ cần thêm interceptor gắn token ở một chỗ là mọi request đều có.

**Hỏi: Sao request tin tức chờ tới 60 giây?**
Backend chạy gói miễn phí của Render sẽ "ngủ" sau 15 phút không ai dùng, lần gọi đầu tiên mất khoảng 30–50 giây để thức dậy ([`NEWS_TIMEOUT_MS`](../mobile/src/features/news/api.ts#L11)).

**Hỏi: Lỗi mạng hiện thế nào?**
[`getErrorMessage`](../mobile/src/features/news/errors.ts#L6): backend có gửi câu báo lỗi thì hiện câu đó; không có phản hồi (mất mạng, sai IP) thì báo "Không kết nối được máy chủ". Màn hình hiện kèm nút "Thử lại".

---

## 3. TanStack Query (yêu cầu 7)

**Hỏi: Sao không dùng `useEffect` + `useState` để gọi API?**
TanStack Query lo sẵn: trạng thái đang tải / lỗi, **cache** (quay lại màn cũ không phải tải lại), tự thử lại khi lỗi, kéo để làm mới. Tự viết bằng `useEffect` thì phải làm lại hết những việc đó.

**Hỏi: Cuộn để tải thêm làm sao?**
[`useNews`](../mobile/src/features/news/hooks.ts#L25) dùng `useInfiniteQuery`. Hàm [`nextPage`](../mobile/src/features/news/hooks.ts#L17) đọc `hasMore` của trang cuối: còn thì trả về số trang tiếp, hết thì trả `undefined` để dừng. Danh sách gọi `fetchNextPage()` khi cuộn còn nửa màn hình nữa là hết ([`onEndReached`](../mobile/src/features/news/components/NewsList.tsx#L54), [`onEndReachedThreshold={0.5}`](../mobile/src/features/news/components/NewsList.tsx#L101)).

**Hỏi: `queryKey` để làm gì?**
Là "tên" của dữ liệu trong cache. Tin công nghệ có key `['news','list','cong-nghe']`, tin thể thao là key khác, nên hai bên lưu riêng. Các key gom ở [`newsKeys`](../mobile/src/features/news/hooks.ts#L9).

**Hỏi: `enabled` để làm gì?**
Để chưa gọi API khi chưa đủ điều kiện: ô tìm kiếm trống ([`useSearchNews`](../mobile/src/features/news/hooks.ts#L46)), slug chuyên mục sai ([category/[slug].tsx](../mobile/src/app/category/[slug].tsx#L15)).

**Hỏi: Có dùng `useMutation` không?**
Có, khi lưu chủ đề quan tâm ở onboarding ([`useSaveInterests`](../mobile/src/features/news/interests.ts#L35)). Lưu xong thì `setQueryData` cập nhật luôn cache, nên trang chủ đổi theo ngay.

**Hỏi: Kéo để làm mới?**
[`onRefresh`](../mobile/src/features/news/components/NewsList.tsx#L48) gọi `refetch()`. Em tự giữ biến `refreshing` vì `isRefetching` của TanStack Query cũng bật khi app tự tải lại ngầm; dùng nó thì vòng xoay sẽ hiện lung tung.

**Hỏi: Sao phải lọc trùng bài?**
Nếu có bài mới đăng trong lúc đang cuộn, các bài cũ bị đẩy xuống, nên trang 2 có thể lặp lại bài cuối của trang 1. Em lọc theo `id` bằng `Set` ([NewsList.tsx](../mobile/src/features/news/components/NewsList.tsx#L77)).

---

## 4. Màn hình và điều hướng

| Màn hình | File | Ý chính |
|---|---|---|
| Onboarding | [onboarding.tsx](../mobile/src/app/onboarding.tsx) | Chọn chủ đề, lưu bằng AsyncStorage |
| Trang chủ | [(tabs)/index.tsx](../mobile/src/app/(tabs)/index.tsx) | Lần đầu mở app thì chuyển sang onboarding; hàng nút lọc theo chủ đề |
| Chuyên mục | [(tabs)/categories.tsx](../mobile/src/app/(tabs)/categories.tsx) | Lưới 2 cột, tablet 4 cột |
| Tin theo chuyên mục | [category/[slug].tsx](../mobile/src/app/category/[slug].tsx) | Đường dẫn động `[slug]` |
| Tìm kiếm | [(tabs)/search.tsx](../mobile/src/app/(tabs)/search.tsx) | Chờ ngừng gõ rồi mới tìm, có gợi ý |
| Chi tiết bài | [article/[id].tsx](../mobile/src/app/article/[id].tsx) | Chia sẻ, mở bài gốc |

**Hỏi: Expo Router hoạt động ra sao?**
Mỗi file trong `src/app/` là một màn hình, tên file chính là đường dẫn. `[id].tsx` là đường dẫn động: lấy giá trị bằng `useLocalSearchParams`. Thư mục trong ngoặc như `(tabs)` chỉ để nhóm file, không xuất hiện trên đường dẫn.

**Hỏi: Sao màn hình ít code vậy?**
Theo quy ước nhóm: `app/` chỉ hiển thị, logic để trong `features/news/`. Ba màn trang chủ, chuyên mục, tìm kiếm dùng chung component [`NewsList`](../mobile/src/features/news/components/NewsList.tsx), component này lo hết các trạng thái đang tải, lỗi, trống.

**Hỏi: Debounce trong tìm kiếm là gì?**
Gõ "bong da" là 7 phím. Không chờ thì gọi API 7 lần. [`useDebouncedValue`](../mobile/src/features/news/use-debounced-value.ts#L10) hẹn giờ 400ms; gõ tiếp trước khi hết giờ thì [hủy hẹn giờ cũ](../mobile/src/features/news/use-debounced-value.ts#L12). Ngừng gõ đủ 400ms mới tìm, chỉ gọi API 1 lần.

**Hỏi: Nút quay lại khi không có trang trước?**
[`BackButton`](../mobile/src/features/news/components/BackButton.tsx#L6): `router.canGoBack()` sai (ví dụ mở thẳng bằng link) thì về trang chủ.

**Hỏi: Onboarding chỉ hiện lần đầu thế nào?**
Chủ đề lưu trong AsyncStorage với key [`news-reader:interests`](../mobile/src/features/news/interests.ts#L7). Chưa lưu gì thì đọc ra `null`, trang chủ thấy `null` thì [chuyển sang onboarding](../mobile/src/app/(tabs)/index.tsx#L20). Bấm "Bỏ qua" lưu mảng rỗng `[]`, khác `null`, nên lần sau không hiện nữa.

---

## 5. Responsive (yêu cầu 9)

**Hỏi: Tablet / xoay ngang khác gì?**
[`useResponsive`](../mobile/src/hooks/use-responsive.ts#L5) đọc độ rộng màn hình bằng `useWindowDimensions`. Từ **768px** trở lên (tablet, hoặc điện thoại xoay ngang) thì `isWide = true`:
- [`NewsSplitView`](../mobile/src/features/news/components/NewsSplitView.tsx#L20) chia 2 cột: danh sách bên trái, bài bên phải. Bấm bài thì hiện ở cột phải thay vì mở màn mới, và tự mở sẵn bài đầu tiên.
- Lưới chuyên mục từ 2 cột lên 4 cột.

**Hỏi: Xoay máy thì sao?**
`useWindowDimensions` tự cập nhật khi xoay, nên giao diện đổi ngay. `app.json` đặt `"orientation": "default"` để cho xoay, và `"supportsTablet": true` cho iPad.

**Hỏi: `useIsMounted` trong use-responsive để làm gì?**
Chỉ dành cho **bản web**: Expo dựng HTML sẵn trên máy chủ, lúc đó chưa biết màn rộng bao nhiêu nên coi là màn hẹp. Trình duyệt vẽ lại mà thấy màn rộng thì React báo lỗi "Hydration failed". Vì vậy lần vẽ đầu trên web em cũng coi là màn hẹp ([dòng 12](../mobile/src/hooks/use-responsive.ts#L12)). Trên điện thoại không có bước dựng sẵn này nên không bị ảnh hưởng.

---

## 6. Animation (yêu cầu 10)

**Hỏi: Có những animation nào, làm bằng gì?**
Đều dùng **React Native Reanimated**:
1. **Thẻ bài hiện dần**: [`entering={FadeInDown...}`](../mobile/src/features/news/components/NewsList.tsx#L88). Bài hiện dần và trượt lên nhẹ; 8 bài đầu lần lượt cách nhau 50ms ([`enterAnimation`](../mobile/src/features/news/components/NewsList.tsx#L16)).
2. **Khung chờ tải nhấp nháy**: `useSharedValue` giữ độ mờ, [`withRepeat(withTiming(0.4), -1, true)`](../mobile/src/features/news/components/ArticleCardSkeleton.tsx#L35) mờ xuống 0.4 rồi sáng lại, lặp mãi (`-1`), `true` là chạy ngược lại mỗi lượt.
3. Người dùng bật "giảm chuyển động" trong cài đặt máy thì [`useReducedMotion`](../mobile/src/features/news/components/ArticleCardSkeleton.tsx#L30) tắt hiệu ứng nhấp nháy.

**Hỏi: Sao dùng Reanimated mà không dùng `Animated` của React Native?**
Reanimated chạy animation trên luồng giao diện (UI thread), không phụ thuộc luồng JavaScript, nên mượt hơn khi app đang bận tải dữ liệu.

---

## 7. Tamagui (yêu cầu 11)

**Hỏi: Tamagui dùng thế nào?**
`TamaguiProvider` bọc toàn app ([_layout.tsx](../mobile/src/app/_layout.tsx#L12)), chọn giao diện sáng/tối theo máy. Màn hình dùng `YStack`, `XStack`, `Text`, `Button`, `Input`, `Spinner`, `Separator` của Tamagui. Viết tắt: `p` = padding, `items` = alignItems, `bg` = background.

**Hỏi: Token là gì?**
Là giá trị đặt sẵn trong config: `p="4"` = 16px, `color="color-10"` là màu chữ phụ, tự đổi theo giao diện sáng/tối. Không viết số cứng nên giao diện đồng nhất.

**Hỏi: Hiệu ứng nhấn viết sao?**
Tamagui 3 viết trạng thái ngay trong giá trị: [`bg="background press:background-press"`](../mobile/src/features/news/components/ArticleCard.tsx#L33), nghĩa là bình thường dùng màu `background`, lúc nhấn dùng `background-press`. Code mẫu cũ trên mạng dùng `pressStyle`, bản này đã bỏ.

---

## 8. Câu hỏi khó có thể gặp

**Hỏi: Em có dùng AI không?**
Có, nhóm dùng Claude Code. Em chia việc thành từng bước nhỏ, mỗi bước một commit để hiểu và kiểm tra được. Commit có ghi `Co-Authored-By: Claude` cho minh bạch. *(Trả lời thật, rồi chứng minh mình hiểu bằng cách giải thích code.)*

**Hỏi: Lấy nội dung từ trang báo khác có vấn đề gì không?**
Đây là bài tập học tập, app luôn ghi nguồn và có nút **mở bài gốc**. Nếu làm thật thì nên chỉ hiện mô tả ngắn và dẫn link về báo.

**Hỏi: Nếu báo đổi giao diện thì sao?**
Bộ chọn `contentSelector` không tìm thấy đoạn nào thì backend trả mô tả ngắn thay vào, app không bị hỏng. Chỉ cần sửa lại bộ chọn của báo đó.

**Hỏi: Nếu có thêm thời gian em làm gì?**
Lưu tin vào cơ sở dữ liệu để tìm được cả bài cũ (hiện chỉ tìm trong tin RSS đang có), thêm nguồn báo, gửi thông báo khi có tin mới về chủ đề quan tâm.
