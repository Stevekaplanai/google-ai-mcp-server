import { LyriaService } from './dist/services/lyria.service.js';

async function testLyria() {
  console.log('🎵 Testing Lyria 2 Music Generation...\n');
  
  const lyriaService = new LyriaService({
    mockMode: true,
    debug: true
  });
  
  console.log('📝 Note: Lyria 2 API is not publicly available.');
  console.log('This test uses mock mode to demonstrate the implementation.\n');
  
  try {
    // Test 1: Basic music generation
    console.log('Test 1: Generating upbeat electronic music...');
    const result1 = await lyriaService.generateMusic({
      textPrompt: 'upbeat electronic dance music with synth leads',
      durationSeconds: 30,
      genre: 'electronic',
      mood: 'energetic',
      tempo: 'fast'
    });
    
    console.log('✅ Success!');
    console.log(`Operation: ${result1.operationName}`);
    console.log(`Status: ${result1.status}`);
    console.log(`Audio URI: ${result1.response?.audio.uri}`);
    console.log(`Duration: ${result1.response?.audio.metadata?.duration}s`);
    console.log(`Genre: ${result1.response?.audio.metadata?.genre}`);
    console.log(`Tempo: ${result1.response?.audio.metadata?.tempo}\n`);
    
    // Test 2: Different style
    console.log('Test 2: Generating calm ambient music...');
    const result2 = await lyriaService.generateMusic({
      textPrompt: 'calm ambient music for meditation',
      durationSeconds: 60,
      genre: 'ambient',
      mood: 'peaceful',
      tempo: 'slow',
      musicalStructure: 'free-form'
    });
    
    console.log('✅ Success!');
    console.log(`Duration: ${result2.response?.audio.metadata?.duration}s`);
    console.log(`Structure: ${result2.response?.audio.metadata?.structure}\n`);
    
    // Test 3: Check operation status
    console.log('Test 3: Checking operation status...');
    const status = await lyriaService.getOperationStatus(result1.operationName);
    console.log(`Operation ${status.operationName} is ${status.status}\n`);
    
    // Show alternatives
    console.log('💡 Real Music Generation Alternatives:');
    console.log('1. MusicFX (Google): https://aitestkitchen.withgoogle.com/tools/music-fx');
    console.log('2. MusicGen (Meta): Available via Replicate API');
    console.log('3. Stable Audio: https://stableaudio.com');
    console.log('\n📧 To get Lyria API access when available:');
    console.log('- Contact your Google representative');
    console.log('- Watch for announcements at Google I/O');
    console.log('- Check Google AI blog for updates');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the test
testLyria().catch(console.error);
