# Hướng dẫn Deploy Backend lên Azure

## Yêu cầu
- Azure account
- Azure CLI đã cài đặt
- Docker đã cài đặt (để build image local nếu cần)

## Các bước deploy

### 1. Tạo Azure Container Registry (ACR) - Nếu chưa có

```bash
# Login vào Azure
az login

# Tạo resource group
az group create --name doctor-care-rg --location eastus

# Tạo Azure Container Registry
az acr create --resource-group doctor-care-rg --name doctorcareregistry --sku Basic
```

### 2. Build và Push Docker Image lên ACR

```bash
# Login vào ACR
az acr login --name doctorcareregistry

# Build image
docker build -t doctorcareregistry.azurecr.io/doctor-care-backend:latest .

# Push image lên ACR
docker push doctorcareregistry.azurecr.io/doctor-care-backend:latest
```

### 3. Tạo Azure Database for MySQL

```bash
# Tạo MySQL server
az mysql flexible-server create \
  --resource-group doctor-care-rg \
  --name doctor-care-mysql \
  --location eastus \
  --admin-user adminuser \
  --admin-password YourSecurePassword123! \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --version 8.0.21 \
  --storage-size 32 \
  --public-access 0.0.0.0

# Tạo database
az mysql flexible-server db create \
  --resource-group doctor-care-rg \
  --server-name doctor-care-mysql \
  --database-name medbooking
```

### 4. Tạo Azure Container Instance (ACI) hoặc App Service

#### Option A: Azure Container Instances (Đơn giản hơn)

```bash
# Tạo container instance
az container create \
  --resource-group doctor-care-rg \
  --name doctor-care-backend \
  --image doctorcareregistry.azurecr.io/doctor-care-backend:latest \
  --registry-login-server doctorcareregistry.azurecr.io \
  --registry-username doctorcareregistry \
  --registry-password <ACR_PASSWORD> \
  --dns-name-label doctor-care-backend \
  --ports 3001 \
  --environment-variables \
    PORT=3001 \
    DB_HOST=doctor-care-mysql.mysql.database.azure.com \
    DB_USER=adminuser \
    DB_PASSWORD=YourSecurePassword123! \
    DB_NAME=medbooking \
    DB_SSL=true \
    JWT_SECRET=your-super-secret-jwt-key-here \
    FRONTEND_URL=https://your-frontend-domain.com \
    GEMINI_API_KEY=your_gemini_api_key_here
```

#### Option B: Azure App Service (Khuyến nghị cho production)

```bash
# Tạo App Service Plan
az appservice plan create \
  --name doctor-care-plan \
  --resource-group doctor-care-rg \
  --is-linux \
  --sku B1

# Tạo Web App với container
az webapp create \
  --resource-group doctor-care-rg \
  --plan doctor-care-plan \
  --name doctor-care-backend \
  --deployment-container-image-name doctorcareregistry.azurecr.io/doctor-care-backend:latest

# Cấu hình environment variables
az webapp config appsettings set \
  --resource-group doctor-care-rg \
  --name doctor-care-backend \
  --settings \
    PORT=3001 \
    DB_HOST=doctor-care-mysql.mysql.database.azure.com \
    DB_USER=adminuser \
    DB_PASSWORD=YourSecurePassword123! \
    DB_NAME=medbooking \
    DB_SSL=true \
    JWT_SECRET=your-super-secret-jwt-key-here \
    FRONTEND_URL=https://your-frontend-domain.com \
    GEMINI_API_KEY=your_gemini_api_key_here

# Cấu hình container registry credentials
az webapp config container set \
  --name doctor-care-backend \
  --resource-group doctor-care-rg \
  --docker-custom-image-name doctorcareregistry.azurecr.io/doctor-care-backend:latest \
  --docker-registry-server-url https://doctorcareregistry.azurecr.io \
  --docker-registry-server-user doctorcareregistry \
  --docker-registry-server-password <ACR_PASSWORD>
```

### 5. Cấu hình CORS và Firewall

```bash
# Cho phép Azure services truy cập MySQL
az mysql flexible-server firewall-rule create \
  --resource-group doctor-care-rg \
  --name doctor-care-mysql \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Cho phép IP của bạn (để test)
az mysql flexible-server firewall-rule create \
  --resource-group doctor-care-rg \
  --name doctor-care-mysql \
  --rule-name AllowMyIP \
  --start-ip-address YOUR_IP_ADDRESS \
  --end-ip-address YOUR_IP_ADDRESS
```

### 6. Chạy Database Migrations

Sau khi deploy, bạn cần chạy SQL scripts để tạo tables:

```bash
# Kết nối vào MySQL và chạy scripts
mysql -h doctor-care-mysql.mysql.database.azure.com \
  -u adminuser \
  -p \
  medbooking < setup-complete-db.sql

mysql -h doctor-care-mysql.mysql.database.azure.com \
  -u adminuser \
  -p \
  medbooking < chat-schema.sql
```

### 7. Kiểm tra Deployment

```bash
# Xem logs
az webapp log tail --name doctor-care-backend --resource-group doctor-care-rg

# Hoặc với ACI
az container logs --resource-group doctor-care-rg --name doctor-care-backend
```

### 8. Cấu hình Continuous Deployment (Tùy chọn)

```bash
# Enable continuous deployment từ GitHub
az webapp deployment source config \
  --name doctor-care-backend \
  --resource-group doctor-care-rg \
  --repo-url https://github.com/yourusername/doctor-care \
  --branch main \
  --manual-integration
```

## Lưu ý quan trọng

1. **Environment Variables**: Đảm bảo tất cả biến môi trường được cấu hình đúng trong Azure Portal hoặc qua CLI
2. **Database Connection**: MySQL trên Azure sử dụng SSL mặc định, có thể cần cấu hình thêm trong `database.ts`
3. **CORS**: Cập nhật `FRONTEND_URL` với domain thực tế của frontend
4. **JWT Secret**: Sử dụng secret mạnh và lưu trữ an toàn
5. **Port**: Azure App Service tự động map port, nhưng vẫn cần expose port trong Dockerfile
6. **Health Check**: Có thể cần thêm endpoint `/api/health` trong backend

## Troubleshooting

- **Container không start**: Kiểm tra logs và environment variables
- **Database connection failed**: Kiểm tra firewall rules và credentials
- **CORS errors**: Đảm bảo `FRONTEND_URL` được cấu hình đúng
- **Socket.io không hoạt động**: Azure App Service có thể cần cấu hình WebSockets

## Chi phí ước tính (tháng)

- Azure Container Registry Basic: ~$5
- Azure Database for MySQL (Burstable B1ms): ~$12-15
- Azure App Service (B1): ~$13
- **Tổng**: ~$30-35/tháng

