@echo off
echo ====================================
echo NPM Publishing Script for Google AI MCP Server
echo ====================================
echo.

echo This script will help you publish to npm.
echo.
echo Prerequisites:
echo 1. You must have an npm account
echo 2. You must be logged in (npm login)
echo 3. The package name must be available
echo.

pause

echo.
echo Building the project...
call npm run build

if %errorlevel% neq 0 (
    echo Build failed! Please fix errors before publishing.
    pause
    exit /b 1
)

echo.
echo Build successful!
echo.

echo Current package info:
echo Name: @mcpservers/google-ai
echo Version: 1.0.0
echo.

echo Ready to publish?
echo Press Ctrl+C to cancel, or...
pause

echo.
echo Publishing to npm...
npm publish --access public

if %errorlevel% eq 0 (
    echo.
    echo ====================================
    echo SUCCESS! Package published to npm!
    echo ====================================
    echo.
    echo Your package is now available at:
    echo https://www.npmjs.com/package/@mcpservers/google-ai
    echo.
    echo Users can now install it with:
    echo npm install -g @mcpservers/google-ai
    echo.
) else (
    echo.
    echo ====================================
    echo FAILED! Publishing failed.
    echo ====================================
    echo.
    echo Common issues:
    echo 1. Not logged in - run: npm login
    echo 2. Package name taken - change name in package.json
    echo 3. No publish rights - check npm account
    echo.
)

pause
