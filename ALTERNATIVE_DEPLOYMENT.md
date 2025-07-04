# Alternative Deployment Options

Since Smithery deployment is experiencing issues, here are alternative ways to deploy this MCP server:

## Option 1: Local Installation via NPM

```bash
npm install -g @mcpservers/google-ai
```

Then configure in Claude Desktop:

```json
{
  "mcpServers": {
    "google-ai": {
      "command": "google-ai-mcp",
      "env": {
        "USE_MOCK": "true"
      }
    }
  }
}
```

## Option 2: Direct from GitHub

```bash
npx github:Stevekaplanai/google-ai-mcp-server
```

## Option 3: Docker Hub

Build and push to Docker Hub:

```bash
docker build -t yourusername/google-ai-mcp .
docker push yourusername/google-ai-mcp
```

Then run:

```bash
docker run -it yourusername/google-ai-mcp
```

## Option 4: Manual Installation

1. Clone the repository:
```bash
git clone https://github.com/Stevekaplanai/google-ai-mcp-server.git
cd google-ai-mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Build (if needed):
```bash
npm run build
```

4. Add to Claude Desktop config:
```json
{
  "mcpServers": {
    "google-ai": {
      "command": "node",
      "args": ["/path/to/google-ai-mcp-server/dist/index.js"],
      "env": {
        "USE_MOCK": "true"
      }
    }
  }
}
```

## Configuration

All deployment methods support these environment variables:

- `USE_MOCK`: Set to "true" to use mock responses (default: true)
- `GOOGLE_CLOUD_PROJECT`: Your Google Cloud project ID
- `GOOGLE_CLOUD_LOCATION`: Google Cloud location (default: us-central1)
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to service account JSON file

## Troubleshooting

If you encounter issues:

1. Ensure Node.js 18+ is installed
2. Check that all dependencies are installed
3. Verify the dist/ directory exists (run `npm run build` if not)
4. Test with `USE_MOCK=true` first
5. Check logs for specific error messages

## Support

For issues or questions:
- GitHub Issues: https://github.com/Stevekaplanai/google-ai-mcp-server/issues
- Email: steve@stevekaplan.ai
