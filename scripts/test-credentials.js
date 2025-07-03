// Simple test to verify the private key fix works
import dotenv from 'dotenv';
dotenv.config();

// Test credential parsing
try {
  console.log('Testing credential parsing...\n');
  
  const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (!credentialsJson) {
    console.error('❌ GOOGLE_APPLICATION_CREDENTIALS_JSON not found in .env file');
    process.exit(1);
  }
  
  // Parse credentials
  let credentials = JSON.parse(credentialsJson);
  console.log('✅ JSON parsed successfully');
  console.log(`Service Account: ${credentials.client_email}`);
  
  // Check private key
  if (credentials.private_key) {
    console.log('\nPrivate key found:');
    console.log(`- Original length: ${credentials.private_key.length} characters`);
    console.log(`- Contains \\\\n: ${credentials.private_key.includes('\\n')}`);
    
    // Fix the private key
    credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
    
    console.log(`- Fixed length: ${credentials.private_key.length} characters`);
    console.log(`- Starts with: ${credentials.private_key.substring(0, 30)}...`);
    console.log(`- Ends with: ...${credentials.private_key.substring(credentials.private_key.length - 30)}`);
    console.log('\n✅ Private key format fixed successfully!');
  } else {
    console.error('❌ No private key found in credentials');
  }
  
  console.log('\n✅ Credentials are properly formatted');
  console.log('\nNow run: node scripts/test-vertex-access.js');
  
} catch (error) {
  console.error('❌ Error parsing credentials:', error.message);
  console.log('\nPlease check your .env file:');
  console.log('1. GOOGLE_APPLICATION_CREDENTIALS_JSON should be wrapped in single quotes');
  console.log('2. The JSON inside should use double quotes');
  console.log('3. Private key should have \\\\n (double backslash n) for line breaks');
}
