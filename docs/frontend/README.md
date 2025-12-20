# Doctor Care Frontend

Frontend cho ứng dụng Doctor Care được xây dựng với Next.js 14 và TypeScript.

## 🚀 Cài đặt và chạy

1. Cài đặt dependencies:
```bash
npm install
```

2. Tạo file `.env.local` từ `.env.local.example`:
```bash
copy env.local.example .env.local
```

3. Cập nhật API URL trong file `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

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
app/
├── appointments/        # Trang lịch hẹn
├── booking/            # Trang đặt lịch
├── contact/            # Trang liên hệ
├── doctors/            # Trang danh sách bác sĩ
├── login/              # Trang đăng nhập
├── register/           # Trang đăng ký
├── hooks/              # Custom hooks
│   └── useAuth.ts      # Hook quản lý authentication
└── page.tsx            # Trang chủ

components/
├── booking-steps/      # Components cho booking wizard
├── ui/                 # UI components (shadcn/ui)
├── header.tsx          # Header component
├── footer.tsx          # Footer component
└── ...                 # Các components khác

lib/
├── api.ts              # API client functions
└── utils.ts            # Utility functions
```

## 🔧 Tính năng chính

- **Authentication**: Đăng nhập, đăng ký, đăng xuất
- **Doctor Management**: Xem danh sách bác sĩ, tìm kiếm theo chuyên khoa
- **Appointment Booking**: Đặt lịch hẹn với bác sĩ
- **Contact Form**: Gửi liên hệ
- **Responsive Design**: Tương thích mobile và desktop

## 🎨 UI Components

Sử dụng shadcn/ui components với Tailwind CSS:
- Button, Input, Card, Dialog, etc.
- Custom components cho booking wizard
- Responsive design

## 🔌 API Integration

Frontend kết nối với backend thông qua REST API:
- Tất cả API calls được tập trung trong `lib/api.ts`
- Sử dụng fetch API với error handling
- JWT authentication với localStorage

## 🚀 Deployment

Có thể deploy lên Vercel, Netlify hoặc bất kỳ platform nào hỗ trợ Next.js.

Đảm bảo cấu hình đúng `NEXT_PUBLIC_API_URL` cho production.
