# Google AI MCP Server

A Model Context Protocol (MCP) server that provides access to Google's AI models including Imagen 3, VEO 3, Gemini, and Lyria through Claude Desktop.

[![NPM Version](https://img.shields.io/npm/v/@stevekaplanai/google-ai-mcp)](https://www.npmjs.com/package/@stevekaplanai/google-ai-mcp)
[![License](https://img.shields.io/npm/l/@stevekaplanai/google-ai-mcp)](LICENSE)

## 🚀 Quick Start

### Install via NPM (Recommended)

Add to your Claude Desktop configuration:

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
        "GOOGLE_APPLICATION_CREDENTIALS_JSON": "{\"type\":\"service_account\",...}"
      }
    }
  }
}
```

## ✨ Features

- **Imagen 3** - Generate photorealistic images with text prompts
- **VEO 3** - Create 5-8 second videos with audio (coming soon)
- **Gemini** - Access Google's latest language models
- **Lyria 2** - Generate up to 60 seconds of music (coming soon)

## 📋 Prerequisites

1. Google Cloud Project with billing enabled
2. Vertex AI API enabled
3. Service account with appropriate permissions
4. Claude Desktop installed

## 🔧 Setup Instructions

### 1. Enable Required APIs

```bash
gcloud services enable aiplatform.googleapis.com
```

### 2. Create Service Account

```bash
# Create service account
gcloud iam service-accounts create google-ai-mcp-server \
    --display-name="Google AI MCP Server Service Account"

# Grant necessary permissions
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:google-ai-mcp-server@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/aiplatform.user"

# Create and download key
gcloud iam service-accounts keys create service-account-key.json \
    --iam-account=google-ai-mcp-server@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

### 3. Configure Claude Desktop

Update your Claude Desktop config file:
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

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
        "GOOGLE_APPLICATION_CREDENTIALS_JSON": "paste-json-here"
      }
    }
  }
}
```

⚠️ **Important**: When pasting the JSON credentials:
- Escape all newlines in the private key: `\n` → `\\n`
- Keep the entire JSON on one line
- Don't include outer quotes

### 4. Restart Claude Desktop

After updating the configuration, completely restart Claude Desktop for changes to take effect.

## 🎨 Usage Examples

### Generate an Image
```
"Create a photorealistic image of a ninja duck in a dojo"
```

### Generate Multiple Variations
```
"Generate 4 variations of a cyberpunk city at night"
```

### Different Aspect Ratios
```
"Create a 16:9 landscape image of mountains at sunset"
"Generate a 9:16 portrait image for a phone wallpaper"
```

## 🛠️ Available Tools

### imagen_generate_image
Generate images using Google Imagen 3.

**Parameters:**
- `prompt` (required): Text description of the image
- `aspectRatio`: "1:1" (default), "16:9", "9:16", "4:3", "3:4"
- `sampleCount`: 1-8 images (default: 1)
- `negativePrompt`: What to avoid in the generation
- `personGeneration`: "allow" (default) or "disallow"

### gemini_generate_text
Generate text using Gemini models.

**Parameters:**
- `prompt` (required): Input text prompt
- `model`: "gemini-1.5-flash" (default), "gemini-1.5-pro", "gemini-2.0-flash-exp"
- `temperature`: 0-2 (default: 0.7)
- `maxTokens`: 1-8192 (default: 2048)

### veo_generate_video (Coming Soon)
Generate videos with VEO 3.

### lyria_generate_music (Coming Soon)
Generate music with Lyria 2.

## 🧪 Mock Mode

For testing without API calls, set `USE_MOCK: "true"` in your configuration. This will return sample responses without using your Google Cloud quota.

## 🔍 Troubleshooting

### JSON Parsing Errors
If you see "Unexpected token" errors:
1. Update to the latest version: `@stevekaplanai/google-ai-mcp@latest`
2. Restart Claude Desktop

### Authentication Errors
- Verify your service account has the `aiplatform.user` role
- Check that the JSON credentials are properly escaped
- Ensure the project ID matches your service account

### API Not Found Errors
- Confirm Vertex AI API is enabled in your project
- Verify you're using a supported location (us-central1 recommended)

## 📊 Supported Models

### Imagen
- `imagen-3.0-generate-001` - Latest high-quality model
- `imagen-3.0-fast-generate-001` - Faster generation

### Gemini
- `gemini-1.5-pro` - Most capable model
- `gemini-1.5-flash` - Optimized for speed
- `gemini-2.0-flash-exp` - Experimental features

## 🔒 Security Notes

- Never commit service account keys to version control
- Use environment variables for production deployments
- Regularly rotate service account keys
- Limit service account permissions to minimum required

## 📝 Changelog

### v1.0.2 (Latest)
- Fixed JSON parsing errors by redirecting debug logs to stderr
- Improved error handling for API responses
- Added support for real Imagen API endpoints

### v1.0.1
- Initial release with mock mode
- Basic Imagen and Gemini support

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Built for [Claude Desktop](https://claude.ai/desktop) by Anthropic
- Uses Google's [Vertex AI](https://cloud.google.com/vertex-ai) platform
- Implements the [Model Context Protocol](https://github.com/anthropics/mcp)

## 📧 Support

For issues and questions:
- GitHub Issues: [google-ai-mcp-server/issues](https://github.com/stevekaplanai/google-ai-mcp-server/issues)
- NPM Package: [@stevekaplanai/google-ai-mcp](https://www.npmjs.com/package/@stevekaplanai/google-ai-mcp)

---

Made with ❤️ by [Steve Kaplan](https://github.com/stevekaplanai)
