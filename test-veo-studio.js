import dotenv from 'dotenv';

dotenv.config();

async function testVEOWithAPIKey() {
  console.log('🔍 Testing VEO 3 access with Google AI Studio API key...\n');
  
  // Check if you have a Google AI Studio API key
  const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY || process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    console.log('❌ No API key found!');
    console.log('\nTo get a Google AI Studio API key:');
    console.log('1. Go to https://aistudio.google.com');
    console.log('2. Click on "Get API key"');
    console.log('3. Create a new API key');
    console.log('4. Add it to your .env file as GOOGLE_AI_STUDIO_API_KEY=your-key-here');
    return;
  }
  
  console.log('✅ Found API key, testing endpoints...\n');
  
  // Model names to try
  const modelNames = [
    'veo',
    'veo-3',
    'veo-003',
    'veo-v3',
    'veo-preview',
    'veo-beta',
    'models/veo',
    'models/veo-3',
    'models/veo-003',
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
                text: 'A beautiful sunset over mountains'
              }]
            }],
            generationConfig: {
              videoLength: 5
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
    
    // Method 2: generateVideo endpoint
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/${model}:generateVideo?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: 'A beautiful sunset over mountains',
            videoLength: 5,
            aspectRatio: '16:9'
          })
        }
      );
      
      console.log(`  generateVideo status: ${response.status}`);
      if (response.status !== 404) {
        const data = await response.text();
        console.log(`  Response: ${data.substring(0, 200)}...`);
      }
    } catch (error) {
      console.log(`  Error: ${error.message}`);
    }
  }
  
  // Also list available models
  console.log('\n📋 Listing available models...');
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    
    console.log(`List models status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log('\nAvailable models:');
      data.models?.forEach(model => {
        console.log(`- ${model.name} (${model.displayName || 'no display name'})`);
        if (model.supportedGenerationMethods) {
          console.log(`  Methods: ${model.supportedGenerationMethods.join(', ')}`);
        }
      });
      
      // Look for video models
      const videoModels = data.models?.filter(m => 
        m.name?.toLowerCase().includes('veo') ||
        m.name?.toLowerCase().includes('video') ||
        m.displayName?.toLowerCase().includes('veo') ||
        m.displayName?.toLowerCase().includes('video')
      );
      
      if (videoModels?.length > 0) {
        console.log('\n🎬 Video models found:');
        videoModels.forEach(m => {
          console.log(`- ${m.name}`);
        });
      }
    } else {
      const error = await response.text();
      console.log(`Error: ${error}`);
    }
  } catch (error) {
    console.log(`Error listing models: ${error.message}`);
  }
}

testVEOWithAPIKey().catch(console.error);
