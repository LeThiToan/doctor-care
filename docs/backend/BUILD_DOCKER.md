# Hướng dẫn Build Docker Image cho Backend

## Cách 1: Build thủ công (Khuyến nghị)

### Trên Windows (PowerShell hoặc CMD)

```powershell
# Di chuyển vào thư mục backend
cd backend

# Build Docker image
docker build -t doctor-care-backend:latest .

# Kiểm tra image đã build thành công
docker images doctor-care-backend
```

### Trên Linux/Mac

```bash
# Di chuyển vào thư mục backend
cd backend

# Build Docker image
docker build -t doctor-care-backend:latest .

# Kiểm tra image đã build thành công
docker images doctor-care-backend
```

## Cách 2: Sử dụng script tự động

### Windows
```cmd
cd backend
build-docker.bat
```

Hoặc với tag tùy chỉnh:
```cmd
build-docker.bat v1.0.0
```

### Linux/Mac
```bash
cd backend
./build-docker.sh
```

Hoặc với tag tùy chỉnh:
```bash
./build-docker.sh v1.0.0
```

## Cách 3: Build và push trực tiếp lên Azure Container Registry

```bash
# Login vào Azure
az login

# Login vào ACR
az acr login --name doctorcareregistry

# Build và push trực tiếp lên ACR (không cần Docker local)
az acr build --registry doctorcareregistry \
  --image doctor-care-backend:latest \
  --file Dockerfile \
  .
```

## Kiểm tra image sau khi build

```bash
# Xem danh sách images
docker images | grep doctor-care-backend

# Xem chi tiết image
docker inspect doctor-care-backend:latest

# Test chạy image local (nếu có file .env)
docker run -p 3001:3001 --env-file .env doctor-care-backend:latest
```

## Tag image cho Azure Container Registry

Nếu muốn push lên ACR sau khi build local:

```bash
# Tag image
docker tag doctor-care-backend:latest doctorcareregistry.azurecr.io/doctor-care-backend:latest

# Login vào ACR
az acr login --name doctorcareregistry

# Push image
docker push doctorcareregistry.azurecr.io/doctor-care-backend:latest
```

## Troubleshooting

### Lỗi: "Cannot connect to the Docker daemon"
- Đảm bảo Docker Desktop đang chạy
- Kiểm tra: `docker info`

### Lỗi: "No space left on device"
- Dọn dẹp Docker: `docker system prune -a`
- Xóa images không dùng: `docker image prune -a`

### Lỗi build TypeScript
- Kiểm tra `tsconfig.json` có đúng không
- Kiểm tra `package.json` có script `build` không
- Chạy build local trước: `npm run build`

### Image quá lớn
- Sử dụng multi-stage build (đã có trong Dockerfile)
- Kiểm tra `.dockerignore` đã loại trừ đúng files chưa

## Cấu trúc Dockerfile

Dockerfile sử dụng multi-stage build:
1. **Builder stage**: Build TypeScript sang JavaScript
2. **Production stage**: Chỉ copy files cần thiết, giảm kích thước image

## Environment Variables

Khi chạy container, cần cung cấp các biến môi trường:

```bash
docker run -p 3001:3001 \
  -e PORT=3001 \
  -e DB_HOST=your-db-host \
  -e DB_USER=your-db-user \
  -e DB_PASSWORD=your-db-password \
  -e DB_NAME=medbooking \
  -e JWT_SECRET=your-jwt-secret \
  -e FRONTEND_URL=https://your-frontend-url \
  -e GEMINI_API_KEY=your-gemini-key \
  doctor-care-backend:latest
```

Hoặc sử dụng file `.env`:
```bash
docker run -p 3001:3001 --env-file .env doctor-care-backend:latest
```

## Kích thước image mong đợi

- Image sau khi build: ~150-200 MB (với Alpine Linux)
- Nếu lớn hơn 300MB, kiểm tra lại `.dockerignore`

