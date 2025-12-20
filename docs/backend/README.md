# Doctor Care Backend

Backend API cho ứng dụng Doctor Care được xây dựng với Express.js và TypeScript.

## 🚀 Cài đặt và chạy

1. Cài đặt dependencies:
```bash
npm install
```

2. Tạo file `.env` từ `.env.example`:
```bash
copy env.example .env
```

3. Cập nhật thông tin database trong file `.env`

4. Chạy development server:
```bash
npm run dev
```

5. Build cho production:
```bash
npm run build
npm start
```

## 📁 Cấu trúc thư mục

```
src/
├── config/
│   └── database.ts      # Cấu hình kết nối MySQL
├── routes/
│   ├── auth.ts          # Authentication routes
│   ├── specialties.ts   # Specialties routes
│   ├── doctors.ts       # Doctors routes
│   ├── appointments.ts  # Appointments routes
│   └── contact.ts       # Contact routes
├── middleware/          # Custom middleware
└── index.ts            # Entry point
```

## 🔧 API Endpoints

### Authentication
- `POST /api/login` - Đăng nhập
- `POST /api/register` - Đăng ký
- `POST /api/logout` - Đăng xuất

### Specialties
- `GET /api/specialties` - Lấy danh sách chuyên khoa

### Doctors
- `GET /api/doctors` - Lấy danh sách bác sĩ
- `GET /api/doctors?specialty=...` - Lấy bác sĩ theo chuyên khoa

### Appointments
- `POST /api/appointments` - Tạo lịch hẹn mới
- `GET /api/appointments/available` - Kiểm tra giờ trống

### Contact
- `POST /api/contact` - Gửi liên hệ

## 🗄️ Database

Sử dụng MySQL với connection pool. Cấu hình trong `src/config/database.ts`.

## 🔐 Authentication

Sử dụng JWT tokens cho authentication. Token được lưu trong localStorage của frontend.

## 📧 Email

Sử dụng Nodemailer để gửi email liên hệ. Cấu hình SMTP trong file `.env`.
