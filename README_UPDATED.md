# Google AI MCP Server

<div align="center">
  <img src="https://img.shields.io/badge/MCP-Model%20Context%20Protocol-blue" alt="MCP">
  <img src="https://img.shields.io/badge/Google%20AI-VEO%203%20|%20Imagen%204%20|%20Gemini%20|%20Lyria%202-4285F4" alt="Google AI">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License">
</div>

<div align="center">
  <h3>🌐 <a href="https://google-ai-mcp-website.vercel.app/">Live Demo & Documentation</a></h3>
</div>

Integrate Google's most advanced AI models directly into Claude Desktop through the Model Context Protocol. Access VEO 3 for video generation, Imagen 4 for photorealistic images, Gemini for text generation, and Lyria 2 for music creation - all from within Claude.

## ✨ Features

- 🎬 **VEO 3 Video Generation** - Create high-quality videos with native audio (5-8 seconds)
- 🖼️ **Imagen 4 Images** - Generate photorealistic images with advanced control
- 💬 **Gemini Models** - Access Gemini 1.5 Pro, Flash, and 2.0 Flash
- 🎵 **Lyria 2 Music** - Generate studio-quality music up to 60 seconds
- 🔄 **Operation Status** - Monitor long-running generation tasks
- 🧪 **Mock Mode** - Test without credentials using realistic mock data

## 🚀 Quick Start

### 1. Install via NPM (Recommended)
```bash
npm install -g @mcpservers/google-ai
```

### 2. Configure Claude Desktop

Add to your Claude Desktop config (`%APPDATA%\Claude\claude_desktop_config.json` on Windows):

```json
{
  "mcpServers": {
    "google-ai": {
      "command": "google-ai-mcp",
      "env": {
        "GOOGLE_CLOUD_PROJECT": "your-project-id",
        "USE_MOCK": "true"
      }
    }
  }
}
```

### 3. Restart Claude Desktop

The Google AI tools will now be available in your Claude conversations!

## 🔧 Setup Guide

### Using Mock Mode (No Setup Required)
Set `USE_MOCK=true` to test with realistic mock responses. Perfect for development and testing.

### Using Real Google Cloud APIs

1. **Enable Vertex AI API**
   ```bash
   gcloud services enable aiplatform.googleapis.com
   ```

2. **Create Service Account**
   ```bash
   gcloud iam service-accounts create google-ai-mcp-server \
     --display-name="Google AI MCP Server"
   ```

3. **Set Credentials**
   Add your service account JSON to the Claude config:
   ```json
   {
     "env": {
       "GOOGLE_APPLICATION_CREDENTIALS_JSON": "{...your-json...}"
     }
   }
   ```

## 📋 Available Tools

| Tool | Description | Status |
|------|-------------|---------|
| `veo_generate_video` | Generate videos with VEO 3 | ⏳ Allowlist pending |
| `imagen_generate_image` | Create images with Imagen 4 | ✅ Ready |
| `gemini_generate_text` | Generate text with Gemini | ✅ Ready |
| `lyria_generate_music` | Create music with Lyria 2 | ⏳ Limited access |
| `check_operation_status` | Check generation progress | ✅ Ready |

## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/stevekaplanai/google-ai-mcp-server.git
cd google-ai-mcp-server

# Install dependencies
npm install

# Build
npm run build

# Run in development
npm run dev
```

## 📝 Example Usage

After installation, you can use natural language in Claude:

- "Generate an image of a sunset over mountains"
- "Create a video of waves crashing on a beach"
- "Write a haiku using Gemini"
- "Generate 30 seconds of upbeat jazz music"

## 🤝 Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🔗 Links

- [Website](https://google-ai-mcp-website.vercel.app/)
- [Documentation](https://google-ai-mcp-website.vercel.app/#installation)
- [NPM Package](https://www.npmjs.com/package/@mcpservers/google-ai)
- [Smithery.ai](https://smithery.ai/server/@mcpservers/google-ai)

## 👨‍💻 Author

Created by [Steve Kaplan](https://github.com/stevekaplanai) - AI-driven marketing strategist and developer

---

<div align="center">
  Made with ❤️ for the MCP community
</div>
