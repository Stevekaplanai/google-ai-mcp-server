// Test script to verify the Google AI MCP Server
const { spawn } = require('child_process');

// Start the server with mock mode enabled
const env = {
  ...process.env,
  USE_MOCK: 'true',
  GOOGLE_CLOUD_PROJECT: 'test-project',
  GOOGLE_CLOUD_LOCATION: 'us-central1'
};

console.log('Starting Google AI MCP Server in mock mode...\n');

const server = spawn('node', ['dist/index.js'], {
  env,
  stdio: ['pipe', 'pipe', 'inherit']
});

// Send a list tools request
const listToolsRequest = {
  jsonrpc: '2.0',
  id: 1,
  method: 'tools/list'
};

// Send a test image generation request
const testImageRequest = {
  jsonrpc: '2.0',
  id: 2,
  method: 'tools/call',
  params: {
    name: 'imagen_generate_image',
    arguments: {
      prompt: 'A beautiful sunset over mountains',
      sampleCount: 2,
      aspectRatio: '16:9'
    }
  }
};

// Send requests after a short delay
setTimeout(() => {
  console.log('Sending list tools request...');
  server.stdin.write(JSON.stringify(listToolsRequest) + '\n');
}, 1000);

setTimeout(() => {
  console.log('\nSending test image generation request...');
  server.stdin.write(JSON.stringify(testImageRequest) + '\n');
}, 2000);

// Handle responses
server.stdout.on('data', (data) => {
  const lines = data.toString().split('\n').filter(line => line.trim());
  lines.forEach(line => {
    try {
      const response = JSON.parse(line);
      console.log('\nReceived response:');
      console.log(JSON.stringify(response, null, 2));
    } catch (e) {
      // Not JSON, ignore
    }
  });
});

// Exit after 5 seconds
setTimeout(() => {
  console.log('\nTest completed. Shutting down server...');
  server.kill();
  process.exit(0);
}, 5000);
