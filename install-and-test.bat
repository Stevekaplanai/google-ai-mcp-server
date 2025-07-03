@echo off
echo Installing missing dependencies...
cd C:\Users\steve\Desktop\google-ai-mcp-server
npm install
echo.
echo Dependencies installed! Now rebuilding...
call npm run build
echo.
echo Testing image generation...
node test-imagen-save.js
pause
