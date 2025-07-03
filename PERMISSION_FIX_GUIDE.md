# 🚨 Permission Error - Almost There!

## You're 99% Done! Just Need One Permission

The good news: **Everything is working** except for one IAM permission.

## 🔧 Quick Fix (2 clicks):

### Option 1: Use the Helper Script
```bash
.\add-permissions.bat
```
This will:
1. Show you the exact link to click
2. Guide you through adding the role
3. Test if it worked

### Option 2: Manual Fix

1. **Open IAM Settings**: https://console.cloud.google.com/iam-admin/iam?project=starry-center-464218-r3

2. **Find Your Service Account**:
   ```
   google-ai-mcp-server-service-a@starry-center-464218-r3.iam.gserviceaccount.com
   ```

3. **Add Role**:
   - Click the pencil icon (Edit)
   - Click "+ ADD ANOTHER ROLE"
   - Type: **Vertex AI User**
   - Select it and click SAVE

4. **Wait 1-2 minutes** (permissions need time to propagate)

5. **Test Again**:
   ```bash
   node quick-test.js
   ```

## 🎯 What's Happening?

- ✅ Your API is enabled
- ✅ Your credentials are working
- ✅ The service is connecting to Google Cloud
- ❌ Just missing the "predict" permission

## 🧪 Debug Tools:

**Quick Permission Test**:
```bash
node quick-test.js
```

**Test Different Model Names** (if needed):
```bash
node test-different-models.js
```

## 📌 Common Issues:

1. **Still getting permission error after adding role?**
   - Make sure you clicked SAVE
   - Wait 2-3 minutes (permissions can be slow)
   - Try a different browser/incognito mode

2. **Can't find "Vertex AI User" role?**
   - Search for: `roles/aiplatform.user`
   - Or look under "AI Platform" roles

3. **Already has the role but still errors?**
   - Remove and re-add the role
   - Check if the API is enabled in your project

## 🎉 Once It Works:

You'll see:
```
✅ SUCCESS! Permissions are working!
Generated 1 image(s)
```

Then you can generate all the images you want! 🎨

---

**You're literally one permission away from success!** Add the "Vertex AI User" role and you're done. 🚀
