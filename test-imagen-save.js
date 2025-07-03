// test-imagen-save.js
// Test script that saves generated images to files

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { ImagenService } = require('./dist/services/imagen.service.js');

// Create output directory
const outputDir = path.join(__dirname, 'generated-images');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

async function testAndSaveImages() {
  console.log('🎨 Generating and saving images...\n');

  try {
    const imagenService = new ImagenService('', {
      mockMode: process.env.USE_MOCK === 'true'
    });
    
    // Test 1: Landscape image
    console.log('Generating landscape image...');
    const landscape = await imagenService.generateImage(
      "A breathtaking mountain landscape at golden hour with dramatic clouds",
      "16:9",
      1
    );
    
    // Save the image
    const landscapeData = landscape.images[0].base64;
    const landscapeBuffer = Buffer.from(landscapeData, 'base64');
    const landscapePath = path.join(outputDir, 'landscape-16x9.png');
    fs.writeFileSync(landscapePath, landscapeBuffer);
    console.log(`✅ Saved: ${landscapePath}`);

    // Test 2: Portrait image  
    console.log('\nGenerating portrait image...');
    const portrait = await imagenService.generateImage(
      "A futuristic cyberpunk city street at night with neon signs",
      "9:16",
      1
    );
    
    const portraitData = portrait.images[0].base64;
    const portraitBuffer = Buffer.from(portraitData, 'base64');
    const portraitPath = path.join(outputDir, 'cyberpunk-9x16.png');
    fs.writeFileSync(portraitPath, portraitBuffer);
    console.log(`✅ Saved: ${portraitPath}`);

    // Test 3: Square images with variations
    console.log('\nGenerating abstract art variations...');
    const variations = await imagenService.generateImage(
      "Abstract geometric art with vibrant gradients and flowing shapes",
      "1:1",
      3  // Generate 3 variations
    );
    
    variations.images.forEach((image, index) => {
      const buffer = Buffer.from(image.base64, 'base64');
      const imagePath = path.join(outputDir, `abstract-variation-${index + 1}.png`);
      fs.writeFileSync(imagePath, buffer);
      console.log(`✅ Saved: ${imagePath}`);
    });

    console.log(`\n🎉 Successfully generated and saved ${3 + variations.images.length} images!`);
    console.log(`📁 Images saved to: ${outputDir}`);
    console.log('\nYou can now open the images in your favorite image viewer!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('quota')) {
      console.log('\nNote: Imagen has usage quotas during preview.');
      console.log('Check your quotas at: https://console.cloud.google.com/vertex-ai/quotas');
    }
  }
}

testAndSaveImages();
