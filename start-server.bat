@echo off
echo ========================================
echo Starting Google AI MCP Server
echo ========================================
echo.
echo Step 1: Building the project...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed! Try running rebuild.bat first.
    pause
    exit /b 1
)
echo.
echo Step 2: Starting the server...
echo.
echo The server will run in this window.
echo To test image generation, open a NEW terminal and run:
echo   node test-imagen-save.js
echo.
echo Press Ctrl+C to stop the server.
echo ========================================
npm start
