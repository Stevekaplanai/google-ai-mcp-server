@echo off
echo Creating Google Cloud Service Account for MCP Server...
echo.

REM Set project ID
set PROJECT_ID=starry-center-464218-r3

REM Create service account
echo Creating service account...
gcloud iam service-accounts create mcp-vertex-ai --display-name="MCP Vertex AI Service Account" --project=%PROJECT_ID%

REM Grant necessary permissions
echo.
echo Granting permissions...
gcloud projects add-iam-policy-binding %PROJECT_ID% --member="serviceAccount:mcp-vertex-ai@%PROJECT_ID%.iam.gserviceaccount.com" --role="roles/aiplatform.user"

REM Create and download key
echo.
echo Creating service account key...
gcloud iam service-accounts keys create C:\Users\steve\Desktop\google-ai-mcp-server\credentials.json --iam-account=mcp-vertex-ai@%PROJECT_ID%.iam.gserviceaccount.com

echo.
echo ✅ Service account created successfully!
echo Credentials saved to: C:\Users\steve\Desktop\google-ai-mcp-server\credentials.json
echo.
pause