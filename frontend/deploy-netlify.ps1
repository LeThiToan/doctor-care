# Script deploy frontend lên Netlify
# Usage: .\deploy-netlify.ps1

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deploy Frontend to Netlify" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Netlify CLI is installed
$netlifyCmd = Get-Command netlify -ErrorAction SilentlyContinue
if (-not $netlifyCmd) {
    Write-Host "Netlify CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g netlify-cli
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to install Netlify CLI" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Checking Netlify login status..." -ForegroundColor Yellow
netlify status 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Please login to Netlify..." -ForegroundColor Yellow
    netlify login
}

Write-Host ""
Write-Host "Building frontend..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Deploying to Netlify..." -ForegroundColor Yellow
Write-Host ""

# Deploy to production
netlify deploy --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "[OK] Deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Don't forget to set environment variables in Netlify dashboard:" -ForegroundColor Yellow
    Write-Host "  NEXT_PUBLIC_API_URL = your-backend-url/api" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "[ERROR] Deployment failed!" -ForegroundColor Red
    exit 1
}

