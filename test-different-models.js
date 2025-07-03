// test-different-models.js - Test different Imagen model names

require('dotenv').config();
const { GoogleAuth } = require('google-auth-library');

async function testDifferentModels() {
  console.log('🔍 Testing different Imagen model endpoints...\n');
  
  const projectId = process.env.GOOGLE_CLOUD_PROJECT;
  const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
  
  // Different possible model names
  const modelNames = [
    'imagen-generate',
    'imagen-3.0-generate-001',
    'imagegeneration@006',
    'imagen-3.0-fast-generate-001',
    'imagen-3'
  ];
  
  try {
    // Setup auth
    const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    const credentials = JSON.parse(credentialsJson);
    credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
    
    const auth = new GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    
    console.log('Testing models in location:', location);
    console.log('Project:', projectId);
    console.log('');
    
    for (const modelName of modelNames) {
      const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${modelName}:predict`;
      
      console.log(`Testing: ${modelName}`);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          instances: [{ prompt: "test" }],
          parameters: { sampleCount: 1, aspectRatio: "1:1" }
        })
      });
      
      if (response.status === 403) {
        console.log(`  ❌ Permission denied (need Vertex AI User role)`);
      } else if (response.status === 404) {
        console.log(`  ❌ Model not found`);
      } else if (response.status === 400) {
        console.log(`  ✅ Model exists! (Bad request is expected for test)`);
      } else if (response.status === 200) {
        console.log(`  ✅ Model works!`);
      } else {
        console.log(`  ❓ Status: ${response.status}`);
      }
    }
    
    console.log('\n📝 Notes:');
    console.log('- If all show "Permission denied", add the Vertex AI User role');
    console.log('- If all show "Model not found", try a different region');
    console.log('- If any show "Model exists" or "Model works", that\'s the right model name');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testDifferentModels();
