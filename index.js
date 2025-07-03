#!/usr/bin/env node

/**
 * Root index.js for Smithery compatibility
 * This file redirects to the actual compiled server
 */

// Check if dist exists
const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'dist', 'index.js');

if (fs.existsSync(distPath)) {
  // Production mode - use compiled version
  require(distPath);
} else {
  // Development mode - compile on the fly
  console.error('Compiled server not found. Building...');
  const { execSync } = require('child_process');
  
  try {
    execSync('npm run build', { stdio: 'inherit' });
    require(distPath);
  } catch (error) {
    console.error('Failed to build server:', error);
    console.error('Please run "npm install && npm run build" first.');
    process.exit(1);
  }
}