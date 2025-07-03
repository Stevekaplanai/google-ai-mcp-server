# Google AI MCP Server - Quick Start Guide

## 🎉 Installation Complete!

Your Google AI MCP Server is now installed and configured in Claude Desktop. The server is currently running in **MOCK MODE** for testing.

## 🚀 Testing the Server

After restarting Claude Desktop, you should see the Google AI tools available. Try these commands:

### Test Image Generation (Imagen 4)
```
Please generate an image of a beautiful sunset over mountains using Imagen 4
```

### Test Text Generation (Gemini)
```
Use Gemini to write a haiku about artificial intelligence
```

### Test Video Generation (VEO 3)
```
Generate a video of waves crashing on a beach (this will return mock data until VEO 3 access is granted)
```

### Test Music Generation (Lyria 2)
```
Generate a 30-second upbeat jazz melody
```

## 🔑 Setting Up Real Google Cloud Access

When you're ready to use real APIs instead of mock data:

### 1. Enable Vertex AI API
```bash
gcloud services enable aiplatform.googleapis.com
```

### 2. Create a Service Account
```bash
# Create service account
gcloud iam service-accounts create google-ai-mcp-server \
  --display-name="Google AI MCP Server"

# Grant necessary permissions
gcloud projects add-iam-policy-binding starry-center-464218-r3 \
  --member="serviceAccount:google-ai-mcp-server@starry-center-464218-r3.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

# Create and download key
gcloud iam service-accounts keys create service-account-key.json \
  --iam-account=google-ai-mcp-server@starry-center-464218-r3.iam.gserviceaccount.com
```

### 3. Update Your Configuration

1. Copy the contents of `service-account-key.json`
2. Update your `.env` file:
```env
USE_MOCK=false
GOOGLE_APPLICATION_CREDENTIALS_JSON='<paste entire JSON here>'
```

3. Update Claude Desktop config to remove mock mode:
   - Edit `%APPDATA%\Claude\claude_desktop_config.json`
   - Change `"USE_MOCK": "true"` to `"USE_MOCK": "false"`

### 4. Restart Claude Desktop

## 📊 Current Status

| Service | Status | Notes |
|---------|--------|-------|
| **Imagen 4** | ✅ Ready | Works with Vertex AI credentials |
| **Gemini** | ✅ Ready | Multiple models available |
| **VEO 3** | ⏳ Pending | Awaiting allowlist approval |
| **Lyria 2** | ❓ Limited | May require special access |

## 🛠️ Troubleshooting

### Server Not Appearing in Claude
1. Restart Claude Desktop completely
2. Check the logs in: `%APPDATA%\Claude\logs`
3. Verify the server path is correct in config

### Authentication Errors
1. Ensure your service account has the correct permissions
2. Verify the JSON credentials are properly formatted
3. Check that Vertex AI API is enabled

### Mock Data Not Working
1. Ensure `USE_MOCK=true` in both `.env` and Claude config
2. Check that the server built successfully: `npm run build`

## 📚 Next Steps

1. **Deploy the website** to showcase your MCP server
2. **Apply for VEO 3 access** at [Google Cloud VEO 3 Preview](https://cloud.google.com/vertex-ai/generative-ai/docs/model-garden/veo)
3. **Test with real data** once credentials are set up
4. **Submit to Smithery.ai** for public distribution

## 🤝 Support

- GitHub Issues: https://github.com/stevekaplanai/google-ai-mcp-server/issues
- Documentation: Check the main README.md
- Google Cloud Support: For API-specific issues

---

**Remember**: You'll need to restart Claude Desktop after making any configuration changes!
