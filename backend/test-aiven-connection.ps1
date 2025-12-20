# Script test kết nối Aiven MySQL
# Usage: .\test-aiven-connection.ps1

param(
    [string]$DB_HOST = "",
    [string]$DB_PORT = "3306",
    [string]$DB_USER = "",
    [string]$DB_PASSWORD = "",
    [string]$DB_NAME = "medbooking"
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Aiven MySQL Connection" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get credentials from .env if not provided
if ([string]::IsNullOrEmpty($DB_HOST)) {
    # Try to read from .env file
    if (Test-Path ".env") {
        $envContent = Get-Content ".env" -Raw
        if ($envContent -match "DB_HOST=(.+)") {
            $DB_HOST = $matches[1].Trim()
        }
        if ($envContent -match "DB_PORT=(.+)") {
            $DB_PORT = $matches[1].Trim()
        }
        if ($envContent -match "DB_USER=(.+)") {
            $DB_USER = $matches[1].Trim()
        }
        if ($envContent -match "DB_PASSWORD=(.+)") {
            $DB_PASSWORD = $matches[1].Trim()
        }
        if ($envContent -match "DB_NAME=(.+)") {
            $DB_NAME = $matches[1].Trim()
        }
    }
    
    # If still empty, ask user
    if ([string]::IsNullOrEmpty($DB_HOST)) {
        $DB_HOST = Read-Host "Enter Aiven MySQL Host"
    }
    if ([string]::IsNullOrEmpty($DB_USER)) {
        $DB_USER = Read-Host "Enter Aiven MySQL Username"
    }
    if ([string]::IsNullOrEmpty($DB_PASSWORD)) {
        $securePassword = Read-Host "Enter Aiven MySQL Password" -AsSecureString
        $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
        $DB_PASSWORD = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    }
}

# Get current IP
$currentIP = (Invoke-WebRequest -Uri "https://api.ipify.org" -UseBasicParsing).Content
Write-Host "Your current IP: $currentIP" -ForegroundColor Cyan
Write-Host ""

# Check if MySQL client is available
$mysqlCmd = Get-Command mysql -ErrorAction SilentlyContinue
if (-not $mysqlCmd) {
    Write-Host "[ERROR] MySQL client not found" -ForegroundColor Red
    Write-Host "Please install MySQL client or use XAMPP MySQL" -ForegroundColor Yellow
    exit 1
}

Write-Host "Testing connection..." -ForegroundColor Yellow
Write-Host "  Host: $DB_HOST" -ForegroundColor Gray
Write-Host "  Port: $DB_PORT" -ForegroundColor Gray
Write-Host "  User: $DB_USER" -ForegroundColor Gray
Write-Host "  Database: $DB_NAME" -ForegroundColor Gray
Write-Host ""

# Test 1: Basic connection
Write-Host "Test 1: Basic connection..." -ForegroundColor Yellow
$test1 = mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASSWORD --ssl-mode=REQUIRED -e "SELECT 1 as test;" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Basic connection successful!" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Basic connection failed!" -ForegroundColor Red
    Write-Host $test1 -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible issues:" -ForegroundColor Yellow
    Write-Host "1. Password is incorrect" -ForegroundColor Gray
    Write-Host "2. IP $currentIP is not whitelisted in Aiven firewall" -ForegroundColor Gray
    Write-Host "3. User '$DB_USER' doesn't have access" -ForegroundColor Gray
    Write-Host ""
    Write-Host "To fix:" -ForegroundColor Yellow
    Write-Host "1. Go to Aiven Console → Your Service → Firewall" -ForegroundColor White
    Write-Host "2. Add IP: $currentIP" -ForegroundColor White
    Write-Host "3. Verify password in Aiven Console → Service credentials" -ForegroundColor White
    exit 1
}

# Test 2: Database access
Write-Host ""
Write-Host "Test 2: Database access..." -ForegroundColor Yellow
$test2 = mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASSWORD --ssl-mode=REQUIRED -D $DB_NAME -e "SHOW TABLES;" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Database access successful!" -ForegroundColor Green
    $tableCount = ($test2 | Measure-Object -Line).Lines - 1
    Write-Host "  Found $tableCount tables" -ForegroundColor Gray
} else {
    Write-Host "[ERROR] Database access failed!" -ForegroundColor Red
    Write-Host $test2 -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible issues:" -ForegroundColor Yellow
    Write-Host "1. Database '$DB_NAME' doesn't exist" -ForegroundColor Gray
    Write-Host "2. User '$DB_USER' doesn't have permission on database '$DB_NAME'" -ForegroundColor Gray
    exit 1
}

# Test 3: Query test
Write-Host ""
Write-Host "Test 3: Query test..." -ForegroundColor Yellow
$test3 = mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASSWORD --ssl-mode=REQUIRED -D $DB_NAME -e "SELECT COUNT(*) as user_count FROM users;" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Query test successful!" -ForegroundColor Green
    Write-Host $test3 -ForegroundColor Gray
} else {
    Write-Host "[WARNING] Query test failed (table might not exist yet)" -ForegroundColor Yellow
    Write-Host $test3 -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "[OK] All connection tests passed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your backend should be able to connect now." -ForegroundColor Green

