import dotenv from 'dotenv';
import { GoogleAuth } from 'google-auth-library';

dotenv.config();

async function findLyriaModel() {
  console.log('🎵 Searching for Lyria 2 / Music Generation models...\n');
  
  const project = process.env.GOOGLE_CLOUD_PROJECT || 'starry-center-464218-r3';
  const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
  
  // Initialize auth
  let auth;
  const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  
  if (credentials) {
    try {
      let parsedCredentials = JSON.parse(credentials);
      if (parsedCredentials.private_key) {
        parsedCredentials.private_key = parsedCredentials.private_key.replace(/\\n/g, '\n');
      }
      auth = new GoogleAuth({
        credentials: parsedCredentials,
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
      });
    } catch (error) {
      console.error('Failed to parse credentials:', error);
      return;
    }
  }
  
  const token = await auth.getAccessToken();
  
  // Potential music/audio generation model names
  const modelNames = [
    // Following the pattern we found
    'musicgeneration@001',
    'musicgeneration@002',
    'audiogeneration@001',
    'audiogeneration@002',
    'soundgeneration@001',
    
    // Lyria-specific names
    'lyria@001',
    'lyria@002',
    'lyria-2@001',
    'lyria2@001',
    'lyria-v2@001',
    
    // Music-specific names
    'music@001',
    'musiclm@001',
    'musiclm@002',
    'musiccaps@001',
    
    // Other possible patterns
    'music-generation@001',
    'audio-generation@001',
    'lyria-music@001',
    'text-to-music@001',
    'texttomusic@001',
  ];
  
  console.log('Testing potential model names...\n');
  
  for (const model of modelNames) {
    const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${project}/locations/${location}/publishers/google/models/${model}:predict`;
    
    console.log(`Testing: ${model}`);
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instances: [{
            prompt: 'upbeat electronic dance music',
            textPrompt: 'upbeat electronic dance music', // Try both
          }],
          parameters: {
            sampleCount: 1,
            durationSeconds: 30,
            tempo: 'medium',
            genre: 'electronic',
          }
        })
      });
      
      console.log(`  Status: ${response.status}`);
      
      if (response.status === 429) {
        console.log('  🎵 FOUND! This is a music generation model (quota exceeded)');
        const text = await response.text();
        console.log(`  Response: ${text.substring(0, 300)}...`);
      } else if (response.status !== 404) {
        const text = await response.text();
        console.log(`  Response: ${text.substring(0, 200)}...`);
        
        // Check for music-related errors
        if (text.includes('music') || text.includes('audio') || text.includes('duration')) {
          console.log('  🎵 This might be a music endpoint!');
        }
      }
    } catch (error) {
      console.log(`  Error: ${error.message}`);
    }
  }
  
  // Also try listing all available models
  console.log('\n\nChecking all available models in project...\n');
  
  const listEndpoints = [
    `https://${location}-aiplatform.googleapis.com/v1/projects/${project}/locations/${location}/models`,
    `https://${location}-aiplatform.googleapis.com/v1/projects/${project}/locations/${location}/endpoints`,
    `https://${location}-aiplatform.googleapis.com/v1/projects/${project}/locations/${location}/publishers/google/models`,
  ];
  
  for (const endpoint of listEndpoints) {
    console.log(`Listing: ${endpoint}`);
    
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log(`  Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.models || data.endpoints) {
          const items = data.models || data.endpoints || [];
          console.log(`  Found ${items.length} items`);
          
          // Look for music/audio related models
          const musicItems = items.filter(item => 
            item.name?.toLowerCase().includes('music') ||
            item.name?.toLowerCase().includes('audio') ||
            item.name?.toLowerCase().includes('lyria') ||
            item.displayName?.toLowerCase().includes('music') ||
            item.displayName?.toLowerCase().includes('audio') ||
            item.displayName?.toLowerCase().includes('lyria')
          );
          
          if (musicItems.length > 0) {
            console.log('  🎵 Found music-related models:');
            musicItems.forEach(item => {
              console.log(`    - ${item.name} (${item.displayName || 'no display name'})`);
            });
          }
        }
      }
    } catch (error) {
      console.log(`  Error: ${error.message}`);
    }
  }
  
  console.log('\n📝 Note: If no music models were found, Lyria 2 might:');
  console.log('1. Require special allowlist access (separate from VEO)');
  console.log('2. Be available in a different region');
  console.log('3. Use a different API (like Google AI Studio)');
  console.log('4. Not be publicly available yet');
}

findLyriaModel().catch(console.error);
