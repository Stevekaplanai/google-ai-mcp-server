@echo off
echo ========================================
echo Direct Vertex AI API Enable Link
echo ========================================
echo.
echo Since gcloud is not installed, please enable the API manually:
echo.
echo 1. Open your browser and go to this link:
echo.
echo    https://console.cloud.google.com/apis/library/aiplatform.googleapis.com?project=starry-center-464218-r3
echo.
echo 2. Click the "ENABLE" button
echo.
echo 3. Wait 1-2 minutes for it to activate
echo.
echo 4. Then add permissions here:
echo    https://console.cloud.google.com/iam-admin/iam?project=starry-center-464218-r3
echo.
echo    Add "Vertex AI User" role to:
echo    google-ai-mcp-server-service-a@starry-center-464218-r3.iam.gserviceaccount.com
echo.
echo ========================================
echo After enabling, test your server:
echo.
echo    npm run build
echo    npm start
echo.
echo Then in another terminal:
echo    node test-imagen-real.js
echo ========================================
echo.
pause
