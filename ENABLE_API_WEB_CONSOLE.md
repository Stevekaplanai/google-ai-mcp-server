# Enable Vertex AI via Google Cloud Console

Since you don't have gcloud CLI installed, here's how to enable Vertex AI through the web console:

## Step 1: Enable Vertex AI API

1. Open your browser and go to:
   https://console.cloud.google.com/apis/library/aiplatform.googleapis.com?project=starry-center-464218-r3

2. Click the **"ENABLE"** button

3. Wait for it to activate (usually takes 1-2 minutes)

## Step 2: Add Service Account Permissions

1. Go to IAM & Admin:
   https://console.cloud.google.com/iam-admin/iam?project=starry-center-464218-r3

2. Find your service account:
   `google-ai-mcp-server-service-a@starry-center-464218-r3.iam.gserviceaccount.com`

3. Click the pencil icon to edit permissions

4. Add these roles:
   - **Vertex AI User** (roles/aiplatform.user)
   - **Storage Object Admin** (roles/storage.objectAdmin)

5. Click **Save**

## Step 3: Verify Everything is Ready

After completing the above steps, your server should be ready to use!

Test it by running:
```bash
cd C:\Users\steve\Desktop\google-ai-mcp-server
npm run build
npm start
```

Then in another terminal:
```bash
node test-imagen-real.js
```

## Alternative: Install gcloud CLI

If you prefer to use command line tools for future management:
```bash
scripts\install-gcloud.bat
```

This will install the Google Cloud SDK which includes the gcloud command.
