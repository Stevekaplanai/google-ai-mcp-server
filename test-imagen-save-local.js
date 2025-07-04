const { GoogleAuth } = require('google-auth-library');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

async function generateAndSaveImage() {
    console.log('🎨 Testing Imagen API with local image save...\n');
    
    const projectId = 'starry-center-464218-r3';
    const location = 'us-central1';
    
    try {
        // Authenticate
        const auth = new GoogleAuth({
            keyFilename: 'C:\\Users\\steve\\Desktop\\google-ai-mcp-server\\credentials\\service-account-key.json',
            scopes: ['https://www.googleapis.com/auth/cloud-platform']
        });
        
        const client = await auth.getClient();
        const token = await client.getAccessToken();
        
        console.log('✅ Authenticated successfully\n');
        
        // Prepare the request
        const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/imagen-3.0-generate-001:predict`;
        
        const prompt = "A photorealistic ninja duck wearing a black ninja outfit with a red headband, holding tiny katana swords, standing in a traditional Japanese dojo with cherry blossom petals falling in the background, dramatic lighting, highly detailed, 8k resolution";
        
        console.log('📝 Prompt:', prompt);
        console.log('\n🚀 Sending request to Imagen API...\n');
        
        const requestBody = {
            instances: [{
                prompt: prompt
            }],
            parameters: {
                sampleCount: 1,
                aspectRatio: "1:1",
                personGeneration: "allow",
                addWatermark: false,
                seed: 42
            }
        };
        
        const response = await axios.post(endpoint, requestBody, {
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Image generated successfully!\n');
        
        // Extract the base64 image
        if (response.data.predictions && response.data.predictions.length > 0) {
            const prediction = response.data.predictions[0];
            const base64Image = prediction.bytesBase64Encoded;
            
            if (base64Image) {
                // Create generated-images directory if it doesn't exist
                const outputDir = path.join(__dirname, 'generated-images');
                await fs.mkdir(outputDir, { recursive: true });
                
                // Generate filename with timestamp
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const filename = `ninja-duck-${timestamp}.png`;
                const filepath = path.join(outputDir, filename);
                
                // Convert base64 to buffer and save
                const imageBuffer = Buffer.from(base64Image, 'base64');
                await fs.writeFile(filepath, imageBuffer);
                
                console.log('💾 Image saved to:', filepath);
                console.log(`📁 File size: ${(imageBuffer.length / 1024).toFixed(2)} KB`);
                
                // Also save the metadata
                const metadataPath = path.join(outputDir, `ninja-duck-${timestamp}-metadata.json`);
                await fs.writeFile(metadataPath, JSON.stringify({
                    prompt: prompt,
                    model: 'imagen-3.0-generate-001',
                    parameters: requestBody.parameters,
                    generatedAt: new Date().toISOString(),
                    fileSize: imageBuffer.length
                }, null, 2));
                
                console.log('📋 Metadata saved to:', metadataPath);
                
            } else {
                console.error('❌ No image data in response');
            }
        } else {
            console.error('❌ No predictions in response');
            console.log('Response:', JSON.stringify(response.data, null, 2));
        }
        
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
        
        if (error.response) {
            console.log('\nStatus:', error.response.status);
            console.log('Headers:', error.response.headers);
            
            if (error.response.status === 403) {
                console.log('\n⚠️  Access denied. This could mean:');
                console.log('1. The Imagen API requires allowlist access');
                console.log('2. Your service account lacks necessary permissions');
                console.log('3. The API is not enabled for your project');
            }
        }
    }
}

// Run the test
generateAndSaveImage();
