// Quick test to check if Vertex AI is accessible
// Run with: node scripts/test-vertex-access.js

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

    if (response.status === 403) {
      console.log('❌ Permission denied - Vertex AI API needs to be enabled\n');
      console.log('To enable:');
      console.log(`1. Go to: https://console.cloud.google.com/apis/library/aiplatform.googleapis.com?project=${projectId}`);
      console.log('2. Click "ENABLE"\n');
      console.log('Also ensure your service account has the "Vertex AI User" role:');
      console.log(`https://console.cloud.google.com/iam-admin/iam?project=${projectId}\n`);
    } else if (response.status === 404) {
      console.log('⚠️  API endpoint not found - this might be a region issue\n');
      console.log('Try changing GOOGLE_CLOUD_LOCATION in .env to one of:');
      console.log('- us-central1');
      console.log('- us-east1');
      console.log('- us-west1');
      console.log('- europe-west4\n');
    } else if (response.ok) {
      console.log('✅ Vertex AI API is accessible!\n');
      
      // Try to list available models
      const data = await response.json();
      console.log('Available models in this region:');
      if (data.models) {
        data.models.forEach(model => {
          console.log(`- ${model.name}`);
        });
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
      console.log('\nPrivate key parsing issue detected.');
      console.log('This is a known issue with escaped newlines in the credentials.');
      console.log('\nTrying alternative approach...\n');
      
      // Try an alternative test
      await testWithSimpleRequest();
    }
  }
}

async function testWithSimpleRequest() {
  try {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT;
    console.log('📋 Direct link to enable Vertex AI API:');
    console.log(`👉 https://console.cloud.google.com/apis/library/aiplatform.googleapis.com?project=${projectId}\n`);
    
    console.log('Click the link above and press "ENABLE" if not already enabled.\n');
    
    console.log('📋 Direct link to add IAM permissions:');
    console.log(`👉 https://console.cloud.google.com/iam-admin/iam?project=${projectId}\n`);
    
    console.log('Find your service account and add "Vertex AI User" role.\n');
    
    console.log('Once done, your server should work! Test with:');
    console.log('  npm run build');
    console.log('  npm start');
  } catch (error) {
    console.error('Alternative test failed:', error.message);
  }
}

console.log('========================================');
console.log('Vertex AI Access Check');
console.log('========================================\n');

checkVertexAIAccess();
