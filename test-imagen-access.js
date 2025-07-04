const { GoogleAuth } = require('google-auth-library');
const axios = require('axios');

async function testImagenAccess() {
    console.log('Testing Imagen API access...\n');
    
    const projectId = 'starry-center-464218-r3';
    const location = 'us-central1';
    
    try {
        // Load credentials from the service account key file
        const auth = new GoogleAuth({
            keyFilename: 'C:\\Users\\steve\\Desktop\\google-ai-mcp-server\\credentials\\service-account-key.json',
            scopes: ['https://www.googleapis.com/auth/cloud-platform']
        });
        
        const client = await auth.getClient();
        const token = await client.getAccessToken();
        
        console.log('✅ Successfully authenticated with Google Cloud');
        
        // Test listing Imagen models
        const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models`;
        
        const response = await axios.get(endpoint, {
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': 'application/json'
            },
            params: {
                filter: 'supportedGenerationMethods:generateImages'
            }
        });
        
        console.log('\n📋 Available Imagen models:');
        response.data.models?.forEach(model => {
            console.log(`- ${model.name}`);
            console.log(`  Display Name: ${model.displayName}`);
            console.log(`  Version: ${model.versionId}\n`);
        });
        
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
        
        if (error.response?.status === 403) {
            console.log('\n⚠️  The Imagen API might not be enabled for your project.');
            console.log('Please ensure you have requested access to the Imagen API.');
        }
    }
}

testImagenAccess();
