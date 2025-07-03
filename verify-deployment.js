#!/usr/bin/env node

// Deployment verification script for Smithery
// This verifies the MCP server can be instantiated

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function verify() {
  try {
    console.log('Verifying Google AI MCP Server deployment...');
    
    // Check if the main index file exists
    const indexPath = join(__dirname, 'dist', 'index.js');
    console.log(`Checking for compiled index at: ${indexPath}`);
    
    // Try to import the server
    await import(indexPath);
    
    console.log('✅ Server module loaded successfully');
    console.log('✅ Deployment verification passed');
    
    // Exit cleanly to prevent the server from starting
    process.exit(0);
  } catch (error) {
    console.error('❌ Deployment verification failed:', error);
    process.exit(1);
  }
}

// Only run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  verify();
}

export default verify;