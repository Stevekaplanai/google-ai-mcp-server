# Smithery NPM Deployment Configuration

This MCP server is deployed via NPM, not Docker.

## NPM Package:
- Package: `@stevekaplanai/google-ai-mcp`
- Version: 1.0.1
- NPM URL: https://www.npmjs.com/package/@stevekaplanai/google-ai-mcp

## Installation:
```bash
# Via Smithery CLI
npx @smithery/cli install --client claude @stevekaplanai/google-ai-mcp

# Or manual NPM install
npx @stevekaplanai/google-ai-mcp
```

## Configuration:
The server accepts these environment variables:
- `GOOGLE_CLOUD_PROJECT` - Your GCP project ID
- `GOOGLE_CLOUD_LOCATION` - Region (default: us-central1)
- `GOOGLE_APPLICATION_CREDENTIALS_JSON` - Service account JSON
- `USE_MOCK` - Enable mock mode for testing (default: true)

## Entry Point:
The server runs on stdio and implements the MCP protocol.

## Smithery Configuration:
See `smithery.yaml` for the complete Smithery deployment configuration.
