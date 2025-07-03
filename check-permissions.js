const https = require('https');

// Parse credentials from environment
require('dotenv').config();
const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

async function checkPermissions() {
    console.log('🔍 Checking Vertex AI permissions...\n');
    console.log(`Service Account: ${credentials.client_email}`);
    console.log(`Project: ${credentials.project_id}\n`);
    
    console.log('Steps to fix:');
    console.log('1. Go to: https://console.cloud.google.com/iam-admin/iam?project=' + credentials.project_id);
    console.log('2. Find: ' + credentials.client_email);
    console.log('3. Click the pencil icon to edit');
    console.log('4. Add role: "Vertex AI User"');
    console.log('5. Save and wait 30-60 seconds\n');
    
    console.log('Also ensure Vertex AI API is enabled:');
    console.log('https://console.cloud.google.com/apis/library/aiplatform.googleapis.com?project=' + credentials.project_id);
}

checkPermissions();
