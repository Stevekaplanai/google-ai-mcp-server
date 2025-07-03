// test-mock-images.js
// Test with mock images first to ensure everything is working

require('dotenv').config();

// Force mock mode for this test
process.env.USE_MOCK = 'true';

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing with MOCK images first...\n');

// Since we're in mock mode, we can test without API access
try {
  const { ImagenService } = require('./dist/services/imagen.service.js');
  
  const imagenService = new ImagenService('', {
    mockMode: true,
    debug: true
  });
  
  console.log('✅ Service initialized successfully');
  
  // Create a simple test
  imagenService.generateImage(
    "Test prompt",
    "1:1",
    1
  ).then(result => {
    console.log('✅ Mock generation successful!');
    console.log('Generated:', result.images.length, 'image(s)');
    console.log('Mock data:', result.images[0].base64.substring(0, 50) + '...');
    console.log('\nNow rebuild and try with real API:');
    console.log('  rebuild.bat');
    console.log('  node test-imagen-save.js');
  }).catch(err => {
    console.error('Error:', err.message);
  });
  
} catch (error) {
  console.error('Failed to load service:', error.message);
  console.log('\nMake sure to build first:');
  console.log('  npm run build');
}
