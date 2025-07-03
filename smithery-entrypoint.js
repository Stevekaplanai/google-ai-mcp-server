#!/usr/bin/env node

/**
 * Entry point wrapper for Smithery deployment
 * This ensures the server starts correctly in the Smithery environment
 */

// Set production environment
process.env.NODE_ENV = 'production';

// Enable mock mode if no credentials are provided
if (!process.env.GOOGLE_CLOUD_PROJECT && !process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
  console.error('No Google Cloud credentials found, enabling mock mode...');
  process.env.USE_MOCK = 'true';
}

// Import and start the server
import('./dist/index.js').catch((error) => {
  console.error('Failed to start Google AI MCP Server:', error);
  process.exit(1);
});