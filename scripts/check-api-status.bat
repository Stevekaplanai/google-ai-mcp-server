@echo off
echo ========================================
echo Checking Vertex AI API Status
echo ========================================
echo.

set PROJECT_ID=starry-center-464218-r3

echo Checking if Vertex AI API is enabled...
gcloud services list --enabled --filter="config.name:aiplatform.googleapis.com" --project=%PROJECT_ID% --format="table(config.name,state)"

echo.
echo Checking service account permissions...
gcloud projects get-iam-policy %PROJECT_ID% --flatten="bindings[].members" --format="table(bindings.role)" --filter="bindings.members:google-ai-mcp-server-service-a@starry-center-464218-r3.iam.gserviceaccount.com"

echo.
echo ========================================
echo If aiplatform.googleapis.com is not listed above,
echo run: scripts\enable-vertex-ai.bat
echo ========================================
pause
