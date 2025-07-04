Write-Host "Testing NPM package: @stevekaplanai/google-ai-mcp" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# Test 1: Check package info
Write-Host "`n1. Checking package info..." -ForegroundColor Yellow
npm view @stevekaplanai/google-ai-mcp

# Test 2: Test direct execution
Write-Host "`n2. Testing direct execution with mock mode..." -ForegroundColor Yellow
$env:USE_MOCK = "true"
Start-Process -FilePath "npx" -ArgumentList "@stevekaplanai/google-ai-mcp" -NoNewWindow -PassThru | Out-Null
Start-Sleep -Seconds 2
Write-Host "✓ Server process started" -ForegroundColor Green

Write-Host "`n3. Done!" -ForegroundColor Green
Write-Host "`nPackage URL: https://www.npmjs.com/package/@stevekaplanai/google-ai-mcp" -ForegroundColor Cyan
Write-Host "Smithery URL: https://smithery.ai/server/@Stevekaplanai/google-ai-mcp-server" -ForegroundColor Cyan
