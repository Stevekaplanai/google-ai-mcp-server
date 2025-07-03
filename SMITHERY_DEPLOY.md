# Smithery Deployment Configuration

This directory contains all necessary files for Smithery.ai deployment.

## Files:
- `Dockerfile` - Docker build configuration
- `smithery.yaml` - Main Smithery configuration
- `smithery.build.yaml` - Explicit build steps
- `.dockerignore` - Files to exclude from Docker build

## Quick Test:
To verify the server works:
```bash
npm install
npm run build
USE_MOCK=true node dist/index.js
```

## Environment Variables:
- `GOOGLE_CLOUD_PROJECT` - Your GCP project ID
- `GOOGLE_CLOUD_LOCATION` - Region (default: us-central1)
- `GOOGLE_APPLICATION_CREDENTIALS_JSON` - Service account JSON
- `USE_MOCK` - Enable mock mode for testing

## Entry Point:
The server runs on stdio and expects MCP protocol messages.