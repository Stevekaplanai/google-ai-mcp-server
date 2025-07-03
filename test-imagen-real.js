// test-imagen-real.js
// Test script for Google Imagen API with real API calls

// Load environment variables first
require('dotenv').config();

const { ImagenService } = require('./dist/services/imagen.service.js');

async function testImagenAPI() {
  console.log('🚀 Testing Google Imagen API with REAL calls...\n');

  try {
    // Initialize the service
    const imagenService = new ImagenService('', {
      mockMode: process.env.USE_MOCK === 'true'
    });
    
    // Test 1: Basic image generation
    console.log('Test 1: Basic image generation');
    console.log('Prompt: "A serene mountain landscape at sunset"');
    
    const result1 = await imagenService.generateImage(
      "A serene mountain landscape at sunset with vibrant colors",
      "16:9",
      1
    );
    
    console.log('✅ Success! Generated', result1.images.length, 'image(s)');
    console.log('Generation ID:', result1.images[0].generationId);
    console.log('Model:', result1.metadata.model);
    console.log('');

    // Test 2: Multiple images with negative prompt
    console.log('Test 2: Advanced generation with negative prompt');
    console.log('Prompt: "A futuristic city with flying cars"');
    console.log('Negative: "blurry, low quality"');
    
    const result2 = await imagenService.generateImage(
      "A futuristic city with flying cars and neon lights, cyberpunk style",
      "1:1",
      2,
      "blurry, low quality, distorted"
    );
    
    console.log('✅ Success! Generated', result2.images.length, 'image(s)');
    console.log('');

    // Test 3: Different aspect ratios
    console.log('Test 3: Testing different aspect ratios');
    const aspectRatios = ['9:16', '4:3', '3:4'];
    
    for (const ratio of aspectRatios) {
      console.log(`Testing ${ratio} aspect ratio...`);
      const result = await imagenService.generateImage(
        "A beautiful abstract art piece with vibrant colors",
        ratio,
        1
      );
      console.log(`✅ ${ratio} - Success!`);
    }
    
    console.log('\n🎉 All tests passed! Imagen API is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\nTroubleshooting tips:');
    console.error('1. Make sure the server is built: npm run build');
    console.error('2. Check if Vertex AI API is enabled in Google Cloud Console');
    console.error('3. Verify your service account has the correct permissions');
    console.error('4. Check quotas: https://console.cloud.google.com/vertex-ai/quotas');
  }
}

// Run the test
console.log('Environment check:');
console.log('- Project ID:', process.env.GOOGLE_CLOUD_PROJECT);
console.log('- Location:', process.env.GOOGLE_CLOUD_LOCATION);
console.log('- Mock Mode:', process.env.USE_MOCK);
console.log('');

testImagenAPI();
