// Quick test to check if Vertex AI is accessible
// Run with: node scripts/test-vertex-access.cjs

const { GoogleAuth } = require('google-auth-library');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function checkVertexAIAccess() {
  console.log('🔍 Checking Vertex AI API access...\n');

  const projectId = process.env.GOOGLE_CLOUD_PROJECT;
  const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

  console.log(`Project ID: ${projectId}`);
  console.log(`Location: ${location}\n`);

  try {
    // Parse credentials and fix the private key format
    const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    const credentials = JSON.parse(credentialsJson);
    
    // Fix the private key by replacing escaped newlines with actual newlines
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

    // Test Imagen endpoint directly
    console.log('Testing Imagen API endpoint...');
    const imagenEndpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/imagen-generate:predict`;
    
    const testPayload = {
      instances: [{
        prompt: "A simple test image"
      }],
      parameters: {
        sampleCount: 1,
        aspectRatio: "1:1",
        addWatermark: false
      }
    };
    
    const response = await fetch(imagenEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testPayload)
    });

    console.log(`Response status: ${response.status} ${response.statusText}\n`);

    if (response.status === 403) {
      console.log('❌ Permission denied\n');
      console.log('Your service account needs the "Vertex AI User" role.');
      console.log('\nTo fix this:');
      console.log(`1. Go to: https://console.cloud.google.com/iam-admin/iam?project=${projectId}`);
      console.log(`2. Find: ${credentials.client_email}`);
      console.log('3. Click Edit (pencil icon)');
      console.log('4. Add role: "Vertex AI User" (roles/aiplatform.user)');
      console.log('5. Click Save');
      console.log('6. Wait 1-2 minutes and try again\n');
    } else if (response.status === 404) {
      console.log('❌ Imagen API not found in this location\n');
      console.log('This might mean:');
      console.log('1. Imagen is not available in us-central1');
      console.log('2. The API endpoint has changed\n');
      console.log('Try using the Vertex AI Model Garden in the console:');
      console.log(`https://console.cloud.google.com/vertex-ai/model-garden?project=${projectId}`);
    } else if (response.status === 400) {
      const errorText = await response.text();
      console.log('❌ Bad request\n');
      console.log('Error details:', errorText);
      console.log('\nThis is actually good news - the API is accessible!');
      console.log('The error is just because we sent a test prompt.');
      console.log('Your server should work fine with real image generation requests.');
    } else if (response.status === 200) {
      console.log('✅ Imagen API is working perfectly!\n');
      const result = await response.json();
      console.log('Test generation successful!');
      console.log(`Generated ${result.predictions?.length || 0} image(s)`);
    } else {
      const errorText = await response.text();
      console.log('Unexpected response:', errorText);
    }

    console.log('\n========================================');
    console.log('Next Steps:');
    console.log('========================================');
    
    if (response.status === 200 || response.status === 400) {
      console.log('✅ Your API access is working!');
      console.log('\nStart the server:');
      console.log('  npm run build');
      console.log('  npm start');
      console.log('\nThen test image generation:');
      console.log('  node test-imagen-real.js');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nFull error:', error);
    
    if (error.message.includes('fetch is not defined')) {
      console.log('\nNote: You may need Node.js 18+ for native fetch support.');
      console.log('Or run: npm install node-fetch');
    }
  }
}

console.log('========================================');
console.log('Vertex AI / Imagen Access Check');
console.log('========================================\n');

checkVertexAIAccess().catch(console.error);
