@echo off
echo Starting Doctor Care Development Environment...

echo.
echo Starting Backend...
start "Backend" cmd /k "cd backend && npm run dev"

echo.
echo Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
pause
