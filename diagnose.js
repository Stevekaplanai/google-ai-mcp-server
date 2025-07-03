// diagnose.js - Quick diagnostic to check your setup

require('dotenv').config();

console.log('🔍 Google AI MCP Server Diagnostics\n');

// Check environment variables
console.log('1. Environment Variables:');
console.log('   Project ID:', process.env.GOOGLE_CLOUD_PROJECT || '❌ NOT SET');
console.log('   Location:', process.env.GOOGLE_CLOUD_LOCATION || '❌ NOT SET');
console.log('   Mock Mode:', process.env.USE_MOCK || 'false');

// Check credentials
const hasCredentials = !!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
console.log('   Service Account:', hasCredentials ? '✅ Found' : '❌ NOT FOUND');

if (hasCredentials) {
  try {
    const creds = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    console.log('   Service Email:', creds.client_email || '❌ Invalid');
    console.log('   Private Key:', creds.private_key ? '✅ Present' : '❌ Missing');
  } catch (e) {
    console.log('   ❌ Failed to parse credentials:', e.message);
  }
}

// Check if built
const fs = require('fs');
const path = require('path');
const distExists = fs.existsSync(path.join(__dirname, 'dist'));
const serviceExists = fs.existsSync(path.join(__dirname, 'dist', 'services', 'imagen.service.js'));

console.log('\n2. Build Status:');
console.log('   Dist folder:', distExists ? '✅ Exists' : '❌ Missing (run: npm run build)');
console.log('   Service files:', serviceExists ? '✅ Built' : '❌ Not built');

// Check dependencies
console.log('\n3. Dependencies:');
const deps = ['@modelcontextprotocol/sdk', 'google-auth-library', 'dotenv'];
deps.forEach(dep => {
  try {
    require.resolve(dep);
    console.log(`   ${dep}:`, '✅ Installed');
  } catch (e) {
    console.log(`   ${dep}:`, '❌ Not installed');
  }
});

// Recommendations
console.log('\n4. Recommendations:');
if (!distExists || !serviceExists) {
  console.log('   🔧 Run: rebuild.bat');
}
if (!hasCredentials) {
  console.log('   🔧 Check your .env file for GOOGLE_APPLICATION_CREDENTIALS_JSON');
}
if (process.env.USE_MOCK === 'true') {
  console.log('   ℹ️  Mock mode is ON - you won\'t make real API calls');
}

console.log('\n5. Next Steps:');
console.log('   If all checks pass, run: node test-imagen-save.js');
console.log('   For API access test, run: node scripts\\test-vertex-access.cjs');
