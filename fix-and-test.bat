@echo off
echo Fixing and testing Google AI MCP Server...
echo.
echo Step 1: Cleaning old build...
if exist dist rmdir /s /q dist
echo.
echo Step 2: Rebuilding with fixes...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    echo Run 'diagnose.js' to check your setup
    pause
    exit /b 1
)
echo ✅ Build successful!
echo.
echo Step 3: Testing image generation...
node test-imagen-save.js
echo.
echo If you see an error above, run:
echo   node diagnose.js
echo.
pause
