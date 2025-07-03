import dotenv from 'dotenv';
import { GoogleAuth } from 'google-auth-library';

dotenv.config();

async function checkVeoEndpoints() {
  console.log('🔍 Checking VEO endpoints and regions...\n');
  
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
  } else {
    console.error('No service account credentials found');
    return;
  }
  
  const token = await auth.getAccessToken();
  
  // Try different regions
  const regions = ['us-central1', 'us-east1', 'us-west1', 'europe-west1', 'europe-west4', 'asia-northeast1'];
  
  // Try different endpoint patterns
  const endpoints = [
    // Standard Vertex AI prediction endpoint
    (region, project) => `https://${region}-aiplatform.googleapis.com/v1/projects/${project}/locations/${region}/endpoints`,
    // Beta endpoint
    (region, project) => `https://${region}-aiplatform.googleapis.com/v1beta1/projects/${project}/locations/${region}/publishers/google/models`,
    // Direct model listing
    (region, project) => `https://${region}-aiplatform.googleapis.com/v1/projects/${project}/locations/${region}/models`,
  ];
  
  const project = 'starry-center-464218-r3';
  
  for (const region of regions) {
    console.log(`\nChecking region: ${region}`);
    
    for (let i = 0; i < endpoints.length; i++) {
      const endpoint = endpoints[i](region, project);
      console.log(`  Endpoint ${i + 1}: ${endpoint}`);
      
      try {
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log(`    ✅ Success! Found ${data.models?.length || data.endpoints?.length || 0} items`);
          
          // Look for VEO-related models
          if (data.models) {
            const veoModels = data.models.filter(m => 
              m.displayName?.toLowerCase().includes('veo') ||
              m.displayName?.toLowerCase().includes('video') ||
              m.name?.toLowerCase().includes('veo') ||
              m.name?.toLowerCase().includes('video')
            );
            
            if (veoModels.length > 0) {
              console.log('    🎬 Found video-related models:');
              veoModels.forEach(m => {
                console.log(`      - ${m.name || m.displayName}`);
              });
            }
          }
        } else {
          console.log(`    ❌ Status: ${response.status}`);
        }
      } catch (error) {
        console.log(`    ❌ Error: ${error.message}`);
      }
    }
  }
  
  // Also try the specific VEO endpoint pattern that might be used
  console.log('\n\nTrying specific VEO patterns...');
  const veoPatterns = [
    'veo/predict',
    'veo:predict',
    'veo-v3:predict',
    'veo-v3/predict',
    'veo-3:generateVideo',
    'veo:generateVideo',
  ];
  
  for (const pattern of veoPatterns) {
    const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${project}/locations/us-central1/publishers/google/models/${pattern}`;
    console.log(`\nTrying: ${url}`);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instances: [{ prompt: 'test' }],
          parameters: {}
        }),
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

checkVeoEndpoints().catch(console.error);
