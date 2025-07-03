// quick-test.js - Quick test to see if permissions are fixed

require('dotenv').config();
const { ImagenService } = require('./dist/services/imagen.service.js');

async function quickTest() {
  console.log('🔍 Testing Imagen API access...\n');
  
  try {
    const imagenService = new ImagenService('', {
      mockMode: false,
      debug: true
    });
    
    console.log('Generating test image...');
    const result = await imagenService.generateImage(
      "A simple red circle on white background",
      "1:1",
      1
    );
    
    console.log('\n✅ SUCCESS! Permissions are working!');
    console.log('Generated', result.images.length, 'image(s)');
    console.log('\nYou can now run the full test:');
    console.log('  node test-imagen-save.js');
    
  } catch (error) {
    if (error.message.includes('Permission denied')) {
      console.log('❌ Still getting permission error.');
      console.log('\nMake sure you:');
      console.log('1. Added "Vertex AI User" role to your service account');
      console.log('2. Clicked SAVE');
      console.log('3. Waited 1-2 minutes for changes to propagate');
      console.log('\nTry again in a minute.');
    } else {
      console.log('❌ Error:', error.message);
    }
  }
}

quickTest();
