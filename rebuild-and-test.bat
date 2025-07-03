@echo off
echo Rebuilding project with fixes...
cd C:\Users\steve\Desktop\google-ai-mcp-server
if exist dist rmdir /s /q dist
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)
echo.
echo Build successful! Now testing image generation...
echo.
node test-imagen-save.js
pause
