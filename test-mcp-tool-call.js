// Test the MCP server with actual tool calls
const { spawn } = require('child_process');
const path = require('path');

// Set up environment
process.env.USE_MOCK = 'true';
process.env.NODE_ENV = 'production';

console.log('Testing MCP server with tool calls...\n');

// Spawn the server
const serverPath = path.join(__dirname, 'dist', 'index.js');
const server = spawn('node', [serverPath], {
  env: { ...process.env },
  stdio: ['pipe', 'pipe', 'pipe']
});

// Capture stdout
let stdoutData = '';
let responses = [];
server.stdout.on('data', (data) => {
  const lines = data.toString().split('\n').filter(line => line.trim());
  lines.forEach(line => {
    try {
      const parsed = JSON.parse(line);
      responses.push(parsed);
      console.log('RESPONSE:', JSON.stringify(parsed, null, 2));
    } catch (e) {
      if (line.trim()) {
        console.log('Non-JSON stdout:', line);
      }
    }
  });
});

// Capture stderr
server.stderr.on('data', (data) => {
  // Don't log stderr to avoid clutter
});

// Send requests
setTimeout(async () => {
  // Initialize
  const initRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'test-client', version: '1.0.0' }
    }
  };
  
  console.log('1. Sending initialize request...');
  server.stdin.write(JSON.stringify(initRequest) + '\n');
  
  // Wait a bit then list tools
  setTimeout(() => {
    const listToolsRequest = {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
      params: {}
    };
    
    console.log('\n2. Sending tools/list request...');
    server.stdin.write(JSON.stringify(listToolsRequest) + '\n');
    
    // Call imagen tool
    setTimeout(() => {
      const toolCallRequest = {
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: {
          name: 'imagen_generate_image',
          arguments: {
            prompt: 'A cute duck doing ninjutsu',
            aspectRatio: '1:1',
            sampleCount: 2
          }
        }
      };
      
      console.log('\n3. Sending imagen tool call...');
      server.stdin.write(JSON.stringify(toolCallRequest) + '\n');
    }, 1000);
  }, 1000);
}, 2000);

// Kill after 8 seconds
setTimeout(() => {
  server.kill();
  console.log('\n\nAll responses received:', responses.length);
  process.exit(0);
}, 8000);

server.on('error', (err) => {
  console.error('Server error:', err);
});
