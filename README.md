# Doctor Care - Tách Frontend và Backend

Dự án Doctor Care đã được tách thành 2 phần riêng biệt:

## 📁 Cấu trúc dự án

```
doctor-care/
├── frontend/          # Next.js Frontend
├── backend/           # Express.js Backend
└── README.md
```

## 🚀 Cách chạy dự án

### Backend (Express.js)

1. Di chuyển vào thư mục backend:
```bash
cd backend
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file `.env` từ `.env.example`:
```bash
copy env.example .env
```

4. Cập nhật thông tin database trong file `.env`:
```
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=medbooking
JWT_SECRET=supersecretkey
FRONTEND_URL=http://localhost:3000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

5. Chạy backend:
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

Backend sẽ chạy tại: http://localhost:3001

### Frontend (Next.js)

1. Di chuyển vào thư mục frontend:
```bash
cd frontend
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file `.env.local` từ `.env.local.example`:
```bash
copy env.local.example .env.local
```

4. Cập nhật API URL trong file `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

5. Chạy frontend:
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

Frontend sẽ chạy tại: http://localhost:3000

## 🔧 API Endpoints

Backend cung cấp các API endpoints sau:

- `GET /api/specialties` - Lấy danh sách chuyên khoa
- `GET /api/doctors` - Lấy danh sách bác sĩ
- `GET /api/doctors?specialty=...` - Lấy bác sĩ theo chuyên khoa
- `POST /api/appointments` - Tạo lịch hẹn mới
- `GET /api/appointments/available` - Kiểm tra giờ trống
- `POST /api/login` - Đăng nhập
- `POST /api/register` - Đăng ký
- `POST /api/logout` - Đăng xuất
- `POST /api/contact` - Gửi liên hệ

## 🗄️ Database

Dự án sử dụng MySQL database với tên `medbooking`. Đảm bảo MySQL server đang chạy và database đã được tạo.

## 📝 Ghi chú

- Tất cả usecase, database, giao diện và API đã được giữ nguyên
- Frontend kết nối với backend thông qua REST API
- CORS đã được cấu hình để cho phép frontend kết nối với backend
- JWT authentication được sử dụng cho việc xác thực
