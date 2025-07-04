// Test the MCP server output directly
const { spawn } = require('child_process');
const path = require('path');

// Set up environment
process.env.USE_MOCK = 'true';
process.env.NODE_ENV = 'production';

console.log('Testing MCP server output...\n');

// Spawn the server
const serverPath = path.join(__dirname, 'dist', 'index.js');
const server = spawn('node', [serverPath], {
  env: { ...process.env },
  stdio: ['pipe', 'pipe', 'pipe']
});

// Capture stdout
let stdoutData = '';
server.stdout.on('data', (data) => {
  stdoutData += data.toString();
  console.log('STDOUT:', data.toString());
});

// Capture stderr
server.stderr.on('data', (data) => {
  console.log('STDERR:', data.toString());
});

// Send a test request after 2 seconds
setTimeout(() => {
  const testRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'test-client',
        version: '1.0.0'
      }
    }
  };
  
  console.log('\nSending test request:', JSON.stringify(testRequest));
  server.stdin.write(JSON.stringify(testRequest) + '\n');
}, 2000);

// Kill after 5 seconds
setTimeout(() => {
  server.kill();
  console.log('\n\nRaw stdout data:');
  console.log(stdoutData);
  process.exit(0);
}, 5000);

server.on('error', (err) => {
  console.error('Server error:', err);
});
