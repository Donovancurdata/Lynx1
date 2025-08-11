@echo off
echo 🚀 Starting LYNX Services...
echo.

echo 📦 Installing backend dependencies...
cd backend
call npm install
echo.

echo 🔧 Starting backend server...
start "LYNX Backend" cmd /k "npm run consolidated"
echo.

echo 🤖 Starting intelligent agent...
cd ../agents/intelligent-agent
call npm install
start "LYNX Intelligent Agent" cmd /k "npm start"
echo.

echo ✅ Both services started!
echo.
echo 📱 Now start the frontend in a new terminal:
echo    cd frontend
echo    npm run dev
echo.

pause
