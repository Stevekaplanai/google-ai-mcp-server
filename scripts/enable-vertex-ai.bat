@echo off
echo ========================================
echo Enabling Vertex AI API for Google AI MCP
echo ========================================
echo.

set PROJECT_ID=starry-center-464218-r3
set SERVICE_ACCOUNT=google-ai-mcp-server-service-a@starry-center-464218-r3.iam.gserviceaccount.com

echo Project ID: %PROJECT_ID%
echo Service Account: %SERVICE_ACCOUNT%
echo.

echo Step 1: Enabling Vertex AI API...
call gcloud services enable aiplatform.googleapis.com --project=%PROJECT_ID%
if %errorlevel% neq 0 (
    echo Failed to enable Vertex AI API
    exit /b 1
)
echo ✓ Vertex AI API enabled
echo.

echo Step 2: Adding Vertex AI User role to service account...
call gcloud projects add-iam-policy-binding %PROJECT_ID% ^
  --member="serviceAccount:%SERVICE_ACCOUNT%" ^
  --role="roles/aiplatform.user"
if %errorlevel% neq 0 (
    echo Failed to add Vertex AI User role
    exit /b 1
)
echo ✓ Vertex AI User role added
echo.

echo Step 3: Adding Storage Admin role (for output storage)...
call gcloud projects add-iam-policy-binding %PROJECT_ID% ^
  --member="serviceAccount:%SERVICE_ACCOUNT%" ^
  --role="roles/storage.objectAdmin"
if %errorlevel% neq 0 (
    echo Failed to add Storage Admin role
    exit /b 1
)
echo ✓ Storage Admin role added
echo.

echo Step 4: Verifying enabled APIs...
call gcloud services list --enabled --filter="name:aiplatform" --project=%PROJECT_ID%
echo.

echo ========================================
echo Setup Complete! 
echo You can now use the Imagen API with real calls.
echo ========================================
pause
