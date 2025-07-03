// Quick test to check if Vertex AI is accessible
// Run with: node scripts/test-vertex-access-fixed.js

import { GoogleAuth } from 'google-auth-library';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

async function checkVertexAIAccess() {
  console.log('🔍 Checking Vertex AI API access...\n');

  const projectId = process.env.GOOGLE_CLOUD_PROJECT;
  const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

  console.log(`Project ID: ${projectId}`);
  console.log(`Location: ${location}\n`);

  try {
    // Parse credentials and fix the private key
    const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    const credentials = JSON.parse(credentialsJson);
    
    // Fix the private key by replacing \\n with actual newlines
    if (credentials.private_key) {
      credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
    }
    
    console.log(`Service Account: ${credentials.client_email}\n`);

    // Initialize auth
    const auth = new GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });

    // Get access token
    console.log('Getting access token...');
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    
    if (!accessToken.token) {
      throw new Error('Failed to get access token');
    }
    console.log('✅ Successfully obtained access token\n');

    // Test API endpoint
    console.log('Testing Vertex AI endpoint...');
    const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models`;
    
    const response = await fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${accessToken.token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`Response status: ${response.status}\n`);

    if (response.status === 403) {
      console.log('❌ Permission denied - Vertex AI API needs to be enabled\n');
      console.log('To enable:');
      console.log(`1. Go to: https://console.cloud.google.com/apis/library/aiplatform.googleapis.com?project=${projectId}`);
      console.log('2. Click "ENABLE"\n');
      console.log('Also ensure your service account has the "Vertex AI User" role:');
      console.log(`https://console.cloud.google.com/iam-admin/iam?project=${projectId}\n`);
      
      // Try to get more details
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error?.message) {
          console.log('Details:', errorData.error.message);
        }
      } catch (e) {
        // Not JSON
      }
    } else if (response.status === 404) {
      console.log('⚠️  API endpoint not found - Vertex AI might not be available in this region\n');
      console.log('Try a different region in your .env file:');
      console.log('- us-central1 (current)');
      console.log('- us-east1');
      console.log('- us-west1');
      console.log('- europe-west4\n');
    } else if (response.ok) {
      console.log('✅ Vertex AI API is accessible!\n');
      
      // Try to test the Imagen endpoint specifically
      console.log('Testing Imagen endpoint...');
      const imagenEndpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/imagen-generate:predict`;
      
      const imagenTest = await fetch(imagenEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          instances: [{ prompt: "test" }],
          parameters: { sampleCount: 1 }
        })
      });
      
      if (imagenTest.status === 404) {
        console.log('⚠️  Imagen model not found at expected endpoint');
        console.log('This might mean the model name has changed.');
      } else if (imagenTest.status === 400) {
        console.log('✅ Imagen endpoint is reachable! (400 is expected for test request)');
      } else {
        console.log(`Imagen endpoint response: ${imagenTest.status}`);
      }
      
      console.log('\n🎉 Your server is ready to generate images!');
      console.log('Run: npm start');
    } else {
      console.log(`❓ Unexpected response: ${response.status} ${response.statusText}`);
      const text = await response.text();
      console.log(text);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('Could not load the default credentials')) {
      console.log('\nCredentials issue detected. Check your .env file.');
    } else if (error.message.includes('DECODER')) {
      console.log('\nPrivate key parsing issue. The script should have fixed this automatically.');
      console.log('If the error persists, check that your .env file has the complete credentials.');
    }
  }
}

console.log('========================================');
console.log('Vertex AI Access Check (Fixed)');
console.log('========================================\n');

checkVertexAIAccess();
