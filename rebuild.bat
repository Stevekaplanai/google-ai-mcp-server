@echo off
echo Cleaning and rebuilding...
cd C:\Users\steve\Desktop\google-ai-mcp-server
if exist dist rmdir /s /q dist
npm run build
echo Build complete!
