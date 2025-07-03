import dotenv from 'dotenv';
import { GoogleAuth } from 'google-auth-library';

dotenv.config();

async function checkImagenVideoModels() {
  console.log('🔍 Checking if VEO is available as part of Imagen family...\n');
  
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
  
  // Video generation model names to try (similar to Imagen pattern)
  const videoModels = [
    'imagegeneration@006', // Current Imagen 3 model
    'imagegeneration@007', // Potential video model
    'videogeneration@001',
    'videogeneration@002',
    'videogeneration@003',
    'imagen-video@001',
    'imagen-video@002',
    'imagen-video@003',
    'imagen-3-video@001',
    'veo@001',
    'veo@002',
    'veo@003',
  ];
  
  console.log('Testing video generation endpoints similar to Imagen 3...\n');
  
  for (const model of videoModels) {
    const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${project}/locations/${location}/publishers/google/models/${model}:predict`;
    
    console.log(`Testing model: ${model}`);
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instances: [{
            prompt: 'A cat playing piano'
          }],
          parameters: {
            sampleCount: 1,
            // Try both image and video parameters
            aspectRatio: '16:9',
            videoLength: 5,
            duration: 5,
            fps: 30,
          }
        })
      });
      
      console.log(`  Status: ${response.status}`);
      
      if (response.status !== 404) {
        const text = await response.text();
        console.log(`  Response: ${text.substring(0, 200)}...`);
        
        // If we get a specific error about video, that's good - means the endpoint exists
        if (text.includes('video') || text.includes('duration') || text.includes('fps')) {
          console.log('  🎬 This might be a video endpoint!');
        }
      }
    } catch (error) {
      console.log(`  Error: ${error.message}`);
    }
  }
  
  // Also try the rawPredict endpoint (used for some models)
  console.log('\nTrying rawPredict endpoints...\n');
  
  const rawPredictModels = ['veo', 'veo-3', 'imagen-video'];
  
  for (const model of rawPredictModels) {
    const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${project}/locations/${location}/endpoints/${model}:rawPredict`;
    
    console.log(`Testing rawPredict: ${model}`);
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: 'A sunset timelapse',
          video_length: 5,
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

checkImagenVideoModels().catch(console.error);
