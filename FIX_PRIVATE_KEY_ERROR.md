# Fixing the Private Key Error

The error `error:1E08010C:DECODER routines::unsupported` is caused by the private key format. Here's how to fix it:

## Quick Fix

I've already updated the code to handle this automatically. Just rebuild and test:

```bash
# 1. Rebuild the project
npm run build

# 2. Test credentials
node scripts/test-credentials.js

# 3. Test API access
node scripts/test-vertex-access.js
```

## What Was Wrong?

The private key in your `.env` file has `\\n` (escaped newlines) that need to be converted to actual newlines for Google's auth library.

## The Fix Applied

The code now automatically converts `\\n` to proper newlines:
```javascript
credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
```

## If Still Having Issues

### Check Your .env File
Your `GOOGLE_APPLICATION_CREDENTIALS_JSON` should:
1. Be wrapped in single quotes: `'{"type":"service_account"...}'`
2. Have `\\n` (double backslash) in the private key
3. Use double quotes for JSON properties

### Test Step by Step
```bash
# 1. Test credential parsing
node scripts/test-credentials.js

# 2. Test API access
node scripts/test-vertex-access.js

# 3. If both pass, start the server
npm start
```

## Common Issues

1. **Permission Denied (403)**
   - Add "Vertex AI User" role in IAM console
   - Wait 2-3 minutes for permissions to propagate

2. **Model Not Found (404)**
   - Try changing region in .env to `us-east1`
   - Some models are region-specific

3. **Invalid Credentials**
   - Regenerate service account key if needed
   - Ensure JSON is properly formatted

## Success Indicators

When everything works, you'll see:
- ✅ Successfully obtained access token
- ✅ Vertex AI API is accessible!
- 🎉 Your server is ready to generate images!

Then you can run:
```bash
npm start
node test-imagen-real.js
```
