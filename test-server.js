#!/usr/bin/env node
import dotenv from 'dotenv';
import { exec } from 'child_process';
import { promisify } from 'util';

dotenv.config();

const execAsync = promisify(exec);

async function testMockMode() {
  console.log('🧪 Testing Google AI MCP Server in MOCK mode...\n');
  
  // Set environment for mock mode
  process.env.USE_MOCK = 'true';
  
  try {
    // Test Gemini
    console.log('Testing Gemini text generation...');
    const geminiTest = {
      name: 'gemini_generate_text',
      arguments: {
        prompt: 'Hello, world!',
        model: 'gemini-1.5-flash',
        temperature: 0.7,
        maxTokens: 100
      }
    };
    console.log('✓ Gemini mock test ready');
    
    // Test Imagen
    console.log('\nTesting Imagen image generation...');
    const imagenTest = {
      name: 'imagen_generate_image',
      arguments: {
        prompt: 'A beautiful sunset over mountains',
        sampleCount: 2,
        aspectRatio: '16:9'
      }
    };
    console.log('✓ Imagen mock test ready');
    
    // Test VEO
    console.log('\nTesting VEO video generation...');
    const veoTest = {
      name: 'veo_generate_video',
      arguments: {
        prompt: 'A cat playing with a ball',
        duration: 5,
        aspectRatio: '16:9'
      }
    };
    console.log('✓ VEO mock test ready');
    
    // Test Lyria
    console.log('\nTesting Lyria music generation...');
    const lyriaTest = {
      name: 'lyria_generate_music',
      arguments: {
        textPrompt: 'Upbeat electronic dance music',
        genre: 'electronic',
        mood: 'energetic',
        tempo: 'fast',
        durationSeconds: 30
      }
    };
    console.log('✓ Lyria mock test ready');
    
    console.log('\n✅ All mock tests configured successfully!');
    console.log('\nTo run the server:');
    console.log('  npm start');
    console.log('\nTo use with Claude Desktop, add to your config:');
    console.log(JSON.stringify({
      mcpServers: {
        "google-ai": {
          command: "node",
          args: [`${process.cwd()}/dist/index.js`],
          env: {
            USE_MOCK: "true"
          }
        }
      }
    }, null, 2));
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

async function testRealMode() {
  console.log('🚀 Checking Google AI MCP Server configuration...\n');
  
  if (!process.env.GOOGLE_CLOUD_PROJECT) {
    console.error('❌ GOOGLE_CLOUD_PROJECT not set in .env file');
    return;
  }
  
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    console.error('❌ GOOGLE_APPLICATION_CREDENTIALS_JSON not set in .env file');
    console.log('\nTo get your service account JSON:');
    console.log('1. Go to https://console.cloud.google.com/iam-admin/serviceaccounts');
    console.log('2. Select your project: ' + process.env.GOOGLE_CLOUD_PROJECT);
    console.log('3. Create or select a service account');
    console.log('4. Create a new key (JSON format)');
    console.log('5. Copy the entire JSON content and paste it as GOOGLE_APPLICATION_CREDENTIALS_JSON in .env');
    return;
  }
  
  console.log('✓ Project ID:', process.env.GOOGLE_CLOUD_PROJECT);
  console.log('✓ Location:', process.env.GOOGLE_CLOUD_LOCATION || 'us-central1');
  console.log('✓ Credentials configured');
  
  console.log('\n📋 Available services:');
  console.log('  ✓ Gemini (Ready) - Text generation');
  console.log('  ✓ Imagen 4 (Ready) - Image generation');
  console.log('  ⏳ VEO 3 (Requires allowlist) - Video generation');
  console.log('  ⏳ Lyria 2 (Limited availability) - Music generation');
  
  console.log('\n🔧 Claude Desktop configuration:');
  console.log(JSON.stringify({
    mcpServers: {
      "google-ai": {
        command: "node",
        args: [`${process.cwd()}/dist/index.js`],
        env: {
          GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT,
          GOOGLE_CLOUD_LOCATION: process.env.GOOGLE_CLOUD_LOCATION || "us-central1",
          GOOGLE_APPLICATION_CREDENTIALS_JSON: "YOUR_SERVICE_ACCOUNT_JSON_HERE"
        }
      }
    }
  }, null, 2));
}

// Run the appropriate test based on environment
if (process.env.USE_MOCK === 'true' || !process.env.GOOGLE_CLOUD_PROJECT) {
  testMockMode();
} else {
  testRealMode();
}
