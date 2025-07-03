import dotenv from 'dotenv';
import { VeoService } from './dist/services/veo.service.js';

dotenv.config();

// Test script for real VEO API (requires allowlist access)
async function testRealVeoAPI() {
  console.log('🎬 Testing Real VEO 3 API...\n');
  console.log('Note: This requires allowlist access from Google.\n');
  
  // Initialize VEO service for real API
  const veoService = new VeoService('', {
    mockMode: false, // Use real API
    debug: true
  });

  try {
    // Simple test with minimal parameters
    console.log('Generating a test video...');
    const result = await veoService.generateVideo({
      prompt: 'A peaceful ocean wave gently rolling onto a sandy beach at sunset',
      duration: 5,
      aspectRatio: '16:9',
      sampleCount: 1
    });
    
    console.log('✅ Video generation initiated!');
    console.log('Operation Name:', result.operationName);
    console.log('Videos:', result.videos);
    console.log('\n⏳ Note: VEO video generation is asynchronous.');
    console.log('Use the check_operation_status tool with the operation name to check progress.');
    
  } catch (error) {
    console.error('❌ VEO API error:', error.message);
    
    if (error.message.includes('not found')) {
      console.log('\n📝 Possible issues:');
      console.log('1. VEO 3 model name might be different (try veo-1, veo-2, veo-001, etc.)');
      console.log('2. VEO might not be available in your region');
      console.log('3. Your project might not have allowlist access');
      console.log('\nTo check available models, run:');
      console.log('gcloud ai models list --region=us-central1 --filter="displayName:veo"');
    }
    
    if (error.message.includes('PERMISSION_DENIED')) {
      console.log('\n🔐 Permission issue detected. Ensure:');
      console.log('1. Your service account has the Vertex AI User role');
      console.log('2. VEO API is enabled in your project');
      console.log('3. Your project has allowlist access for VEO');
    }
  }
}

// Check command line arguments
const useReal = process.argv.includes('--real');

if (useReal) {
  console.log('⚠️  WARNING: Attempting to use real VEO API');
  console.log('This requires special access from Google.\n');
  testRealVeoAPI();
} else {
  console.log('ℹ️  Use --real flag to test with actual VEO API');
  console.log('Example: node test-veo-real.js --real\n');
  console.log('For mock testing, use: node test-veo.js');
}
