# WeTube Frontend

Giao diện React 19 + Vite 7 của WeTube. Ứng dụng dùng Redux Toolkit, React Router, Tailwind CSS; kết nối REST API để xem và quản lý video, và Socket.IO để nhận bình luận mới.

## Chạy local

Yêu cầu Node.js 20.19+ hoặc 22.12+ và npm. Khởi động API cùng dịch vụ bình luận theo [hướng dẫn dự án](../README.md), sau đó:

```bash
cd frontend
npm ci
npm run dev
```

Mở <http://localhost:5173>. File `.env.development` dùng `VITE_API_BASE_URL=http://localhost:3000/api`. Để dùng tìm kiếm YouTube và trang `/test`, thêm `VITE_KEY_API` với khóa YouTube Data API v3. Các biến `VITE_*` hiển thị trong bản build trình duyệt; không đặt secret server tại đây.

## Lệnh

| Lệnh | Mục đích |
| --- | --- |
| `npm run build` | Tạo bản build trong `dist/` |
| `npm run preview` | Chạy thử bản build |
| `npm run lint` | Kiểm tra ESLint |
| `npm run mock-api` | Chạy `json-server` với `db.json` ở cổng `3001` (chỉ dùng riêng; cổng này trùng dịch vụ bình luận) |

API chính được cấu hình tại `src/configs/env.js`; kết nối Socket.IO của bình luận hiện dùng trực tiếp `http://127.0.0.1:3001` trong `src/components/CommentSection.jsx`.
