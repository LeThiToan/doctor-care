# Các bước tiếp theo để Deploy lên Azure

## ✅ Đã hoàn thành:
- [x] Build Docker image cho backend thành công
- [x] Test Docker container local thành công

## 📋 Checklist các bước tiếp theo:

### Bước 1: Chuẩn bị Azure (Nếu chưa có)

```powershell
# 1. Login vào Azure
az login

# 2. Kiểm tra subscription
az account show

# 3. Tạo Resource Group (nếu chưa có)
az group create --name doctor-care-rg --location eastus
```

### Bước 2: Tạo Azure Container Registry (ACR)

```powershell
# Tạo ACR (chỉ cần làm 1 lần)
az acr create --resource-group doctor-care-rg --name doctorcareregistry --sku Basic

# Lưu ý: Tên ACR phải unique globally, nếu bị trùng thì đổi tên khác
```

### Bước 3: Push Docker Image lên ACR

**Option A: Build và push từ local (đã có image)**

```powershell
# Login vào ACR
az acr login --name doctorcareregistry

# Tag image
docker tag doctor-care-backend:latest doctorcareregistry.azurecr.io/doctor-care-backend:latest

# Push image
docker push doctorcareregistry.azurecr.io/doctor-care-backend:latest
```

**Option B: Build trực tiếp trên ACR (khuyến nghị - không cần push)**

```powershell
# Build trực tiếp trên ACR (từ thư mục backend)
az acr build --registry doctorcareregistry --image doctor-care-backend:latest --file Dockerfile .
```

### Bước 4: Tạo Azure Database for MySQL

```powershell
# Tạo MySQL server
az mysql flexible-server create `
  --resource-group doctor-care-rg `
  --name doctor-care-mysql `
  --location eastus `
  --admin-user adminuser `
  --admin-password YourSecurePassword123! `
  --sku-name Standard_B1ms `
  --tier Burstable `
  --version 8.0.21 `
  --storage-size 32 `
  --public-access 0.0.0.0

# Tạo database
az mysql flexible-server db create `
  --resource-group doctor-care-rg `
  --server-name doctor-care-mysql `
  --database-name medbooking
```

### Bước 5: Tạo Azure App Service cho Backend

```powershell
# Tạo App Service Plan
az appservice plan create `
  --name doctor-care-plan `
  --resource-group doctor-care-rg `
  --is-linux `
  --sku B1

# Tạo Web App
az webapp create `
  --resource-group doctor-care-rg `
  --plan doctor-care-plan `
  --name doctor-care-backend `
  --deployment-container-image-name doctorcareregistry.azurecr.io/doctor-care-backend:latest

# Lấy ACR password và cấu hình
$ACR_PASSWORD = az acr credential show --name doctorcareregistry --query "passwords[0].value" --output tsv

az webapp config container set `
  --name doctor-care-backend `
  --resource-group doctor-care-rg `
  --docker-custom-image-name doctorcareregistry.azurecr.io/doctor-care-backend:latest `
  --docker-registry-server-url https://doctorcareregistry.azurecr.io `
  --docker-registry-server-user doctorcareregistry `
  --docker-registry-server-password $ACR_PASSWORD
```

### Bước 6: Cấu hình Environment Variables

```powershell
# Cấu hình environment variables
az webapp config appsettings set `
  --resource-group doctor-care-rg `
  --name doctor-care-backend `
  --settings `
    PORT=3001 `
    DB_HOST=doctor-care-mysql.mysql.database.azure.com `
    DB_USER=adminuser `
    DB_PASSWORD=YourSecurePassword123! `
    DB_NAME=medbooking `
    DB_SSL=true `
    JWT_SECRET=your-super-secret-jwt-key-here-change-this `
    FRONTEND_URL=https://doctor-care-frontend.azurewebsites.net `
    GEMINI_API_KEY=your_gemini_api_key_here

# Bật WebSockets cho Socket.io
az webapp config set `
  --resource-group doctor-care-rg `
  --name doctor-care-backend `
  --web-sockets-enabled true
```

### Bước 7: Cấu hình Firewall cho MySQL

```powershell
# Cho phép Azure services
az mysql flexible-server firewall-rule create `
  --resource-group doctor-care-rg `
  --name doctor-care-mysql `
  --rule-name AllowAzureServices `
  --start-ip-address 0.0.0.0 `
  --end-ip-address 0.0.0.0

# Cho phép IP của bạn (để chạy migrations)
az mysql flexible-server firewall-rule create `
  --resource-group doctor-care-rg `
  --name doctor-care-mysql `
  --rule-name AllowMyIP `
  --start-ip-address YOUR_IP_ADDRESS `
  --end-ip-address YOUR_IP_ADDRESS
```

### Bước 8: Chạy Database Migrations

```powershell
# Kết nối và chạy SQL scripts
mysql -h doctor-care-mysql.mysql.database.azure.com -u adminuser -p medbooking < setup-complete-db.sql
mysql -h doctor-care-mysql.mysql.database.azure.com -u adminuser -p medbooking < chat-schema.sql
```

### Bước 9: Kiểm tra Deployment

```powershell
# Xem logs
az webapp log tail --name doctor-care-backend --resource-group doctor-care-rg

# Test health endpoint
# Lấy URL backend
$BACKEND_URL = az webapp show --name doctor-care-backend --resource-group doctor-care-rg --query "defaultHostName" -o tsv
Invoke-WebRequest -Uri "https://$BACKEND_URL/api/health" -UseBasicParsing
```

### Bước 10: Deploy Frontend (Sau khi backend đã chạy)

Xem hướng dẫn trong file `AZURE_DEPLOYMENT.md` phần "Phần 2: Deploy Frontend"

---

## 🚀 Quick Start Script (Tất cả trong một)

Tôi có thể tạo script tự động hóa tất cả các bước trên. Bạn muốn tôi tạo không?

## ⚠️ Lưu ý quan trọng:

1. **Thay đổi các giá trị sau:**
   - `YourSecurePassword123!` → Password mạnh cho MySQL
   - `your-super-secret-jwt-key-here-change-this` → JWT secret mạnh
   - `your_gemini_api_key_here` → Gemini API key (nếu có)
   - `YOUR_IP_ADDRESS` → IP thực tế của bạn

2. **Chi phí ước tính:** ~$30-35/tháng

3. **Tên ACR phải unique:** Nếu `doctorcareregistry` bị trùng, đổi tên khác

## 📞 Cần giúp đỡ?

- Xem file `AZURE_DEPLOYMENT.md` để biết chi tiết
- Kiểm tra logs: `az webapp log tail --name doctor-care-backend --resource-group doctor-care-rg`
- Troubleshooting section trong `AZURE_DEPLOYMENT.md`

