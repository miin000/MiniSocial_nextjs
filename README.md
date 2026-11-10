# MiniSocial Web

Ứng dụng web của MiniSocial, xây dựng bằng Next.js và TypeScript. Frontend cung
cấp giao diện mạng xã hội cho người dùng và khu vực quản trị, kết nối với
MiniSocial API qua REST.

## Tính năng

- Đăng ký, đăng nhập, đăng xuất và khôi phục phiên đăng nhập.
- Trang chủ, feed bài viết, tạo/chỉnh sửa bài viết và tương tác.
- Hồ sơ cá nhân, bạn bè, nhóm và trò chuyện.
- Thông báo, upload avatar/media và recommendation.
- Dashboard quản trị: quản lý tài khoản, nhóm, bài viết, báo cáo, logs,
  analytics và system settings.
- Giao diện responsive cho desktop và mobile web.

## Công nghệ

- Next.js 16 (App Router)
- React 19 và TypeScript
- Tailwind CSS 4
- Axios, Zustand và React Hot Toast
- Firebase Admin cho các chức năng tích hợp backend cần thiết
- Recharts, Chart.js và React ChartJS 2 cho dashboard
- ESLint và TypeScript cho kiểm tra mã nguồn

## Yêu cầu

- Node.js phiên bản tương thích với Next.js 16
- npm
- MiniSocial API đang chạy, mặc định tại `http://localhost:3001`
- ML Recommendation service nếu sử dụng các màn hình recommendation

## Cài đặt

```bash
git clone https://github.com/miin000/MiniSocial_nextjs.git
cd MiniSocial_nextjs
npm install
```

Tạo file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_ML_URL=http://localhost:8000
```

`NEXT_PUBLIC_API_URL` là URL API có prefix `/api/v1`. Nếu API hoặc ML service
được triển khai ở môi trường khác, thay các giá trị trên bằng URL tương ứng.
Không đưa secret server-side vào biến bắt đầu bằng `NEXT_PUBLIC_`.

## Chạy dự án

Chạy development server:

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

Build và chạy production:

```bash
npm run build
npm run start
```

Kiểm tra lint:

```bash
npm run lint
```

## Cấu trúc chính

```text
src/
├── app/          # Routes và layout theo Next.js App Router
├── components/   # Component giao diện dùng lại
├── hooks/        # React hooks dùng chung
├── lib/          # Axios client và tiện ích nền tảng
├── services/     # API service và ML service
├── store/        # Zustand stores, gồm trạng thái xác thực
└── types/        # Kiểu dữ liệu TypeScript
public/           # Tài nguyên tĩnh và cấu hình public
```

`src/lib/axios.ts` đọc `NEXT_PUBLIC_API_URL` và tự gắn token xác thực cho
request. `next.config.ts` cấu hình rewrite đường dẫn upload từ frontend đến
backend.

## Kết nối các service

Khi chạy local, nên khởi động API trước:

```text
Web       http://localhost:3000
API       http://localhost:3001/api/v1
ML        http://localhost:8000
```

Nếu chỉ phát triển giao diện, có thể bỏ qua ML service; các màn hình gọi
recommendation sẽ cần URL ML hợp lệ để hiển thị dữ liệu thực.

## Quy ước phát triển

- Giữ logic gọi API trong `src/services` hoặc `src/lib`, không gọi API trực
  tiếp rải rác trong component khi đã có service tương ứng.
- Dùng type trong `src/types` cho payload và response mới.
- Kiểm tra lint và build trước khi tạo bản phát hành.

## License

Dự án hiện chưa công bố license open source. Hãy liên hệ chủ dự án trước khi
phân phối lại.
