import dotenv from 'dotenv';
import { GoogleAuth } from 'google-auth-library';

dotenv.config();

async function checkGenerativeAIEndpoints() {
  console.log('🔍 Checking Generative AI and other Google AI endpoints...\n');
  
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
  const project = 'starry-center-464218-r3';
  
  // Try different Google AI endpoints
  const endpoints = [
    // Generative AI API endpoints
    `https://generativelanguage.googleapis.com/v1beta/models`,
    `https://generativelanguage.googleapis.com/v1/models`,
    
    // AI Platform (new style)
    `https://aiplatform.googleapis.com/v1/projects/${project}/locations/us-central1/models`,
    `https://aiplatform.googleapis.com/v1beta1/projects/${project}/locations/us-central1/models`,
    
    // Direct VEO endpoints
    `https://veo.googleapis.com/v1/projects/${project}/videos:generate`,
    `https://video.googleapis.com/v1/projects/${project}/videos:generate`,
    `https://videogeneration.googleapis.com/v1/projects/${project}/videos:generate`,
    
    // Vertex AI with different paths
    `https://us-central1-aiplatform.googleapis.com/v1/projects/${project}/locations/us-central1/publishers/google/models`,
    `https://us-central1-aiplatform.googleapis.com/v1beta1/projects/${project}/locations/us-central1/publishers/google/models`,
    
    // Google AI Studio style endpoints
    `https://generativelanguage.googleapis.com/v1beta/models/veo:generateContent`,
    `https://generativelanguage.googleapis.com/v1beta/models/veo-3:generateContent`,
  ];
  
  for (const endpoint of endpoints) {
    console.log(`\nChecking: ${endpoint}`);
    
    try {
      const response = await fetch(endpoint, {
        method: endpoint.includes(':generate') ? 'POST' : 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: endpoint.includes(':generate') ? JSON.stringify({
          prompt: 'test',
          videoLength: 5
        }) : undefined,
      });
      
      console.log(`  Status: ${response.status}`);
      
      if (response.status !== 404 && response.status !== 400) {
        const text = await response.text();
        console.log(`  Response preview: ${text.substring(0, 300)}...`);
        
        // Parse and look for video models
        try {
          const data = JSON.parse(text);
          if (data.models) {
            const videoModels = data.models.filter(m => 
              m.name?.toLowerCase().includes('veo') ||
              m.name?.toLowerCase().includes('video') ||
              m.displayName?.toLowerCase().includes('veo') ||
              m.displayName?.toLowerCase().includes('video')
            );
            
            if (videoModels.length > 0) {
              console.log('  🎬 Found video models:');
              videoModels.forEach(m => {
                console.log(`    - ${m.name} (${m.displayName || 'no display name'})`);
                console.log(`      Supported methods: ${m.supportedGenerationMethods?.join(', ') || 'unknown'}`);
              });
            }
          }
        } catch (e) {
          // Not JSON or parsing error
        }
      }
    } catch (error) {
      console.log(`  Error: ${error.message}`);
    }
  }
  
  // Also check if VEO requires API key instead of OAuth
  console.log('\n\n🔑 Note: VEO 3 might require:');
  console.log('1. A specific API key from AI Studio (https://aistudio.google.com)');
  console.log('2. Special documentation from your Google contact who granted allowlist access');
  console.log('3. Access through a different product (e.g., Google AI Studio, MakerSuite)');
  console.log('\nDo you have any specific documentation or endpoint information from Google about VEO 3 access?');
}

checkGenerativeAIEndpoints().catch(console.error);
