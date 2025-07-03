# 🚀 Quick Setup Guide - No gcloud Required!

You don't need gcloud CLI installed. Here's the fastest way to get your Google AI MCP server working:

## Option 1: Web Console (Fastest - 2 minutes)

### Step 1: Enable Vertex AI API
Click this link and press "ENABLE":
👉 [Enable Vertex AI API](https://console.cloud.google.com/apis/library/aiplatform.googleapis.com?project=starry-center-464218-r3)

### Step 2: Add Permissions
1. Go to [IAM Settings](https://console.cloud.google.com/iam-admin/iam?project=starry-center-464218-r3)
2. Find: `google-ai-mcp-server-service-a@starry-center-464218-r3.iam.gserviceaccount.com`
3. Click the pencil icon (Edit)
4. Add role: **"Vertex AI User"**
5. Click Save

### Step 3: Test It Works
```bash
cd C:\Users\steve\Desktop\google-ai-mcp-server

# Test API access
node scripts\test-vertex-access.js

# If successful, start the server
npm run build
npm start
```

## Option 2: Install gcloud (For Future Use)

If you want gcloud for future Google Cloud management:
```bash
scripts\install-gcloud.bat
```

## That's It! 🎉

Once the API is enabled (takes about 1-2 minutes), your server is ready to generate images with Google's Imagen 4!

## Quick Test
After starting the server, test image generation:
```bash
node test-imagen-real.js
```

---
**Need Help?** The error messages will guide you. Most common issue is just needing to enable the API via the link above.
