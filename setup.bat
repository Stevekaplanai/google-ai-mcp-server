@echo off
REM Setup script for Google AI MCP Server (Windows)

echo 🚀 Google AI MCP Server Setup
echo ============================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% detected

REM Install dependencies
echo.
echo 📦 Installing dependencies...
call npm install

REM Build the project
echo.
echo 🔨 Building the project...
call npm run build

REM Create .env file if it doesn't exist
if not exist .env (
    echo.
    echo 📝 Creating .env file...
    copy .env.example .env >nul
    echo ✅ .env file created from template
)

REM Test the build
echo.
echo 🧪 Testing the build...
if exist dist\index.js (
    echo ✅ Build successful!
) else (
    echo ❌ Build failed. Check for errors above.
    exit /b 1
)

REM Display next steps
echo.
echo ✨ Setup complete!
echo.
echo Next steps:
echo 1. Configure your Google Cloud credentials in .env
echo 2. Test with mock mode: set USE_MOCK=true ^&^& npm start
echo 3. Configure Claude Desktop (see README.md)
echo.
echo Quick test commands:
echo   npm run dev     - Run in development mode
echo   npm test        - Run tests
echo   npm start       - Start the server
echo.
echo For interactive testing:
echo   node test-server.js
echo.
pause
