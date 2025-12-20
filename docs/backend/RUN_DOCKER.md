# Hướng dẫn chạy Docker Container cho Backend

## Lưu ý quan trọng

File `.env` đã được tạo từ `env.example`. **Bạn cần cập nhật các giá trị trong file `.env`** trước khi chạy container, đặc biệt là:
- `DB_HOST`: Địa chỉ database
- `DB_USER`: Username database  
- `DB_PASSWORD`: Password database
- `JWT_SECRET`: Secret key cho JWT (nên đổi thành giá trị mạnh)
- `GEMINI_API_KEY`: API key cho Gemini (nếu có)

## Cách 1: Chạy với file .env

```powershell
# Đảm bảo đang ở thư mục backend
cd D:\DTDM\doctor-care\backend

# Chạy container
docker run -p 3001:3001 --env-file .env doctor-care-backend:latest
```

## Cách 2: Chạy với environment variables trực tiếp

```powershell
docker run -p 3001:3001 `
  -e PORT=3001 `
  -e DB_HOST=localhost `
  -e DB_USER=root `
  -e DB_PASSWORD=yourpassword `
  -e DB_NAME=medbooking `
  -e DB_SSL=false `
  -e JWT_SECRET=your-secret-key `
  -e FRONTEND_URL=http://localhost:3000 `
  doctor-care-backend:latest
```

## Cách 3: Chạy ở chế độ detached (background)

```powershell
docker run -d -p 3001:3001 --env-file .env --name doctor-care-backend doctor-care-backend:latest
```

## Kiểm tra container đang chạy

```powershell
# Xem danh sách containers
docker ps

# Xem logs
docker logs doctor-care-backend

# Xem logs real-time
docker logs -f doctor-care-backend
```

## Dừng và xóa container

```powershell
# Dừng container
docker stop doctor-care-backend

# Xóa container
docker rm doctor-care-backend

# Hoặc dừng và xóa cùng lúc
docker rm -f doctor-care-backend
```

## Troubleshooting

### Container không start hoặc crash ngay lập tức

1. **Kiểm tra logs:**
   ```powershell
   docker logs doctor-care-backend
   ```

2. **Lỗi kết nối database:**
   - Đảm bảo database đang chạy
   - Kiểm tra `DB_HOST`, `DB_USER`, `DB_PASSWORD` trong `.env`
   - Nếu dùng MySQL local, đảm bảo MySQL service đang chạy

3. **Lỗi port đã được sử dụng:**
   ```powershell
   # Kiểm tra port 3001 có đang được dùng không
   netstat -ano | findstr :3001
   
   # Hoặc dùng port khác
   docker run -p 3002:3001 --env-file .env doctor-care-backend:latest
   ```

4. **Test kết nối database từ container:**
   ```powershell
   # Vào trong container
   docker exec -it doctor-care-backend sh
   
   # Test kết nối (nếu có mysql client)
   mysql -h $DB_HOST -u $DB_USER -p
   ```

## Test API sau khi container chạy

```powershell
# Test health endpoint
curl http://localhost:3001/api/health

# Hoặc dùng browser
# Mở: http://localhost:3001/api/health
```

## Chạy với docker-compose (nếu có)

Nếu bạn có file `docker-compose.yml`:

```powershell
docker-compose up
```

## Lưu ý khi deploy lên Azure

Khi deploy lên Azure, bạn không cần file `.env` vì environment variables sẽ được cấu hình trong Azure App Service settings.

