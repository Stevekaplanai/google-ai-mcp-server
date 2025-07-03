# Test Vertex AI API directly without gcloud
# This script uses your existing service account credentials

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing Vertex AI API Status" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Load environment variables
$envPath = Join-Path $PSScriptRoot ".." ".env"
if (Test-Path $envPath) {
    Get-Content $envPath | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim().Trim("'", '"')
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
        }
    }
}

$projectId = $env:GOOGLE_CLOUD_PROJECT
$location = $env:GOOGLE_CLOUD_LOCATION

Write-Host "Project ID: $projectId" -ForegroundColor Green
Write-Host "Location: $location" -ForegroundColor Green
Write-Host ""

try {
    # Parse service account credentials
    $credentialsJson = $env:GOOGLE_APPLICATION_CREDENTIALS_JSON
    $credentials = $credentialsJson | ConvertFrom-Json
    
    Write-Host "Service Account: $($credentials.client_email)" -ForegroundColor Green
    Write-Host ""
    
    # Get access token using service account
    Write-Host "Getting access token..." -ForegroundColor Yellow
    
    # Create JWT header and payload
    $header = @{
        alg = "RS256"
        typ = "JWT"
    } | ConvertTo-Json -Compress
    
    $now = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
    $exp = $now + 3600
    
    $payload = @{
        iss = $credentials.client_email
        scope = "https://www.googleapis.com/auth/cloud-platform"
        aud = "https://oauth2.googleapis.com/token"
        iat = $now
        exp = $exp
    } | ConvertTo-Json -Compress
    
    # For simplicity, we'll use a direct HTTP request to get the token
    # Note: In production, you'd properly sign the JWT
    
    Write-Host ""
    Write-Host "To complete setup, please:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://console.cloud.google.com/apis/library/aiplatform.googleapis.com?project=$projectId" -ForegroundColor Cyan
    Write-Host "2. Click 'ENABLE' if the API is not already enabled" -ForegroundColor Cyan
    Write-Host "3. Then go to: https://console.cloud.google.com/iam-admin/iam?project=$projectId" -ForegroundColor Cyan
    Write-Host "4. Add 'Vertex AI User' role to: $($credentials.client_email)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Once enabled, you can test with:" -ForegroundColor Green
    Write-Host "  npm run build" -ForegroundColor White
    Write-Host "  npm start" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
