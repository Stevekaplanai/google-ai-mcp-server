const { GoogleAuth } = require('google-auth-library');
const axios = require('axios');

async function checkVertexAI() {
    console.log('Checking Vertex AI access and available models...\n');
    
    const projectId = 'starry-center-464218-r3';
    const location = 'us-central1';
    
    try {
        // Load credentials
        const auth = new GoogleAuth({
            keyFilename: 'C:\\Users\\steve\\Desktop\\google-ai-mcp-server\\credentials\\service-account-key.json',
            scopes: ['https://www.googleapis.com/auth/cloud-platform']
        });
        
        const client = await auth.getClient();
        const token = await client.getAccessToken();
        
        console.log('✅ Successfully authenticated\n');
        
        // Test basic Vertex AI endpoint
        const baseEndpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}`;
        
        try {
            const response = await axios.get(`${baseEndpoint}/models`, {
                headers: {
                    'Authorization': `Bearer ${token.token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('📋 Available models:');
            if (response.data.models) {
                response.data.models.forEach(model => {
                    console.log(`\n- ${model.name}`);
                    console.log(`  Display Name: ${model.displayName}`);
                    if (model.supportedDeploymentResourcesTypes) {
                        console.log(`  Deployment Types: ${model.supportedDeploymentResourcesTypes.join(', ')}`);
                    }
                });
            } else {
                console.log('No models found in response');
            }
        } catch (error) {
            if (error.response?.status === 404) {
                console.log('⚠️  Models endpoint not found. Let\'s check publishers...\n');
                
                // Try publishers endpoint
                try {
                    const pubResponse = await axios.get(`${baseEndpoint}/publishers`, {
                        headers: {
                            'Authorization': `Bearer ${token.token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    console.log('📋 Available publishers:', pubResponse.data);
                } catch (pubError) {
                    console.log('Publishers endpoint also not accessible');
                }
            } else {
                console.error('Error accessing models:', error.response?.data || error.message);
            }
        }
        
        // Check if we can access Gemini
        console.log('\n\nChecking Gemini access...');
        try {
            const geminiEndpoint = `${baseEndpoint}/publishers/google/models/gemini-1.5-flash:generateContent`;
            const geminiResponse = await axios.post(geminiEndpoint, {
                contents: [{
                    parts: [{
                        text: "Hello"
                    }]
                }]
            }, {
                headers: {
                    'Authorization': `Bearer ${token.token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('✅ Gemini is accessible!');
        } catch (error) {
            console.log('❌ Gemini not accessible:', error.response?.status);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkVertexAI();
