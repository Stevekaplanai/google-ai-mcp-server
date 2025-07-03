# Smithery.ai Submission Details

## Google AI MCP Server

A comprehensive Model Context Protocol (MCP) server that provides access to Google's latest AI services through a unified interface.

### 🚀 Features

- **🖼️ Imagen 4** - Generate photorealistic images with Google's latest image generation model
- **🎬 VEO 3** - Create high-quality videos (5-8 seconds) with audio
- **💬 Gemini** - Access Google's most advanced language models (Pro, Flash, and 2.0 Flash Exp)
- **🎵 Lyria 2** - Music generation (currently in mock mode, ready for future API release)

### 🛠️ Installation

1. Install the MCP server:
```bash
npm install -g @mcpservers/google-ai
```

2. Configure your Claude desktop app (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "google-ai": {
      "command": "npx",
      "args": ["-y", "@mcpservers/google-ai"],
      "env": {
        "GOOGLE_CLOUD_PROJECT": "your-project-id",
        "GOOGLE_APPLICATION_CREDENTIALS_JSON": "{your-service-account-json}"
      }
    }
  }
}
```

### 📋 Prerequisites

- Google Cloud Project with Vertex AI enabled
- Service account with appropriate permissions
- Node.js 18+ installed

### 🎯 Quick Start

After installation, you can immediately start using the tools in Claude:

- "Generate an image of a sunset over mountains"
- "Create a video of clouds moving across the sky"
- "Write a poem about AI using Gemini"
- "Generate relaxing music for meditation" (mock mode)

### 🔧 Configuration Options

- `GOOGLE_CLOUD_PROJECT` - Your Google Cloud project ID
- `GOOGLE_CLOUD_LOCATION` - Region (default: us-central1)
- `GOOGLE_APPLICATION_CREDENTIALS_JSON` - Service account credentials
- `USE_MOCK` - Enable mock mode for testing (true/false)

### 📚 Documentation

- [Complete Setup Guide](https://github.com/Stevekaplanai/google-ai-mcp-server/blob/master/QUICKSTART.md)
- [VEO 3 Integration Guide](https://github.com/Stevekaplanai/google-ai-mcp-server/blob/master/VEO3_INTEGRATION_GUIDE.md)
- [API Documentation](https://github.com/Stevekaplanai/google-ai-mcp-server#api-reference)

### 🤝 Support

- [GitHub Issues](https://github.com/Stevekaplanai/google-ai-mcp-server/issues)
- [Documentation](https://github.com/Stevekaplanai/google-ai-mcp-server)

### 📄 License

MIT License - see [LICENSE](https://github.com/Stevekaplanai/google-ai-mcp-server/blob/master/LICENSE) for details.
