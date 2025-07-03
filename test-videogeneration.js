import dotenv from 'dotenv';
import { GoogleAuth } from 'google-auth-library';

dotenv.config();

async function testVideoGeneration() {
  console.log('🎬 Testing videogeneration@001 (VEO 3)...\n');
  
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
  const modelName = 'videogeneration@001';
  const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${project}/locations/${location}/publishers/google/models/${modelName}:predict`;
  
  console.log(`Endpoint: ${endpoint}\n`);
  
  // Try a simple video generation request
  const payload = {
    instances: [{
      prompt: 'A serene sunset over the ocean with gentle waves'
    }],
    parameters: {
      sampleCount: 1,
      aspectRatio: '16:9',
      duration: 5, // Try 'duration' instead of 'videoLength'
      videoLength: 5, // Also include videoLength just in case
      personGeneration: 'allow',
    }
  };
  
  console.log('Request payload:', JSON.stringify(payload, null, 2));
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    console.log(`\nResponse status: ${response.status}`);
    const text = await response.text();
    
    if (response.ok) {
      console.log('✅ Success! VEO 3 is working!');
      const data = JSON.parse(text);
      console.log('Response:', JSON.stringify(data, null, 2));
      
      // Check if we got video data
      if (data.predictions && data.predictions[0]) {
        console.log('\n🎥 Video generated successfully!');
        if (data.predictions[0].bytesBase64Encoded) {
          console.log('Video data received (base64 encoded)');
        }
        if (data.predictions[0].videoUri) {
          console.log('Video URI:', data.predictions[0].videoUri);
        }
      }
    } else {
      console.log('❌ Error response:', text);
      
      // Parse error for more details
      try {
        const error = JSON.parse(text);
        if (error.error?.message?.includes('quota')) {
          console.log('\n⚠️  Quota Issue Detected!');
          console.log('You need to request quota increase for videogeneration model.');
          console.log('\nTo fix this:');
          console.log('1. Go to: https://console.cloud.google.com/iam-admin/quotas');
          console.log('2. Search for "videogeneration"');
          console.log('3. Request quota increase');
        }
      } catch (e) {
        // Not JSON
      }
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}

testVideoGeneration().catch(console.error);
