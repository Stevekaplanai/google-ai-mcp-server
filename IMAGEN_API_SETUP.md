# Google Imagen 4 API Setup Guide

Since Google confirmed that Imagen 4 is available in public preview through Vertex AI Model Garden, here's how to set up and test the implementation with real API calls.

## Prerequisites

1. **Google Cloud Project** ✅ You already have: `starry-center-464218-r3`
2. **Service Account** ✅ Already configured in your `.env` file
3. **Vertex AI API Enabled** - Need to verify this is enabled

## Step 1: Enable Vertex AI API

Run this command to ensure the Vertex AI API is enabled:

```bash
gcloud services enable aiplatform.googleapis.com --project=starry-center-464218-r3
```

## Step 2: Verify Service Account Permissions

Your service account needs the following roles:
- `roles/aiplatform.user` - To call prediction APIs
- `roles/storage.objectAdmin` - If using Cloud Storage for outputs

Run these commands to add the permissions:

```bash
# Add Vertex AI User role
gcloud projects add-iam-policy-binding starry-center-464218-r3 \
  --member="serviceAccount:google-ai-mcp-server-service-a@starry-center-464218-r3.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

# Add Storage Admin role (if needed)
gcloud projects add-iam-policy-binding starry-center-464218-r3 \
  --member="serviceAccount:google-ai-mcp-server-service-a@starry-center-464218-r3.iam.gserviceaccount.com" \
  --role="roles/storage.objectAdmin"
```

## Step 3: Test the Implementation

### Test with Mock Mode First

```bash
# Set mock mode
SET USE_MOCK=true
npm run build
npm start
```

### Test with Real API

```bash
# Disable mock mode
SET USE_MOCK=false
npm run build
npm start
```

## Step 4: Example Usage

Once the server is running, you can test it with these example requests:

### Basic Image Generation
```json
{
  "prompt": "A serene mountain landscape at sunset with vibrant colors",
  "aspectRatio": "16:9",
  "sampleCount": 1
}
```

### Advanced Image Generation
```json
{
  "prompt": "A futuristic city with flying cars and neon lights",
  "aspectRatio": "1:1",
  "sampleCount": 2,
  "negativePrompt": "blurry, low quality, distorted",
  "personGeneration": "allow",
  "language": "en"
}
```

## Step 5: Troubleshooting

### Common Issues and Solutions

1. **"Permission denied" error**
   - Verify service account has correct roles
   - Check if Vertex AI API is enabled
   - Ensure credentials are correctly parsed

2. **"Model not found" error**
   - The model endpoint might be different in your region
   - Try using `imagen-3.0-generate-001` if `imagen-generate` doesn't work

3. **"Quota exceeded" error**
   - Check your project quotas in Google Cloud Console
   - Imagen has usage limits in preview

### Debug Mode

The service is configured with debug mode enabled. Check the console output for:
- API endpoint being called
- Request payload
- Response details

## Step 6: Monitor Usage

You can monitor your Imagen API usage in the Google Cloud Console:
1. Go to [Vertex AI Console](https://console.cloud.google.com/vertex-ai)
2. Navigate to "Model Garden"
3. Search for "Imagen"
4. Check usage and quotas

## API Response Format

Successful responses will include:
```json
{
  "images": [
    {
      "base64": "base64-encoded-image-data",
      "mimeType": "image/png",
      "generationId": "unique-id"
    }
  ],
  "metadata": {
    "model": "imagen-generate",
    "generatedAt": "2025-01-03T...",
    "totalImages": 1
  }
}
```

## Next Steps

1. Test basic image generation
2. Experiment with different parameters
3. Implement error handling for production use
4. Set up monitoring and logging
5. Consider implementing caching for repeated requests

## Additional Resources

- [Vertex AI Model Garden](https://console.cloud.google.com/vertex-ai/model-garden)
- [Imagen Documentation](https://cloud.google.com/vertex-ai/docs/generative-ai/image/overview)
- [Vertex AI Quotas](https://cloud.google.com/vertex-ai/docs/quotas)

## Important Notes

- Imagen 4 is in public preview, so features and pricing may change
- Always handle sensitive content appropriately
- Monitor your usage to avoid unexpected charges
- The API may have rate limits even in preview