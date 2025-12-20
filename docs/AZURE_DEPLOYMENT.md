# Hướng dẫn Deploy Frontend và Backend lên Azure

## Yêu cầu
- Azure account
- Azure CLI đã cài đặt
- Docker đã cài đặt (để build image local nếu cần)
- Git (nếu sử dụng GitHub Actions)

## Tổng quan kiến trúc

```
┌─────────────────┐
│   Frontend      │  Next.js App (Port 3000)
│  (App Service)  │
└────────┬────────┘
         │
         │ API Calls
         │
┌────────▼────────┐
│   Backend       │  Express API (Port 3001)
│  (App Service)  │
└────────┬────────┘
         │
         │ Database Connection
         │
┌────────▼────────┐
│   MySQL         │  Azure Database for MySQL
│  (Flexible)     │
└─────────────────┘
```

---

## Phần 1: Deploy Backend

### 1.1. Tạo Azure Container Registry (ACR) - Nếu chưa có

```bash
# Login vào Azure
az login

# Tạo resource group
az group create --name doctor-care-rg --location eastus

# Tạo Azure Container Registry
az acr create --resource-group doctor-care-rg --name doctorcareregistry --sku Basic
```

### 1.2. Build và Push Docker Image Backend lên ACR

```bash
# Di chuyển vào thư mục backend
cd backend

# Login vào ACR
az acr login --name doctorcareregistry

# Build image
docker build -t doctorcareregistry.azurecr.io/doctor-care-backend:latest .

# Push image lên ACR
docker push doctorcareregistry.azurecr.io/doctor-care-backend:latest
```

### 1.3. Tạo Azure Database for MySQL

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

### 1.4. Tạo Azure App Service cho Backend

```bash
# Tạo App Service Plan (có thể dùng chung với frontend)
az appservice plan create \
  --name doctor-care-plan \
  --resource-group doctor-care-rg \
  --is-linux \
  --sku B1

# Tạo Web App với container cho backend
az webapp create \
  --resource-group doctor-care-rg \
  --plan doctor-care-plan \
  --name doctor-care-backend \
  --deployment-container-image-name doctorcareregistry.azurecr.io/doctor-care-backend:latest

# Lấy ACR password
ACR_PASSWORD=$(az acr credential show --name doctorcareregistry --query "passwords[0].value" --output tsv)

# Cấu hình container registry credentials
az webapp config container set \
  --name doctor-care-backend \
  --resource-group doctor-care-rg \
  --docker-custom-image-name doctorcareregistry.azurecr.io/doctor-care-backend:latest \
  --docker-registry-server-url https://doctorcareregistry.azurecr.io \
  --docker-registry-server-user doctorcareregistry \
  --docker-registry-server-password $ACR_PASSWORD

# Cấu hình environment variables cho backend
# LƯU Ý: Thay thế các giá trị sau bằng giá trị thực tế của bạn
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
    JWT_SECRET=your-super-secret-jwt-key-here-change-this \
    FRONTEND_URL=https://doctor-care-frontend.azurewebsites.net \
    GEMINI_API_KEY=your_gemini_api_key_here

# Bật WebSockets cho Socket.io
az webapp config set \
  --resource-group doctor-care-rg \
  --name doctor-care-backend \
  --web-sockets-enabled true
```

### 1.5. Cấu hình Firewall cho MySQL

```bash
# Cho phép Azure services truy cập MySQL
az mysql flexible-server firewall-rule create \
  --resource-group doctor-care-rg \
  --name doctor-care-mysql \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Cho phép IP của bạn (để test và chạy migrations)
az mysql flexible-server firewall-rule create \
  --resource-group doctor-care-rg \
  --name doctor-care-mysql \
  --rule-name AllowMyIP \
  --start-ip-address YOUR_IP_ADDRESS \
  --end-ip-address YOUR_IP_ADDRESS
```

### 1.6. Chạy Database Migrations

```bash
# Kết nối vào MySQL và chạy scripts
cd backend

mysql -h doctor-care-mysql.mysql.database.azure.com \
  -u adminuser \
  -p \
  medbooking < setup-complete-db.sql

mysql -h doctor-care-mysql.mysql.database.azure.com \
  -u adminuser \
  -p \
  medbooking < chat-schema.sql
```

---

## Phần 2: Deploy Frontend

### 2.1. Build và Push Docker Image Frontend lên ACR

```bash
# Di chuyển vào thư mục frontend
cd frontend

# Login vào ACR (nếu chưa login)
az acr login --name doctorcareregistry

# Build image
docker build -t doctorcareregistry.azurecr.io/doctor-care-frontend:latest .

# Push image lên ACR
docker push doctorcareregistry.azurecr.io/doctor-care-frontend:latest
```

### 2.2. Tạo Azure App Service cho Frontend

```bash
# Tạo Web App với container cho frontend (dùng chung App Service Plan)
az webapp create \
  --resource-group doctor-care-rg \
  --plan doctor-care-plan \
  --name doctor-care-frontend \
  --deployment-container-image-name doctorcareregistry.azurecr.io/doctor-care-frontend:latest

# Lấy ACR password (nếu chưa có)
ACR_PASSWORD=$(az acr credential show --name doctorcareregistry --query "passwords[0].value" --output tsv)

# Cấu hình container registry credentials
az webapp config container set \
  --name doctor-care-frontend \
  --resource-group doctor-care-rg \
  --docker-custom-image-name doctorcareregistry.azurecr.io/doctor-care-frontend:latest \
  --docker-registry-server-url https://doctorcareregistry.azurecr.io \
  --docker-registry-server-user doctorcareregistry \
  --docker-registry-server-password $ACR_PASSWORD

# Lấy backend URL
BACKEND_URL=$(az webapp show --name doctor-care-backend --resource-group doctor-care-rg --query "defaultHostName" -o tsv)

# Cấu hình environment variables cho frontend
az webapp config appsettings set \
  --resource-group doctor-care-rg \
  --name doctor-care-frontend \
  --settings \
    NEXT_PUBLIC_API_URL=https://${BACKEND_URL}/api \
    NODE_ENV=production
```

### 2.3. Cấu hình Custom Domain (Tùy chọn)

```bash
# Thêm custom domain cho frontend
az webapp config hostname add \
  --webapp-name doctor-care-frontend \
  --resource-group doctor-care-rg \
  --hostname yourdomain.com

# Thêm custom domain cho backend
az webapp config hostname add \
  --webapp-name doctor-care-backend \
  --resource-group doctor-care-rg \
  --hostname api.yourdomain.com
```

---

## Phần 3: Cấu hình bổ sung

### 3.1. Cập nhật CORS trong Backend

Sau khi deploy frontend, cần cập nhật `FRONTEND_URL` trong backend:

```bash
# Lấy frontend URL
FRONTEND_URL=$(az webapp show --name doctor-care-frontend --resource-group doctor-care-rg --query "defaultHostName" -o tsv)

# Cập nhật FRONTEND_URL trong backend
az webapp config appsettings set \
  --resource-group doctor-care-rg \
  --name doctor-care-backend \
  --settings FRONTEND_URL=https://${FRONTEND_URL}
```

### 3.2. Cấu hình SSL/TLS

Azure App Service tự động cung cấp SSL certificate cho domain `.azurewebsites.net`. Nếu sử dụng custom domain, cần cấu hình SSL:

```bash
# Enable HTTPS only
az webapp update \
  --name doctor-care-frontend \
  --resource-group doctor-care-rg \
  --https-only true

az webapp update \
  --name doctor-care-backend \
  --resource-group doctor-care-rg \
  --https-only true
```

### 3.3. Cấu hình Continuous Deployment (Tùy chọn)

#### Option A: GitHub Actions

Tạo file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Azure

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
      - name: Build and push backend
        run: |
          cd backend
          az acr build --registry doctorcareregistry --image doctor-care-backend:latest .
      - name: Restart backend
        run: |
          az webapp restart --name doctor-care-backend --resource-group doctor-care-rg

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
      - name: Build and push frontend
        run: |
          cd frontend
          az acr build --registry doctorcareregistry --image doctor-care-frontend:latest .
      - name: Restart frontend
        run: |
          az webapp restart --name doctor-care-frontend --resource-group doctor-care-rg
```

#### Option B: Azure Container Registry Build

```bash
# Build trực tiếp trên ACR (không cần Docker local)
az acr build --registry doctorcareregistry \
  --image doctor-care-backend:latest \
  --file backend/Dockerfile \
  backend/

az acr build --registry doctorcareregistry \
  --image doctor-care-frontend:latest \
  --file frontend/Dockerfile \
  frontend/
```

---

## Phần 4: Kiểm tra và Monitoring

### 4.1. Kiểm tra Logs

```bash
# Xem logs backend
az webapp log tail --name doctor-care-backend --resource-group doctor-care-rg

# Xem logs frontend
az webapp log tail --name doctor-care-frontend --resource-group doctor-care-rg

# Bật logging
az webapp log config \
  --name doctor-care-backend \
  --resource-group doctor-care-rg \
  --application-logging filesystem \
  --level verbose

az webapp log config \
  --name doctor-care-frontend \
  --resource-group doctor-care-rg \
  --application-logging filesystem \
  --level verbose
```

### 4.2. Kiểm tra Health

```bash
# Test backend health endpoint
curl https://doctor-care-backend.azurewebsites.net/api/health

# Test frontend
curl https://doctor-care-frontend.azurewebsites.net
```

### 4.3. Xem Application Insights (Nếu có)

```bash
# Tạo Application Insights
az monitor app-insights component create \
  --app doctor-care-insights \
  --location eastus \
  --resource-group doctor-care-rg

# Kết nối với App Service
az monitor app-insights component connect-webapp \
  --app doctor-care-insights \
  --resource-group doctor-care-rg \
  --web-app doctor-care-backend
```

---

## Phần 5: Troubleshooting

### Backend Issues

1. **Container không start**
   ```bash
   # Kiểm tra logs
   az webapp log tail --name doctor-care-backend --resource-group doctor-care-rg
   
   # Kiểm tra environment variables
   az webapp config appsettings list --name doctor-care-backend --resource-group doctor-care-rg
   ```

2. **Database connection failed**
   ```bash
   # Kiểm tra firewall rules
   az mysql flexible-server firewall-rule list \
     --resource-group doctor-care-rg \
     --name doctor-care-mysql
   
   # Test connection từ local
   mysql -h doctor-care-mysql.mysql.database.azure.com -u adminuser -p
   ```

3. **CORS errors**
   - Đảm bảo `FRONTEND_URL` trong backend trỏ đúng đến frontend URL
   - Kiểm tra format: `https://doctor-care-frontend.azurewebsites.net` (không có trailing slash)

4. **Socket.io không hoạt động**
   ```bash
   # Bật WebSockets
   az webapp config set \
     --resource-group doctor-care-rg \
     --name doctor-care-backend \
     --web-sockets-enabled true
   ```

### Frontend Issues

1. **Build failed**
   - Kiểm tra `next.config.mjs` có `output: 'standalone'`
   - Kiểm tra Dockerfile có đúng cấu trúc

2. **API calls failed**
   - Kiểm tra `NEXT_PUBLIC_API_URL` trong App Settings
   - Đảm bảo backend đã chạy và accessible
   - Kiểm tra CORS settings trong backend

3. **Static files không load**
   - Kiểm tra `.next/static` được copy đúng trong Dockerfile
   - Kiểm tra `public` folder được copy

### Common Issues

1. **Image pull failed**
   ```bash
   # Kiểm tra ACR credentials
   az acr credential show --name doctorcareregistry
   
   # Update credentials trong App Service
   az webapp config container set \
     --name doctor-care-backend \
     --resource-group doctor-care-rg \
     --docker-registry-server-password <NEW_PASSWORD>
   ```

2. **Out of memory**
   - Upgrade App Service Plan lên tier cao hơn (B2, S1, etc.)
   - Tối ưu Docker image size

---

## Phần 6: Chi phí ước tính

### Tài nguyên cơ bản (tháng)

- **Azure Container Registry Basic**: ~$5
- **Azure Database for MySQL (Burstable B1ms)**: ~$12-15
- **Azure App Service Plan (B1) - Shared**: ~$13
  - Backend App Service: $0 (dùng chung plan)
  - Frontend App Service: $0 (dùng chung plan)
- **Bandwidth**: ~$0-5 (tùy usage)

**Tổng ước tính**: ~$30-35/tháng

### Tối ưu chi phí

1. Sử dụng chung App Service Plan cho cả frontend và backend
2. Sử dụng MySQL Burstable tier cho development
3. Tắt các services không cần thiết khi không dùng
4. Sử dụng Azure Dev/Test pricing nếu đủ điều kiện

---

## Phần 7: Best Practices

1. **Security**
   - Sử dụng Azure Key Vault cho secrets
   - Enable HTTPS only
   - Sử dụng Managed Identity khi có thể
   - Regular security updates

2. **Performance**
   - Enable CDN cho static assets
   - Sử dụng Redis Cache nếu cần
   - Optimize Docker images
   - Enable compression

3. **Monitoring**
   - Setup Application Insights
   - Configure alerts
   - Regular log review
   - Performance monitoring

4. **Backup**
   - Enable automated backups cho MySQL
   - Backup App Service configurations
   - Document recovery procedures

---

## Phần 8: Scripts tự động hóa

### Deploy script (deploy.sh)

```bash
#!/bin/bash

# Configuration
RESOURCE_GROUP="doctor-care-rg"
ACR_NAME="doctorcareregistry"
BACKEND_APP="doctor-care-backend"
FRONTEND_APP="doctor-care-frontend"
MYSQL_SERVER="doctor-care-mysql"

# Colors
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}Building and pushing backend...${NC}"
cd backend
az acr build --registry $ACR_NAME --image doctor-care-backend:latest .
cd ..

echo -e "${GREEN}Building and pushing frontend...${NC}"
cd frontend
az acr build --registry $ACR_NAME --image doctor-care-frontend:latest .
cd ..

echo -e "${GREEN}Restarting backend...${NC}"
az webapp restart --name $BACKEND_APP --resource-group $RESOURCE_GROUP

echo -e "${GREEN}Restarting frontend...${NC}"
az webapp restart --name $FRONTEND_APP --resource-group $RESOURCE_GROUP

echo -e "${GREEN}Deployment completed!${NC}"
```

---

## Liên kết hữu ích

- [Azure App Service Documentation](https://docs.microsoft.com/azure/app-service/)
- [Azure Container Registry Documentation](https://docs.microsoft.com/azure/container-registry/)
- [Azure Database for MySQL Documentation](https://docs.microsoft.com/azure/mysql/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

## Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
1. Azure Portal → App Services → Logs
2. Azure Portal → Container Registry → Repositories
3. Azure Portal → MySQL → Connection strings
4. Azure CLI logs: `az webapp log tail`


