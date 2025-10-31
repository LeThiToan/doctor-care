#!/bin/bash

echo "Starting Doctor Care Development Environment..."

echo ""
echo "Starting Backend..."
cd backend && npm run dev &
BACKEND_PID=$!

echo ""
echo "Starting Frontend..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "Both servers are starting..."
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait $BACKEND_PID $FRONTEND_PID
