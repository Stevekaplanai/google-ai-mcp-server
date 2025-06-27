@echo off
echo ===========================================
echo Google AI MCP Server - Windows Setup
echo ===========================================
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/5] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/5] Building TypeScript...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Failed to build TypeScript
    pause
    exit /b 1
)

echo.
echo [3/5] Creating .env file from example...
if not exist .env (
    copy .env.example .env
    echo Created .env file. Please edit it with your Google Cloud credentials.
) else (
    echo .env file already exists, skipping...
)

echo.
echo [4/5] Testing server in mock mode...
set USE_MOCK=true
node test-server.js
if %errorlevel% neq 0 (
    echo ERROR: Server test failed
    pause
    exit /b 1
)

echo.
echo [5/5] Setup complete!
echo.
echo ===========================================
echo NEXT STEPS:
echo ===========================================
echo 1. Edit .env file with your Google Cloud credentials
echo 2. Configure Claude Desktop:
echo    - Open: %%APPDATA%%\Claude\claude_desktop_config.json
echo    - Add the server configuration (see README.md)
echo 3. Restart Claude Desktop
echo.
echo To test the server manually:
echo   npm start          (production mode)
echo   npm run dev        (development mode with auto-reload)
echo.
echo ===========================================
pause
