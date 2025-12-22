# Cấu Hình Email cho Azure + Netlify

## Tổng quan

- **Backend**: Azure App Service → Cấu hình email trong **Azure App Service Settings**
- **Frontend**: Netlify → **KHÔNG cần** cấu hình email (email chỉ xử lý ở backend)

## Bước 1: Tạo Gmail App Password

1. Vào [Google Account](https://myaccount.google.com/)
2. **Security** → **2-Step Verification** (bật nếu chưa bật)
3. **App passwords** → **Select app** → **Mail** → **Select device** → **Generate**
4. Copy password (16 ký tự, format: `xxxx xxxx xxxx xxxx`)

## Bước 2: Cấu hình trong Azure App Service

### Cách 1: Dùng Azure CLI

**Cho PowerShell (Windows):**

```powershell
az webapp config appsettings set --resource-group doctor-care-rg --name doctor-care-backend --settings EMAIL_USER=your-email@gmail.com EMAIL_PASS=xxxx-xxxx-xxxx-xxxx EMAIL_HOST=smtp.gmail.com EMAIL_PORT=587
```

**Hoặc dùng backtick để xuống dòng (PowerShell):**

```powershell
az webapp config appsettings set `
  --resource-group doctor-care-rg `
  --name doctor-care-backend `
  --settings `
    EMAIL_USER=your-email@gmail.com `
    EMAIL_PASS=xxxx-xxxx-xxxx-xxxx `
    EMAIL_HOST=smtp.gmail.com `
    EMAIL_PORT=587
```

**Cho Bash/Linux/Mac:**

```bash
az webapp config appsettings set \
  --resource-group doctor-care-rg \
  --name doctor-care-backend \
  --settings \
    EMAIL_USER=your-email@gmail.com \
    EMAIL_PASS=xxxx-xxxx-xxxx-xxxx \
    EMAIL_HOST=smtp.gmail.com \
    EMAIL_PORT=587
```

**Thay:**
- `your-email@gmail.com` → Email Gmail của bạn
- `xxxx-xxxx-xxxx-xxxx` → App Password vừa tạo (có thể dùng dấu cách hoặc dấu gạch ngang)

### Cách 2: Dùng Azure Portal

1. Vào [Azure Portal](https://portal.azure.com)
2. Tìm **App Service** → `doctor-care-backend`
3. **Settings** → **Configuration** → **Application settings**
4. Click **+ New application setting** và thêm từng biến:

   | Name | Value |
   |------|-------|
   | `EMAIL_USER` | `your-email@gmail.com` |
   | `EMAIL_PASS` | `xxxx-xxxx-xxxx-xxxx` |
   | `EMAIL_HOST` | `smtp.gmail.com` |
   | `EMAIL_PORT` | `587` |

5. Click **Save** → **Continue**

## Bước 3: Restart Backend

```bash
az webapp restart --name doctor-care-backend --resource-group doctor-care-rg
```

Hoặc trong Azure Portal:
- App Service → **Overview** → **Restart**

## Bước 4: Kiểm tra

### Xem logs:

```bash
az webapp log tail --name doctor-care-backend --resource-group doctor-care-rg
```

### Test chức năng Forgot Password:

1. Vào site Netlify
2. Click "Quên mật khẩu"
3. Nhập email: `patient1@example.com`
4. Submit
5. Kiểm tra logs xem có:
   - ✅ `📧 Đang gửi email...`
   - ✅ `✅ Email sent successfully!`

## Kiểm tra Environment Variables

```bash
# Xem tất cả settings
az webapp config appsettings list \
  --name doctor-care-backend \
  --resource-group doctor-care-rg \
  --output table

# Chỉ xem email settings
az webapp config appsettings list \
  --name doctor-care-backend \
  --resource-group doctor-care-rg \
  --output table | findstr EMAIL
```

## Lưu ý quan trọng

⚠️ **KHÔNG cần** thêm vào file `.env` trên production
- File `.env` chỉ dùng cho local development
- Trên Azure, dùng App Service Settings

⚠️ **Frontend (Netlify) KHÔNG cần** cấu hình email
- Email chỉ được xử lý ở backend
- Frontend chỉ gọi API, không gửi email trực tiếp

⚠️ **Gmail App Password**
- Phải bật 2-Step Verification trước
- Dùng App Password, không dùng password thường
- Format: `xxxx xxxx xxxx xxxx` hoặc `xxxx-xxxx-xxxx-xxxx`

## Troubleshooting

### Lỗi: "Invalid login"

**Fix:**
1. Kiểm tra lại App Password đã copy đúng chưa
2. Tạo App Password mới nếu cần
3. Đảm bảo `EMAIL_USER` là email đầy đủ (có @gmail.com)

### Lỗi: "Connection timeout"

**Fix:**
- Kiểm tra `EMAIL_HOST=smtp.gmail.com`
- Kiểm tra `EMAIL_PORT=587`
- Thử port 465 nếu 587 không được

### Email không gửi được

**Kiểm tra:**
1. Xem logs backend có lỗi gì
2. Kiểm tra App Password còn hiệu lực không
3. Kiểm tra Gmail có block không

## Quick Command

**PowerShell (Windows):**

```powershell
# Cấu hình email (thay thông tin của bạn) - viết trên 1 dòng
az webapp config appsettings set --resource-group doctor-care-rg --name doctor-care-backend --settings EMAIL_USER=toanpv.2lit@vku.udn.vn EMAIL_PASS=your-app-password EMAIL_HOST=smtp.gmail.com EMAIL_PORT=587

# Restart
az webapp restart --name doctor-care-backend --resource-group doctor-care-rg

# Xem logs
az webapp log tail --name doctor-care-backend --resource-group doctor-care-rg
```

**Bash/Linux/Mac:**

```bash
# Cấu hình email (thay thông tin của bạn)
az webapp config appsettings set \
  --resource-group doctor-care-rg \
  --name doctor-care-backend \
  --settings \
    EMAIL_USER=toanpv.2lit@vku.udn.vn \
    EMAIL_PASS=your-app-password \
    EMAIL_HOST=smtp.gmail.com \
    EMAIL_PORT=587

# Restart
az webapp restart --name doctor-care-backend --resource-group doctor-care-rg

# Xem logs
az webapp log tail --name doctor-care-backend --resource-group doctor-care-rg
```

## Checklist

- [ ] Đã tạo Gmail App Password
- [ ] Đã thêm `EMAIL_USER` vào Azure App Service Settings
- [ ] Đã thêm `EMAIL_PASS` vào Azure App Service Settings
- [ ] Đã thêm `EMAIL_HOST=smtp.gmail.com`
- [ ] Đã thêm `EMAIL_PORT=587`
- [ ] Đã restart backend
- [ ] Đã test chức năng forgot password
- [ ] Logs hiển thị email gửi thành công

---

**Sau khi cấu hình xong, chức năng forgot password sẽ hoạt động! ✅**

