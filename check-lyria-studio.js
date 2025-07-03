import dotenv from 'dotenv';

dotenv.config();

async function checkLyriaStudioAPI() {
  console.log('🎵 Checking for Lyria 2 in Google AI Studio and other APIs...\n');
  
  // Check if you have a Google AI Studio API key
  const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY || process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    console.log('❌ No API key found!');
    console.log('\nLyria 2 might require:');
    console.log('1. A Google AI Studio API key');
    console.log('2. Special access through MusicLM or MusicFX');
    console.log('3. Access through Google Labs');
    return;
  }
  
  console.log('✅ Found API key, testing endpoints...\n');
  
  // Model names to try
  const modelNames = [
    'lyria',
    'lyria-2',
    'lyria-v2',
    'musiclm',
    'musicfx',
    'music-generation',
    'models/lyria',
    'models/lyria-2',
    'models/musiclm',
    'models/musicfx',
  ];
  
  // Try different endpoints
  for (const model of modelNames) {
    console.log(`Testing model: ${model}`);
    
    // Method 1: generateContent endpoint (like Gemini)
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: 'upbeat electronic dance music'
              }]
            }],
            generationConfig: {
              musicLength: 30,
              tempo: 'medium'
            }
          })
        }
      );
      
      console.log(`  generateContent status: ${response.status}`);
      if (response.status !== 404) {
        const data = await response.text();
        console.log(`  Response: ${data.substring(0, 200)}...`);
      }
    } catch (error) {
      console.log(`  Error: ${error.message}`);
    }
    
    // Method 2: generateMusic endpoint
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/${model}:generateMusic?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: 'upbeat electronic dance music',
            durationSeconds: 30,
            tempo: 'medium',
            genre: 'electronic'
          })
        }
      );
      
      console.log(`  generateMusic status: ${response.status}`);
      if (response.status !== 404) {
        const data = await response.text();
        console.log(`  Response: ${data.substring(0, 200)}...`);
      }
    } catch (error) {
      console.log(`  Error: ${error.message}`);
    }
  }
  
  // List available models
  console.log('\n📋 Listing available models in AI Studio...');
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    
    console.log(`List models status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log('\nAll available models:');
      data.models?.forEach(model => {
        console.log(`- ${model.name} (${model.displayName || 'no display name'})`);
        if (model.supportedGenerationMethods) {
          console.log(`  Methods: ${model.supportedGenerationMethods.join(', ')}`);
        }
      });
      
      // Look for music models
      const musicModels = data.models?.filter(m => 
        m.name?.toLowerCase().includes('lyria') ||
        m.name?.toLowerCase().includes('music') ||
        m.name?.toLowerCase().includes('audio') ||
        m.displayName?.toLowerCase().includes('lyria') ||
        m.displayName?.toLowerCase().includes('music') ||
        m.displayName?.toLowerCase().includes('audio')
      );
      
      if (musicModels?.length > 0) {
        console.log('\n🎵 Music models found:');
        musicModels.forEach(m => {
          console.log(`- ${m.name}`);
        });
      } else {
        console.log('\n❌ No music models found in AI Studio');
      }
    }
  } catch (error) {
    console.log(`Error listing models: ${error.message}`);
  }
}

// Also check for Lyria in other Google services
async function checkOtherGoogleAPIs() {
  console.log('\n\n🔍 Checking other Google APIs for Lyria...\n');
  
  // Check Google Labs / MusicFX
  console.log('📱 Google Labs / MusicFX:');
  console.log('Lyria 2 might be available through:');
  console.log('- MusicFX: https://aitestkitchen.withgoogle.com/tools/music-fx');
  console.log('- Google Labs: https://labs.google.com');
  console.log('- AI Test Kitchen app (mobile)');
  
  console.log('\n🌐 Known Lyria Information:');
  console.log('- Lyria is Google DeepMind\'s music generation model');
  console.log('- Powers YouTube\'s Dream Track feature');
  console.log('- Available in MusicFX (AI Test Kitchen)');
  console.log('- API access might be limited to partners');
  
  console.log('\n📞 Next Steps:');
  console.log('1. Check if you have access to MusicFX');
  console.log('2. Contact your Google representative about Lyria API access');
  console.log('3. Check if Lyria requires separate allowlist (like VEO)');
  console.log('4. Look for "MusicLM" or "AudioLM" as alternative names');
}

async function main() {
  await checkLyriaStudioAPI();
  await checkOtherGoogleAPIs();
  
  console.log('\n\n💡 Alternative Music Generation Options:');
  console.log('1. Use MusicGen (Meta) via Replicate or Hugging Face');
  console.log('2. Use Stable Audio (Stability AI)');
  console.log('3. Keep Lyria in mock mode until API access is available');
  console.log('4. Check if your VEO allowlist includes Lyria access');
}

main().catch(console.error);
