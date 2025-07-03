@echo off
echo ========================================
echo Installing Google Cloud SDK
echo ========================================
echo.

echo This script will download and install Google Cloud SDK.
echo.

echo Step 1: Downloading Google Cloud SDK installer...
powershell -Command "Invoke-WebRequest -Uri 'https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe' -OutFile 'GoogleCloudSDKInstaller.exe'"

if not exist GoogleCloudSDKInstaller.exe (
    echo Failed to download installer!
    echo.
    echo Please download manually from:
    echo https://cloud.google.com/sdk/docs/install
    pause
    exit /b 1
)

echo.
echo Step 2: Running installer...
echo Please follow the installation wizard.
echo.
echo IMPORTANT: 
echo - Install for "All Users" if prompted
echo - Keep all default options
echo - Let it run "gcloud init" at the end
echo.
pause

start /wait GoogleCloudSDKInstaller.exe

echo.
echo Step 3: Cleaning up...
del GoogleCloudSDKInstaller.exe

echo.
echo ========================================
echo Installation Complete!
echo.
echo Next steps:
echo 1. Close this window
echo 2. Open a NEW PowerShell/Command Prompt
echo 3. Run: gcloud init
echo 4. Login with your Google account
echo 5. Select project: starry-center-464218-r3
echo ========================================
pause
