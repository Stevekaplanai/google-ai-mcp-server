# 🚀 Real API Setup Guide

This guide walks through setting up the Google AI MCP Server with real API access.

## ✅ Prerequisites Checklist

- [ ] Google Cloud account with billing enabled
- [ ] Project created in Google Cloud Console
- [ ] gcloud CLI installed and authenticated
- [ ] Claude Desktop installed

## 📋 Step-by-Step Setup

### 1. Authenticate with Google Cloud

```bash
gcloud auth login
```

### 2. Set Your Project

```bash
gcloud config set project YOUR_PROJECT_ID
```

### 3. Enable Required APIs

```bash
# Enable Vertex AI API
gcloud services enable aiplatform.googleapis.com

# Verify it's enabled
gcloud services list --enabled | grep aiplatform
```

### 4. Create Service Account

```bash
# Create the service account
gcloud iam service-accounts create google-ai-mcp-server \
    --display-name="Google AI MCP Server Service Account"

# Grant necessary permissions
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:google-ai-mcp-server@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/aiplatform.user"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:google-ai-mcp-server@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/iam.serviceAccountKeyAdmin"

# Optional: Add storage permissions for output
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:google-ai-mcp-server@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.objectAdmin"
```

### 5. Create Service Account Key

```bash
# Create credentials directory
mkdir credentials

# Generate key
gcloud iam service-accounts keys create credentials/service-account-key.json \
    --iam-account=google-ai-mcp-server@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

### 6. Configure Claude Desktop

1. Locate your Claude Desktop config:
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

2. Read your service account key:
   ```bash
   cat credentials/service-account-key.json
   ```

3. Update the config file:
   ```json
   {
     "mcpServers": {
       "google-ai": {
         "command": "npx",
         "args": ["@stevekaplanai/google-ai-mcp@latest"],
         "env": {
           "USE_MOCK": "false",
           "GOOGLE_CLOUD_PROJECT": "your-project-id",
           "GOOGLE_CLOUD_LOCATION": "us-central1",
           "GOOGLE_APPLICATION_CREDENTIALS_JSON": "{paste-entire-json-here}"
         }
       }
     }
   }
   ```

   ⚠️ **Important when pasting JSON**:
   - Replace all `\n` with `\\n` in the private key
   - Keep everything on one line
   - Include all fields from the service account JSON

### 7. Test Your Setup

Create a test script `test-setup.js`:

```javascript
const { GoogleAuth } = require('google-auth-library');

async function testSetup() {
    try {
        const auth = new GoogleAuth({
            keyFilename: './credentials/service-account-key.json',
            scopes: ['https://www.googleapis.com/auth/cloud-platform']
        });
        
        const client = await auth.getClient();
        const token = await client.getAccessToken();
        
        console.log('✅ Authentication successful!');
        console.log('Project:', await auth.getProjectId());
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testSetup();
```

Run: `node test-setup.js`

### 8. Verify Imagen Access

```javascript
// test-imagen.js
const { GoogleAuth } = require('google-auth-library');
const axios = require('axios');

async function testImagen() {
    const projectId = 'YOUR_PROJECT_ID';
    const location = 'us-central1';
    
    const auth = new GoogleAuth({
        keyFilename: './credentials/service-account-key.json',
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    
    const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/imagen-3.0-generate-001:predict`;
    
    try {
        const response = await axios.post(endpoint, {
            instances: [{ prompt: "test" }],
            parameters: { sampleCount: 1 }
        }, {
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Imagen API is accessible!');
    } catch (error) {
        console.log('❌ Error:', error.response?.status, error.response?.data);
    }
}

testImagen();
```

## 🎯 Available Endpoints

### Imagen Models
- `imagen-3.0-generate-001` - High quality generation
- `imagen-3.0-fast-generate-001` - Faster generation
- `imagegeneration` - General endpoint

### Gemini Models
- `gemini-1.5-pro` - Most capable
- `gemini-1.5-flash` - Balanced performance
- `gemini-2.0-flash-exp` - Experimental features

## 🛠️ Troubleshooting

### "Permission Denied" Errors
```bash
# Add missing role
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:google-ai-mcp-server@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/aiplatform.user"
```

### "API Not Enabled" Errors
```bash
# Enable the API
gcloud services enable aiplatform.googleapis.com

# Wait a few minutes for propagation
```

### JSON Parsing in Claude
- Ensure you're using version 1.0.2 or later
- Restart Claude Desktop after config changes
- Check logs: `%APPDATA%\Claude\logs\`

## 📊 Usage Monitoring

Monitor your API usage:
```bash
# View recent operations
gcloud ai operations list --region=us-central1

# Check quotas
gcloud compute project-info describe --project=YOUR_PROJECT_ID
```

## 🔒 Security Best Practices

1. **Never commit credentials**
   - Add `credentials/` to `.gitignore`
   - Use environment variables in production

2. **Rotate keys regularly**
   ```bash
   # List existing keys
   gcloud iam service-accounts keys list \
       --iam-account=google-ai-mcp-server@YOUR_PROJECT_ID.iam.gserviceaccount.com
   
   # Delete old keys
   gcloud iam service-accounts keys delete KEY_ID \
       --iam-account=google-ai-mcp-server@YOUR_PROJECT_ID.iam.gserviceaccount.com
   ```

3. **Limit permissions**
   - Only grant necessary roles
   - Use separate service accounts for different environments

## 📈 Next Steps

1. **Test in Claude Desktop**
   - Restart Claude Desktop
   - Ask Claude to generate an image
   - Verify real API responses

2. **Explore Features**
   - Try different aspect ratios
   - Generate multiple variations
   - Experiment with negative prompts

3. **Monitor Usage**
   - Check Cloud Console for API calls
   - Review billing estimates
   - Set up usage alerts

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ No JSON parsing errors in Claude
- ✅ Images generate without mock data warnings
- ✅ Cloud Console shows API activity
- ✅ Generated images appear in responses

---

Need help? Check the [main README](README.md) or open an issue on GitHub.
