# 🔐 Fix Permission Error - Add Vertex AI User Role

## Quick Fix (2 minutes):

### Step 1: Add the Vertex AI User Role

Click this link to go directly to your IAM settings:
👉 https://console.cloud.google.com/iam-admin/iam?project=starry-center-464218-r3

### Step 2: Find Your Service Account

Look for: `google-ai-mcp-server-service-a@starry-center-464218-r3.iam.gserviceaccount.com`

### Step 3: Edit Permissions

1. Click the **pencil icon** (Edit) next to the service account
2. Click **+ ADD ANOTHER ROLE**
3. Search for: **Vertex AI User**
4. Select: **Vertex AI User** (roles/aiplatform.user)
5. Click **SAVE**

### Step 4: Wait & Test

Wait 1-2 minutes for permissions to propagate, then run:
```bash
node test-imagen-save.js
```

## Alternative: Direct Link

Use this direct link to add the role:
https://console.cloud.google.com/iam-admin/iam?project=starry-center-464218-r3&member=serviceAccount:google-ai-mcp-server-service-a@starry-center-464218-r3.iam.gserviceaccount.com

## What This Does:

The "Vertex AI User" role grants:
- ✅ `aiplatform.endpoints.predict` - Needed for Imagen
- ✅ Access to all Vertex AI prediction APIs
- ✅ Ability to generate images, videos, etc.

## Verify Permissions Were Added:

After adding the role, you can verify by running:
```bash
node scripts\test-vertex-access.cjs
```

It should now show "✅ Imagen API is working perfectly!"

---

**This is the final step!** Once you add this role, your image generation will work. 🎨
