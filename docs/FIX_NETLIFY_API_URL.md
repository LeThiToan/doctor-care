# Fix API URL cho Netlify Deployment

## Vấn đề

Khi deploy frontend lên Netlify, các API call đang cố kết nối tới `localhost:3001` thay vì backend trên Azure.

## Giải pháp

Cấu hình Environment Variable trong Netlify:

### Bước 1: Vào Netlify Dashboard

1. Đăng nhập vào [Netlify Dashboard](https://app.netlify.com)
2. Chọn site của bạn (ví dụ: `vermillion-kulfi-ea1332`)
3. Vào **Site settings** → **Environment variables**

### Bước 2: Thêm Environment Variable

Thêm biến môi trường sau:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://doctor-care-backend.azurewebsites.net/api` |

**URL Backend của bạn:** `https://doctor-care-backend.azurewebsites.net/api`

### Bước 3: Redeploy

Sau khi thêm environment variable:

1. Vào **Deploys** tab
2. Click **Trigger deploy** → **Clear cache and deploy site**
3. Hoặc push code mới lên Git để trigger auto-deploy

## Kiểm tra

Sau khi deploy lại, kiểm tra:

1. Mở DevTools → Network tab
2. Thử đăng nhập bác sĩ
3. Xem API call có đang gọi tới Azure backend không:
   - ✅ `https://doctor-care-backend.azurewebsites.net/api/doctors-auth/login`
   - ❌ `http://localhost:3001/api/doctors-auth/login`

## URL Backend của bạn

**Backend URL:** `https://doctor-care-backend.azurewebsites.net/api`

Hãy copy URL này và thêm vào Netlify Environment Variables.

## Lưu ý

- `NEXT_PUBLIC_API_URL` là biến môi trường Next.js public (có thể truy cập từ client)
- Phải rebuild/redeploy sau khi thay đổi environment variables
- Đảm bảo backend Azure đang chạy và có CORS cho phép domain Netlify

## Các API Files đã được chuẩn hóa

Tất cả các API files hiện dùng `NEXT_PUBLIC_API_URL`:
- `frontend/lib/api.ts` ✅
- `frontend/lib/doctors-api.ts` ✅ (đã fix)
- `frontend/lib/admin-api.ts` ✅
- `frontend/lib/chat-api.ts` ✅

