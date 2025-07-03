require('dotenv').config(); // Load environment first
const ImagenService = require('./dist/services/imagen.service').ImagenService;

async function testPermissions() {
    const service = new ImagenService();
    let attempt = 1;
    
    console.log('🔄 Testing Vertex AI permissions every 10 seconds...');
    console.log('⏳ Add the "Vertex AI User" role in Google Cloud Console');
    console.log('   (This script will automatically detect when it\'s working)\n');
    
    while (true) {
        process.stdout.write(`Attempt ${attempt}... `);
        try {
            await service.generateImage({
                prompt: 'test',
                style: 'photorealistic'
            });
            console.log('✅ SUCCESS! Permissions are working!');
            console.log('\nYou can now run: node test-imagen-save.js');
            break;
        } catch (error) {
            if (error.message.includes('Permission')) {
                console.log('❌ Still waiting for permissions...');
            } else {
                console.log('❌ Error:', error.message);
            }
        }
        
        if (attempt >= 30) { // 5 minutes max
            console.log('\n⏱️  Timeout after 5 minutes. Please check:');
            console.log('1. You added "Vertex AI User" role to the service account');
            console.log('2. The Vertex AI API is enabled');
            break;
        }
        
        attempt++;
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
    }
}

testPermissions().catch(console.error);
