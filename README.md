# WeTube

Ứng dụng xem và quản lý video gồm giao diện React, API Express và dịch vụ bình luận thời gian thực. Người dùng có thể đăng ký, đăng nhập, xem và tương tác với video, theo dõi kênh, xem lịch sử; Studio hỗ trợ đăng và quản lý video.

## Công nghệ và cấu trúc

| Thành phần | Công nghệ | Vai trò |
| --- | --- | --- |
| [`frontend/`](frontend/) | React 19, Vite 7, Redux Toolkit, Tailwind CSS | Giao diện web |
| [`backend/`](https://github.com/letiendat24/backend_wetube/tree/main/backend) | Node.js, Express, Mongoose, Cloudinary | REST API, xác thực, video và kênh |
| [`comment_service/`](https://github.com/letiendat24/backend_wetube/tree/main/comment_service) | Express, Socket.IO, Mongoose | Lưu và phát bình luận theo thời gian thực |

Mã nguồn backend nằm ở repository riêng: [backend_wetube](https://github.com/letiendat24/backend_wetube). Hai service dùng MongoDB; API chính chạy ở cổng `3000`, dịch vụ bình luận ở `3001`, Vite ở `5173`.

## Chạy trên máy cá nhân

**Yêu cầu:** Node.js tương thích Vite 7 (20.19+ hoặc 22.12+), npm, MongoDB và tài khoản Cloudinary nếu dùng tính năng tải video lên.

1. Clone hai repository vào cùng một thư mục cha:

   ```bash
   git clone https://github.com/letiendat24/WeTube-App.git
   git clone https://github.com/letiendat24/backend_wetube.git
   ```

2. Tạo file cấu hình cho từng ứng dụng:

   | File | Biến cần thiết |
   | --- | --- |
   | `backend_wetube/backend/.env` | `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`; tùy chọn: `PORT=3000`, `JWT_EXPIRES_IN=7d`, `COMMENT_SERVICE_URL=http://127.0.0.1:3001` |
   | `backend_wetube/comment_service/.env` | `MONGO_URI_COMMENT`; tùy chọn: `PORT=3001` |
   | `WeTube-App/frontend/.env.development` | Dùng file có sẵn hoặc sao chép `.env.example`; đặt `VITE_API_BASE_URL=http://localhost:3000/api`. Thêm `VITE_KEY_API` (YouTube Data API v3) để dùng trang tìm kiếm và trang `/test`. |

   Dùng URI MongoDB của bạn cho hai biến `MONGO_URI*`; có thể dùng hai database trong cùng một MongoDB instance. Không commit giá trị bí mật vào repository. Biến `VITE_*` được đưa vào bản build trình duyệt, vì vậy không đặt secret server tại đây.

3. Mở ba terminal và chạy:

   ```bash
   cd backend_wetube/comment_service && npm ci && npm run dev
   cd backend_wetube/backend && npm ci && npm run dev
   cd WeTube-App/frontend && npm ci && npm run dev
   ```

   Truy cập <http://localhost:5173>. API dùng tiền tố `/api`; dịch vụ bình luận có endpoint `GET http://127.0.0.1:3001/health`. Hãy giữ cổng `3000` và `3001` như trên: một số URL gọi service và Socket.IO đang được khai báo trực tiếp trong code.

## Lệnh thường dùng

Trong `frontend/`: `npm run build` tạo bản build, `npm run preview` xem bản build, `npm run lint` kiểm tra ESLint. Trong mỗi thư mục backend: `npm start` chạy service không dùng nodemon.

## Lưu ý hiện trạng

- Trang chủ lấy video từ API WeTube; trang tìm kiếm và `/test` gọi YouTube Data API v3 và cần `VITE_KEY_API`.
- Bình luận đi qua API chính (`/api/comments`) và cập nhật trực tiếp qua Socket.IO tại cổng `3001`.
- `npm test` trong hai service backend hiện là script placeholder, chưa có bộ kiểm thử tự động.
