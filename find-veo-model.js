import dotenv from 'dotenv';
import { VeoService } from './dist/services/veo.service.js';

dotenv.config();

// Test different VEO model names
async function findVeoModel() {
  console.log('🔍 Searching for correct VEO model name...\n');
  
  const possibleModelNames = [
    'veo',
    'veo-1',
    'veo-2', 
    'veo-3',
    'veo-001',
    'veo-002',
    'veo-003',
    'veo-1.0-001',
    'veo-2.0-001',
    'veo-3.0-001',
    'videopoet',
    'imagen-video',
    'imagen-video-001',
    'text-to-video',
    'text-to-video-001',
    'video-generation',
    'video-generation-001'
  ];
  
  for (const modelName of possibleModelNames) {
    console.log(`Testing model: ${modelName}`);
    
    try {
      const response = await fetch(
        `https://us-central1-aiplatform.googleapis.com/v1/projects/starry-center-464218-r3/locations/us-central1/publishers/google/models/${modelName}:predict`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${await getAccessToken()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            instances: [{ prompt: 'test' }],
            parameters: { sampleCount: 1 }
          }),
        }
      );
      
      if (response.status === 404) {
        console.log(`  ❌ Not found`);
      } else {
        console.log(`  ✅ Found! Status: ${response.status}`);
        const text = await response.text();
        console.log(`  Response: ${text.substring(0, 200)}...`);
      }
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
  }
}

async function getAccessToken() {
  const { GoogleAuth } = await import('google-auth-library');
  
  const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  let auth;
  
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
      auth = new GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
      });
    }
  } else {
    auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
  }
  
  const token = await auth.getAccessToken();
  return token;
}

findVeoModel().catch(console.error);
