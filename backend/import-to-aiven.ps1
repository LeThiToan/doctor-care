# Script để import database vào Aiven MySQL
# Usage: .\import-to-aiven.ps1

param(
    [string]$DB_HOST = "",
    [string]$DB_PORT = "3306",
    [string]$DB_USER = "",
    [string]$DB_PASSWORD = "",
    [string]$DB_NAME = "medbooking",
    [string]$SQL_FILE = "setup-complete-db.sql"
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Import Database to Aiven MySQL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get credentials if not provided
if ([string]::IsNullOrEmpty($DB_HOST)) {
    $DB_HOST = Read-Host "Enter Aiven MySQL Host (e.g., your-service.a.aivencloud.com)"
}

if ([string]::IsNullOrEmpty($DB_USER)) {
    $DB_USER = Read-Host "Enter Aiven MySQL Username (usually 'avnadmin')"
}

if ([string]::IsNullOrEmpty($DB_PASSWORD)) {
    $securePassword = Read-Host "Enter Aiven MySQL Password" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
    $DB_PASSWORD = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
}

# Check if MySQL client is available
$mysqlCmd = Get-Command mysql -ErrorAction SilentlyContinue
if (-not $mysqlCmd) {
    Write-Host "❌ MySQL client not found in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install MySQL client or add it to PATH:" -ForegroundColor Yellow
    Write-Host "1. Download MySQL: https://dev.mysql.com/downloads/mysql/" -ForegroundColor Gray
    Write-Host "2. Or use XAMPP MySQL: C:\xampp\mysql\bin\mysql.exe" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Alternative: Use MySQL Workbench or phpMyAdmin" -ForegroundColor Yellow
    exit 1
}

# Check if SQL file exists
if (-not (Test-Path $SQL_FILE)) {
    Write-Host "❌ SQL file not found: $SQL_FILE" -ForegroundColor Red
    exit 1
}

Write-Host "Connecting to Aiven MySQL..." -ForegroundColor Yellow
Write-Host "  Host: $DB_HOST" -ForegroundColor Gray
Write-Host "  Port: $DB_PORT" -ForegroundColor Gray
Write-Host "  User: $DB_USER" -ForegroundColor Gray
Write-Host "  Database: $DB_NAME" -ForegroundColor Gray
Write-Host ""

# Test connection first (Aiven requires SSL)
Write-Host "Testing connection (with SSL)..." -ForegroundColor Yellow
$testResult = mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASSWORD --ssl-mode=REQUIRED -e "SELECT 1;" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Connection failed!" -ForegroundColor Red
    Write-Host $testResult -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check:" -ForegroundColor Yellow
    Write-Host "1. Aiven service is running" -ForegroundColor Gray
    Write-Host "2. Your IP is whitelisted in Aiven firewall" -ForegroundColor Gray
    Write-Host "3. Credentials are correct" -ForegroundColor Gray
    Write-Host "4. SSL connection is enabled (Aiven requires SSL)" -ForegroundColor Gray
    exit 1
}

Write-Host "✓ Connection successful!" -ForegroundColor Green
Write-Host ""

# Create database if not exists (with SSL)
Write-Host "Creating database if not exists..." -ForegroundColor Yellow
mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASSWORD --ssl-mode=REQUIRED -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Database ready" -ForegroundColor Green
} else {
    Write-Host "⚠️  Database creation warning (may already exist)" -ForegroundColor Yellow
}

Write-Host ""

# Import SQL file (with SSL)
Write-Host "Importing SQL file: $SQL_FILE" -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray
Write-Host ""

# Use Get-Content and pipe to mysql for better error handling
$importResult = Get-Content $SQL_FILE | mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASSWORD --ssl-mode=REQUIRED $DB_NAME 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Database imported successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Update your .env file with Aiven credentials:" -ForegroundColor White
    Write-Host "   DB_HOST=$DB_HOST" -ForegroundColor Gray
    Write-Host "   DB_PORT=$DB_PORT" -ForegroundColor Gray
    Write-Host "   DB_USER=$DB_USER" -ForegroundColor Gray
    Write-Host "   DB_PASSWORD=your_password" -ForegroundColor Gray
    Write-Host "   DB_NAME=$DB_NAME" -ForegroundColor Gray
    Write-Host "   DB_SSL=true" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Restart your backend server" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ Import failed!" -ForegroundColor Red
    Write-Host $importResult -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "- SSL connection is required for Aiven" -ForegroundColor Gray
    Write-Host "- Check if all tables already exist (may need to drop and recreate)" -ForegroundColor Gray
    Write-Host "- Verify SQL file syntax" -ForegroundColor Gray
    Write-Host "- Make sure your IP is whitelisted in Aiven firewall" -ForegroundColor Gray
    exit 1
}

