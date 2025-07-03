import dotenv from 'dotenv';
import { VeoService } from './dist/services/veo.service.js';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

async function testVeoGeneration() {
  console.log('🎬 Testing VEO 3 Video Generation...\n');
  
  // Initialize VEO service
  const veoService = new VeoService('', {
    mockMode: true, // Set to false when you have VEO access
    debug: true
  });

  try {
    // Test 1: Generate a landscape video
    console.log('1. Generating landscape video...');
    const landscapeResult = await veoService.generateVideo({
      prompt: 'A serene mountain landscape with clouds moving across the sky, timelapse style',
      duration: 5,
      aspectRatio: '16:9',
      sampleCount: 1,
      personGeneration: 'disallow'
    });
    console.log('✅ Landscape video:', landscapeResult.videos[0].uri);
    
    // Test 2: Generate a portrait video
    console.log('\n2. Generating portrait video...');
    const portraitResult = await veoService.generateVideo({
      prompt: 'A glowing neon city street at night with rain effects, cyberpunk aesthetic',
      duration: 6,
      aspectRatio: '9:16',
      sampleCount: 1,
      negativePrompt: 'daytime, bright, sunny'
    });
    console.log('✅ Portrait video:', portraitResult.videos[0].uri);
    
    // Test 3: Generate multiple video variations
    console.log('\n3. Generating multiple video variations...');
    const multiResult = await veoService.generateVideo({
      prompt: 'Abstract flowing liquid metal transforming shapes, sci-fi style',
      duration: 8,
      aspectRatio: '1:1',
      sampleCount: 3
    });
    console.log(`✅ Generated ${multiResult.videos.length} videos:`);
    multiResult.videos.forEach((video, i) => {
      console.log(`   Video ${i + 1}: ${video.uri}`);
    });
    
    // Save video metadata locally (for mock mode)
    if (process.env.USE_MOCK === 'true') {
      console.log('\n4. Saving video metadata locally...');
      await veoService.saveVideosLocally(multiResult);
      console.log('✅ Metadata saved to ./generated-videos/');
    }
    
    console.log('\n✨ All VEO tests passed!');
    
  } catch (error) {
    console.error('❌ VEO test failed:', error);
    process.exit(1);
  }
}

// Run the test
testVeoGeneration();
