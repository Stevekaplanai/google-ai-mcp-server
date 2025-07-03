@echo off
echo ========================================
echo 🔐 PERMISSION FIX NEEDED
echo ========================================
echo.
echo Your service account needs the "Vertex AI User" role.
echo.
echo STEP 1: Open this link in your browser:
echo https://console.cloud.google.com/iam-admin/iam?project=starry-center-464218-r3
echo.
echo STEP 2: Find this email:
echo google-ai-mcp-server-service-a@starry-center-464218-r3.iam.gserviceaccount.com
echo.
echo STEP 3: Click the pencil icon (Edit)
echo.
echo STEP 4: Click "+ ADD ANOTHER ROLE"
echo.
echo STEP 5: Search and select "Vertex AI User"
echo.
echo STEP 6: Click SAVE
echo.
echo STEP 7: Wait 1-2 minutes, then press any key to test again...
pause >nul
echo.
echo Testing image generation...
node test-imagen-save.js
pause
