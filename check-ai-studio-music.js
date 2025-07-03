import dotenv from 'dotenv';

dotenv.config();

async function checkGoogleAIStudioModels() {
  console.log('🎵 Checking Google AI Studio for music generation models...\n');
  
  // Check for API key
  const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY || 
                 process.env.GOOGLE_API_KEY || 
                 process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  
  if (!apiKey) {
    console.log('❌ No Google AI Studio API key found!\n');
    console.log('To get an API key:');
    console.log('1. Go to https://aistudio.google.com');
    console.log('2. Click "Get API key"');
    console.log('3. Create a new API key');
    console.log('4. Add to .env as GOOGLE_AI_STUDIO_API_KEY=your-key-here\n');
    
    console.log('Alternatively, Lyria 2 might be available through:');
    console.log('- MusicFX (https://musicfx.google.com) - Google\'s AI music tool');
    console.log('- AI Test Kitchen (https://aitestkitchen.withgoogle.com)');
    console.log('- Special preview program (check your emails)');
    return;
  }
  
  console.log('✅ Found API key, checking available models...\n');
  
  // List all available models
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    
    console.log(`List models status: ${response.status}\n`);
    
    if (response.ok) {
      const data = await response.json();
      
      console.log('📋 All available models:');
      data.models?.forEach(model => {
        console.log(`- ${model.name} (${model.displayName || 'no display name'})`);
        if (model.description) {
          console.log(`  ${model.description}`);
        }
        if (model.supportedGenerationMethods) {
          console.log(`  Methods: ${model.supportedGenerationMethods.join(', ')}`);
        }
      });
      
      // Look for audio/music models
      console.log('\n🎵 Looking for audio/music generation models...');
      const audioModels = data.models?.filter(m => 
        m.name?.toLowerCase().includes('audio') ||
        m.name?.toLowerCase().includes('music') ||
        m.name?.toLowerCase().includes('lyria') ||
        m.name?.toLowerCase().includes('sound') ||
        m.displayName?.toLowerCase().includes('audio') ||
        m.displayName?.toLowerCase().includes('music') ||
        m.displayName?.toLowerCase().includes('lyria') ||
        m.description?.toLowerCase().includes('audio') ||
        m.description?.toLowerCase().includes('music')
      );
      
      if (audioModels && audioModels.length > 0) {
        console.log('\n✅ Found audio/music models:');
        audioModels.forEach(m => {
          console.log(`\nModel: ${m.name}`);
          console.log(`Display Name: ${m.displayName || 'N/A'}`);
          console.log(`Description: ${m.description || 'N/A'}`);
          console.log(`Methods: ${m.supportedGenerationMethods?.join(', ') || 'N/A'}`);
        });
      } else {
        console.log('\n❌ No audio/music generation models found in the standard API');
      }
    } else {
      const error = await response.text();
      console.log('Error response:', error);
    }
  } catch (error) {
    console.log('Error listing models:', error.message);
  }
  
  // Try specific model endpoints that might exist
  console.log('\n\n🔍 Testing specific potential endpoints...\n');
  
  const potentialEndpoints = [
    // MusicLM style
    { model: 'musiclm', method: 'generateMusic' },
    { model: 'music-lm', method: 'generateMusic' },
    { model: 'models/musiclm', method: 'generateMusic' },
    
    // Lyria style  
    { model: 'lyria', method: 'generateMusic' },
    { model: 'lyria-2', method: 'generateMusic' },
    { model: 'models/lyria', method: 'generateMusic' },
    
    // Generic audio
    { model: 'audio-generation', method: 'generateAudio' },
    { model: 'models/audio-generation', method: 'generateContent' },
  ];
  
  for (const { model, method } of potentialEndpoints) {
    console.log(`Testing ${model}:${method}`);
    
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/${model}:${method}?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: 'upbeat electronic music',
            duration: 5,
            // Also try the standard generateContent format
            contents: [{
              parts: [{
                text: 'upbeat electronic music'
              }]
            }]
          })
        }
      );
      
      console.log(`  Status: ${response.status}`);
      if (response.status !== 404) {
        const text = await response.text();
        console.log(`  Response: ${text.substring(0, 200)}...`);
      }
    } catch (error) {
      console.log(`  Error: ${error.message}`);
    }
  }
  
  console.log('\n\n📝 Additional Information:');
  console.log('\nGoogle\'s music generation technology is available in:');
  console.log('1. MusicFX (https://musicfx.google.com) - Web app');
  console.log('2. AI Test Kitchen - Mobile app with MusicLM');
  console.log('3. YouTube Create - Has AI music features');
  console.log('\nHowever, direct API access might be:');
  console.log('- Not yet publicly available');
  console.log('- Requires special allowlist access');
  console.log('- Available through a different product/API');
  console.log('\nCheck your email for any communication about:');
  console.log('- "MusicLM API Access"');
  console.log('- "Lyria API Preview"');
  console.log('- "Audio Generation API"');
}

checkGoogleAIStudioModels().catch(console.error);
