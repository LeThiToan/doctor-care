# Hướng Dẫn Cấu Hình Email

## Lỗi: "Email chưa được cấu hình"

Lỗi này xảy ra khi bạn sử dụng chức năng:
- Quên mật khẩu (Forgot password)
- Gửi email xác nhận đặt lịch
- Gửi email liên hệ

## Cấu hình Email

### ⚠️ QUAN TRỌNG: Tùy môi trường

**1. Local Development (`.env` file):**
- Thêm vào file `backend/.env`

**2. Production Azure (App Service Settings):**
- Thêm vào Azure App Service Environment Variables
- KHÔNG dùng file `.env` trên production

## Giải pháp

### Option 1: Cấu hình Email cho Local Development

#### Bước 1: Tạo file `.env` từ `.env.example`

```bash
cd backend
copy env.example .env  # Windows
# hoặc
cp env.example .env    # Linux/Mac
```

#### Bước 2: Thêm cấu hình email vào file `.env`

Mở file `backend/.env` và thêm (bỏ comment):

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

#### Bước 3: Tạo Gmail App Password (nếu dùng Gmail)

Nếu bạn dùng Gmail:

1. Vào [Google Account](https://myaccount.google.com/)
2. **Security** → **2-Step Verification** (bật nếu chưa bật)
3. **App passwords** → **Select app** → **Mail** → **Select device** → **Generate**
4. Copy password (16 ký tự)

#### Bước 4: Restart backend (local)

```bash
# Dừng backend (Ctrl+C) và chạy lại
npm run dev
```

### Option 2: Cấu hình Email cho Production (Azure)

#### Bước 1: Tạo Gmail App Password

Nếu bạn dùng Gmail:

1. Vào [Google Account](https://myaccount.google.com/)
2. **Security** → **2-Step Verification** (bật nếu chưa bật)
3. **App passwords** → **Select app** → **Mail** → **Select device** → **Generate**
4. Copy password (16 ký tự)

#### Bước 2: Cấu hình trong Azure App Service

```bash
az webapp config appsettings set \
  --resource-group doctor-care-rg \
  --name doctor-care-backend \
  --settings \
    EMAIL_USER=your-email@gmail.com \
    EMAIL_PASS=your-app-password \
    EMAIL_HOST=smtp.gmail.com \
    EMAIL_PORT=587
```

**Lưu ý:**
- `EMAIL_USER`: Email Gmail của bạn
- `EMAIL_PASS`: App Password từ Google (không phải password thường)
- `EMAIL_HOST`: `smtp.gmail.com` cho Gmail
- `EMAIL_PORT`: `587` cho Gmail

#### Bước 3: Restart Backend

```bash
az webapp restart --name doctor-care-backend --resource-group doctor-care-rg
```

### Option 3: Làm Email Optional (Tạm thời)

Nếu bạn không muốn cấu hình email ngay, có thể sửa code để không crash khi thiếu email.

Tuy nhiên, các chức năng như forgot password sẽ không hoạt động.

## Cấu hình cho các Email Provider khác

### Gmail
```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=app-password  # App Password từ Google
```

### Outlook/Hotmail
```bash
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

### Yahoo
```bash
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=app-password  # App Password từ Yahoo
```

### Custom SMTP
```bash
EMAIL_HOST=your-smtp-server.com
EMAIL_PORT=587  # hoặc 465 cho SSL
EMAIL_USER=your-username
EMAIL_PASS=your-password
```

## Kiểm tra cấu hình

### Xem environment variables hiện tại:

```bash
az webapp config appsettings list \
  --name doctor-care-backend \
  --resource-group doctor-care-rg \
  --output table | findstr EMAIL
```

### Test email (từ backend logs):

Sau khi cấu hình, thử chức năng forgot password và xem logs:

```bash
az webapp log tail --name doctor-care-backend --resource-group doctor-care-rg
```

Tìm các log:
- ✅ `📧 Đang gửi email...` → Đang gửi
- ✅ `✅ Email sent successfully!` → Thành công
- ❌ `❌ Error sending email` → Có lỗi

## Troubleshooting

### Lỗi: "Invalid login"

**Nguyên nhân:** 
- Sai password
- Chưa dùng App Password (Gmail)

**Fix:**
- Tạo App Password mới từ Google Account
- Cập nhật lại `EMAIL_PASS` trong Azure

### Lỗi: "Connection timeout"

**Nguyên nhân:**
- Firewall block port 587
- Sai SMTP host/port

**Fix:**
- Kiểm tra `EMAIL_HOST` và `EMAIL_PORT` đúng
- Thử port 465 với SSL nếu 587 không được

### Lỗi: "Authentication failed"

**Nguyên nhân:**
- Sai username/password
- Gmail chưa bật "Less secure app access" (không còn hỗ trợ) → Phải dùng App Password

**Fix:**
- Dùng App Password thay vì password thường cho Gmail
- Kiểm tra username đúng format email

## Quick Fix

### Cho Local Development:

1. **Tạo file `.env`:**
```bash
cd backend
copy env.example .env
```

2. **Thêm vào file `.env`:**
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

3. **Restart backend:**
```bash
npm run dev
```

### Cho Production (Azure):

```bash
# Thay các giá trị bằng thông tin thực tế của bạn
az webapp config appsettings set \
  --resource-group doctor-care-rg \
  --name doctor-care-backend \
  --settings \
    EMAIL_USER=your-email@gmail.com \
    EMAIL_PASS=xxxx xxxx xxxx xxxx \
    EMAIL_HOST=smtp.gmail.com \
    EMAIL_PORT=587

# Restart
az webapp restart --name doctor-care-backend --resource-group doctor-care-rg
```

## Lưu ý

⚠️ **Email là optional** - Nếu không cấu hình, các chức năng email sẽ không hoạt động nhưng ứng dụng vẫn chạy bình thường (trừ forgot password).

⚠️ **Gmail App Password** - Phải bật 2-Step Verification trước khi tạo App Password.

⚠️ **Security** - Không commit email password vào Git. Chỉ set trong Azure App Service settings.

