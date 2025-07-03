// Test script for Imagen API connection
import dotenv from 'dotenv';
import { ImagenService } from './src/services/imagen.service.js';

// Load environment variables
dotenv.config();

async function testImagenAPI() {
  console.log('🔍 Testing Imagen API Connection...\n');
  
  // Check environment variables
  console.log('📋 Environment Check:');
  console.log(`✓ Project ID: ${process.env.GOOGLE_CLOUD_PROJECT}`);
  console.log(`✓ Location: ${process.env.GOOGLE_CLOUD_LOCATION}`);
  console.log(`✓ Credentials: ${process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON ? 'Found' : 'Missing'}`);
  console.log(`✓ Mock Mode: ${process.env.USE_MOCK}\n`);

  try {
    // Initialize service
    const mockMode = process.env.USE_MOCK === 'true';
    console.log(`🚀 Initializing Imagen Service (Mode: ${mockMode ? 'MOCK' : 'PRODUCTION'})...\n`);
    
    const imagenService = new ImagenService('', {
      mockMode,
      debug: true
    });

    // Test 1: Basic image generation
    console.log('📸 Test 1: Basic Image Generation');
    console.log('Prompt: "A beautiful sunset over mountains"');
    
    const result1 = await imagenService.generateImage(
      'A beautiful sunset over mountains',
      '16:9',
      1
    );
    
    console.log('✅ Success! Generated', result1.images.length, 'image(s)');
    console.log('Metadata:', JSON.stringify(result1.metadata, null, 2));
    console.log('\n---\n');

    // Test 2: Multiple images with negative prompt
    console.log('📸 Test 2: Multiple Images with Negative Prompt');
    console.log('Prompt: "A futuristic cityscape with flying cars"');
    console.log('Negative: "blurry, low quality"');
    
    const result2 = await imagenService.generateImage(
      'A futuristic cityscape with flying cars',
      '1:1',
      2,
      'blurry, low quality'
    );
    
    console.log('✅ Success! Generated', result2.images.length, 'image(s)');
    console.log('Metadata:', JSON.stringify(result2.metadata, null, 2));
    console.log('\n---\n');

    // Test 3: Different aspect ratios
    console.log('📸 Test 3: Testing Different Aspect Ratios');
    const aspectRatios = ['1:1', '16:9', '9:16', '4:3', '3:4'];
    
    for (const ratio of aspectRatios) {
      console.log(`Testing ${ratio}...`);
      const result = await imagenService.generateImage(
        'Abstract geometric patterns',
        ratio,
        1
      );
      console.log(`✅ ${ratio} - Success!`);
    }
    
    console.log('\n🎉 All tests completed successfully!');
    
    if (mockMode) {
      console.log('\n⚠️  Note: Tests ran in MOCK mode. To test with real API:');
      console.log('1. Set USE_MOCK=false in .env');
      console.log('2. Ensure Vertex AI API is enabled');
      console.log('3. Run this script again');
    }

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    
    if (error.message.includes('permission')) {
      console.log('\n💡 Permission Error - Try these steps:');
      console.log('1. Enable Vertex AI API:');
      console.log('   gcloud services enable aiplatform.googleapis.com');
      console.log('2. Grant service account permissions:');
      console.log('   See IMAGEN_API_SETUP.md for commands');
    } else if (error.message.includes('quota')) {
      console.log('\n💡 Quota Error - Check your quotas:');
      console.log('   https://console.cloud.google.com/iam-admin/quotas');
    }
  }
}

// Run the test
testImagenAPI().catch(console.error);