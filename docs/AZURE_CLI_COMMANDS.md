# Azure CLI Commands - Các Shell Khác Nhau

## Tổng quan

Azure CLI có thể chạy trên nhiều terminal/shell khác nhau. Cú pháp hơi khác nhau tùy shell.

## Cấu hình Email - Cho các Shell

### 1. PowerShell (Windows - mặc định)

**Cách 1: Viết trên 1 dòng (Dễ nhất):**

```powershell
az webapp config appsettings set --resource-group doctor-care-rg --name doctor-care-backend --settings EMAIL_USER=your-email@gmail.com EMAIL_PASS=your-app-password EMAIL_HOST=smtp.gmail.com EMAIL_PORT=587
```

**Cách 2: Dùng backtick `` ` `` để xuống dòng:**

```powershell
az webapp config appsettings set `
  --resource-group doctor-care-rg `
  --name doctor-care-backend `
  --settings `
    EMAIL_USER=your-email@gmail.com `
    EMAIL_PASS=your-app-password `
    EMAIL_HOST=smtp.gmail.com `
    EMAIL_PORT=587
```

### 2. Command Prompt (CMD - Windows)

```cmd
az webapp config appsettings set --resource-group doctor-care-rg --name doctor-care-backend --settings EMAIL_USER=your-email@gmail.com EMAIL_PASS=your-app-password EMAIL_HOST=smtp.gmail.com EMAIL_PORT=587
```

**Lưu ý:** CMD không hỗ trợ xuống dòng với `\`, phải viết trên 1 dòng.

### 3. Git Bash (Windows)

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

### 4. WSL (Windows Subsystem for Linux)

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

### 5. Linux/Mac Terminal

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

## So sánh các Shell

| Shell | Xuống dòng | Ví dụ |
|-------|-----------|-------|
| **PowerShell** | Backtick `` ` `` | ``command ` <br>--option`` |
| **CMD** | Không hỗ trợ | Phải viết 1 dòng |
| **Git Bash** | `\` | `command \` <br>`--option` |
| **Bash/Linux** | `\` | `command \` <br>`--option` |
| **WSL** | `\` | `command \` <br>`--option` |

## Các lệnh Azure CLI thường dùng

### Xem logs

**PowerShell:**
```powershell
az webapp log tail --name doctor-care-backend --resource-group doctor-care-rg
```

**Bash/CMD:**
```bash
az webapp log tail --name doctor-care-backend --resource-group doctor-care-rg
```

### Restart backend

**Tất cả shell:**
```bash
az webapp restart --name doctor-care-backend --resource-group doctor-care-rg
```

### Xem environment variables

**PowerShell:**
```powershell
az webapp config appsettings list --name doctor-care-backend --resource-group doctor-care-rg --output table
```

**Bash:**
```bash
az webapp config appsettings list --name doctor-care-backend --resource-group doctor-care-rg --output table
```

### Update từng biến riêng lẻ

Nếu muốn update từng biến một (dễ hơn):

**PowerShell:**
```powershell
az webapp config appsettings set --resource-group doctor-care-rg --name doctor-care-backend --settings EMAIL_USER=your-email@gmail.com

az webapp config appsettings set --resource-group doctor-care-rg --name doctor-care-backend --settings EMAIL_PASS=your-app-password

az webapp config appsettings set --resource-group doctor-care-rg --name doctor-care-backend --settings EMAIL_HOST=smtp.gmail.com

az webapp config appsettings set --resource-group doctor-care-rg --name doctor-care-backend --settings EMAIL_PORT=587
```

## Kiểm tra bạn đang dùng shell nào

### Windows:

```powershell
# PowerShell
echo $PSVersionTable.PSVersion

# CMD
echo %COMSPEC%

# Git Bash
echo $SHELL
```

### Linux/Mac:

```bash
echo $SHELL
```

## Khuyến nghị

**Dễ nhất:** Viết lệnh trên **1 dòng** (hoạt động với mọi shell):

```bash
az webapp config appsettings set --resource-group doctor-care-rg --name doctor-care-backend --settings EMAIL_USER=your-email@gmail.com EMAIL_PASS=your-app-password EMAIL_HOST=smtp.gmail.com EMAIL_PORT=587
```

## Troubleshooting

### Lỗi: "unrecognized arguments: \"

**Nguyên nhân:** Đang dùng PowerShell nhưng dùng cú pháp bash (`\`)

**Fix:** 
- Viết trên 1 dòng, hoặc
- Dùng backtick `` ` `` thay vì `\`

### Lỗi: "command not found: az"

**Nguyên nhân:** Azure CLI chưa được cài đặt

**Fix:**
- Windows: `winget install -e --id Microsoft.AzureCLI`
- Mac: `brew install azure-cli`
- Linux: Xem [Azure CLI Installation](https://docs.microsoft.com/cli/azure/install-azure-cli)

### Lỗi: "Please run 'az login'"

**Fix:**
```bash
az login
```

---

**Vậy trả lời câu hỏi: CÓ, bạn có thể chạy trên terminal! Chỉ cần chọn đúng cú pháp cho shell bạn đang dùng.** ✅

