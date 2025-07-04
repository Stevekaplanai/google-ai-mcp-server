# Manual Installation Instructions

While waiting for Smithery approval, you can install the Google AI MCP Server manually:

## For Claude Desktop

1. Open your Claude Desktop configuration file:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

2. Add the following to your `mcpServers` section:

```json
{
  "mcpServers": {
    "google-ai": {
      "command": "npx",
      "args": ["@stevekaplanai/google-ai-mcp"],
      "env": {
        "USE_MOCK": "true"
      }
    }
  }
}
```

3. For real API usage (not mock mode), add your credentials:

```json
{
  "mcpServers": {
    "google-ai": {
      "command": "npx",
      "args": ["@stevekaplanai/google-ai-mcp"],
      "env": {
        "USE_MOCK": "false",
        "GOOGLE_CLOUD_PROJECT": "your-project-id",
        "GOOGLE_CLOUD_LOCATION": "us-central1",
        "GOOGLE_APPLICATION_CREDENTIALS_JSON": "{\"type\":\"service_account\",\"project_id\":\"...\"}"
      }
    }
  }
}
```

4. Restart Claude Desktop

## For Other Clients

### Cline (VS Code)
```json
{
  "google-ai": {
    "command": "npx",
    "args": ["@stevekaplanai/google-ai-mcp"],
    "env": {
      "USE_MOCK": "true"
    }
  }
}
```

### Cursor
Add to your MCP settings with the same configuration as above.

## Testing Your Installation

Once installed, you can test by asking Claude:
- "Use the Google AI MCP to generate an image of a sunset"
- "Create a video of clouds moving over mountains"
- "Generate text about AI using Gemini"
