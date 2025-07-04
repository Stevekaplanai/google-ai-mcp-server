const { GoogleAuth } = require('google-auth-library');
const axios = require('axios');

async function checkImagenModels() {
    console.log('Checking specifically for Imagen models...\n');
    
    const projectId = 'starry-center-464218-r3';
    const location = 'us-central1';
    
    try {
        const auth = new GoogleAuth({
            keyFilename: 'C:\\Users\\steve\\Desktop\\google-ai-mcp-server\\credentials\\service-account-key.json',
            scopes: ['https://www.googleapis.com/auth/cloud-platform']
        });
        
        const client = await auth.getClient();
        const token = await client.getAccessToken();
        
        console.log('✅ Authenticated successfully\n');
        
        // Known Imagen model endpoints
        const imagenModels = [
            'imagen-3.0-generate-001',
            'imagen-3.0-fast-generate-001',
            'imagegeneration',
            'imagen-005',
            'imagen-006'
        ];
        
        console.log('Testing known Imagen model endpoints:\n');
        
        for (const model of imagenModels) {
            const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:predict`;
            
            try {
                const response = await axios.post(endpoint, {
                    instances: [{
                        prompt: "test"
                    }],
                    parameters: {
                        sampleCount: 1
                    }
                }, {
                    headers: {
                        'Authorization': `Bearer ${token.token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                console.log(`✅ ${model} - ACCESSIBLE`);
            } catch (error) {
                const status = error.response?.status;
                if (status === 404) {
                    console.log(`❌ ${model} - Not found`);
                } else if (status === 403) {
                    console.log(`🔒 ${model} - Access denied (may need allowlist)`);
                } else if (status === 400) {
                    console.log(`⚠️  ${model} - Bad request (model exists but request format wrong)`);
                } else {
                    console.log(`❓ ${model} - Error: ${status || error.message}`);
                }
            }
        }
        
        // Check for Imagen through AI Studio API
        console.log('\n\nChecking AI Studio endpoints:\n');
        
        const studioEndpoint = `https://generativelanguage.googleapis.com/v1beta/models`;
        try {
            const studioResponse = await axios.get(studioEndpoint, {
                headers: {
                    'Authorization': `Bearer ${token.token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const imagenModels = studioResponse.data.models?.filter(m => 
                m.name.includes('imagen') || m.displayName?.includes('Imagen')
            );
            
            if (imagenModels?.length > 0) {
                console.log('✅ Found Imagen models in AI Studio:');
                imagenModels.forEach(m => {
                    console.log(`   - ${m.name} (${m.displayName})`);
                });
            } else {
                console.log('❌ No Imagen models found in AI Studio');
            }
        } catch (error) {
            console.log(`❌ AI Studio API error: ${error.response?.status || error.message}`);
        }
        
    } catch (error) {
        console.error('❌ Authentication error:', error.message);
    }
}

checkImagenModels();
