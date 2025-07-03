import dotenv from 'dotenv';
import { GoogleAuth } from 'google-auth-library';

dotenv.config();

async function comprehensiveMusicSearch() {
  console.log('🎵 Comprehensive search for music/audio generation models...\n');
  
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
  
  // Try to find any generation models with numbers
  console.log('Testing all @00X pattern models (like imagegeneration@006)...\n');
  
  const prefixes = [
    'musicgeneration',
    'audiogeneration',
    'soundgeneration',
    'audiosynth',
    'musicsynth',
    'lyria',
    'musiclm',
    'audioldm',
    'musicfx',
    'dreamtrack',
    'audiocraft',
    'musicgen',
  ];
  
  const found = [];
  
  for (const prefix of prefixes) {
    for (let i = 1; i <= 10; i++) {
      const model = `${prefix}@${String(i).padStart(3, '0')}`;
      const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${project}/locations/${location}/publishers/google/models/${model}:predict`;
      
      process.stdout.write(`Testing: ${model}`);
      
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            instances: [{
              prompt: 'test'
            }],
            parameters: {
              sampleCount: 1
            }
          })
        });
        
        if (response.status === 429) {
          console.log(` ✅ FOUND! (quota exceeded)`);
          found.push({ model, status: 429 });
        } else if (response.status !== 404) {
          console.log(` - Status: ${response.status}`);
          found.push({ model, status: response.status });
        } else {
          process.stdout.write(' ❌\n');
        }
      } catch (error) {
        console.log(` - Error: ${error.message}`);
      }
    }
  }
  
  if (found.length > 0) {
    console.log('\n🎉 Found models:');
    found.forEach(f => {
      console.log(`- ${f.model} (status: ${f.status})`);
    });
  } else {
    console.log('\n❌ No music generation models found');
  }
  
  // Check regions
  console.log('\n\nChecking different regions...\n');
  const regions = ['us-east1', 'us-west1', 'europe-west1', 'europe-west4', 'asia-northeast1'];
  
  for (const region of regions) {
    const endpoint = `https://${region}-aiplatform.googleapis.com/v1/projects/${project}/locations/${region}/publishers/google/models/musicgeneration@001:predict`;
    
    console.log(`Testing region ${region}...`);
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instances: [{
            prompt: 'test'
          }],
          parameters: {}
        })
      });
      
      if (response.status !== 404) {
        console.log(`  ✅ Region ${region} might have music models! Status: ${response.status}`);
      }
    } catch (error) {
      console.log(`  Error: ${error.message}`);
    }
  }
  
  // Check if audio generation is part of multimodal models
  console.log('\n\nChecking multimodal endpoints...\n');
  
  const multimodalEndpoints = [
    'multimodalgeneration@001',
    'multimodal@001',
    'gemini-multimodal',
    'unified-generation@001',
  ];
  
  for (const model of multimodalEndpoints) {
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
            prompt: 'generate music: upbeat electronic'
          }],
          parameters: {
            outputModality: 'audio'
          }
        })
      });
      
      console.log(`  Status: ${response.status}`);
      if (response.status !== 404) {
        const text = await response.text();
        console.log(`  Response: ${text.substring(0, 200)}...`);
      }
    } catch (error) {
      console.log(`  Error: ${error.message}`);
    }
  }
}

comprehensiveMusicSearch().catch(console.error);
