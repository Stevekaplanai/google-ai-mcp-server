# VEO 3 Integration Guide

## Current Status

✅ **Completed:**
- Full VEO 3 service implementation
- Mock mode working perfectly
- TypeScript types and interfaces
- Test scripts ready
- MCP server integration

❓ **Pending:**
- Finding the correct VEO 3 endpoint/model name
- Proper authentication method

## What We've Discovered

### 1. VEO 3 is NOT available through:
- ❌ Standard Vertex AI endpoints (`aiplatform.googleapis.com`)
- ❌ Direct video API endpoints (`veo.googleapis.com`, `video.googleapis.com`)
- ❌ Standard model names (`veo`, `veo-3`, `veo-003`, etc.)

### 2. VEO 3 MIGHT be available through:
- 🔍 Google AI Studio API (with API key authentication)
- 🔍 Special preview program with unique documentation
- 🔍 Generative Language API with different auth scope

## Next Steps

### Option 1: Google AI Studio API Key
1. Go to https://aistudio.google.com
2. Get an API key
3. Add to your `.env` file: `GOOGLE_AI_STUDIO_API_KEY=your-key-here`
4. Run: `node test-veo-studio.js`

### Option 2: Contact Your Google Representative
Since you have allowlist access, you should have received:
- Specific API documentation
- Model name/endpoint information
- Authentication requirements
- Example code or curl commands

Ask them for:
1. The exact model name for VEO 3
2. The API endpoint URL
3. Authentication method (API key vs OAuth)
4. Any special headers or parameters required

### Option 3: Check Your Email/Documentation
Look for emails from Google with subjects like:
- "VEO 3 API Access Granted"
- "Video Generation API Preview"
- "Allowlist Confirmation"
- "Getting Started with VEO"

## Common VEO 3 Access Patterns

Based on other Google preview APIs, VEO 3 might use:

### Pattern 1: AI Studio API Key
```javascript
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/veo:generateVideo?key=${API_KEY}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'your prompt',
      videoConfig: { duration: 5, aspectRatio: '16:9' }
    })
  }
);
```

### Pattern 2: Special Preview Endpoint
```javascript
const response = await fetch(
  `https://veo-preview.googleapis.com/v1/projects/${PROJECT_ID}/videos:generate`,
  {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({
      prompt: 'your prompt',
      duration: 5
    })
  }
);
```

### Pattern 3: Through Vertex AI with Special Headers
```javascript
const response = await fetch(
  `https://us-central1-aiplatform.googleapis.com/v1beta1/projects/${PROJECT_ID}/locations/us-central1/publishers/google/models/veo-preview:predict`,
  {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'X-Goog-User-Project': PROJECT_ID,
      'X-Preview-Features': 'veo-v3'
    },
    body: JSON.stringify({
      instances: [{ prompt: 'your prompt' }],
      parameters: { videoLength: 5 }
    })
  }
);
```

## Quick Test Commands

Once you have the correct information, update `veo.service.ts`:

```typescript
// Line 110 - Update model name
const modelName = 'YOUR_ACTUAL_MODEL_NAME'; // e.g., 'veo-preview', 'veo-v3', etc.

// Line 111 - Update endpoint if needed
const endpoint = `YOUR_ENDPOINT_URL`;
```

Then test:
```bash
# Test with mock data
node test-veo.js

# Test with real API
node test-veo-real.js --real
```

## Troubleshooting

If you get:
- **404 errors**: Wrong endpoint or model name
- **403 errors**: Authentication issue or no access
- **400 errors**: Malformed request or wrong parameters
- **500 errors**: Server issue or feature not enabled

## Contact Support

If you're stuck, contact:
1. Your Google representative who granted access
2. Google Cloud Support with your allowlist confirmation
3. Post in the Google AI developer forums with your project ID

Remember: VEO 3 is in preview, so documentation might be limited and the API might change.
