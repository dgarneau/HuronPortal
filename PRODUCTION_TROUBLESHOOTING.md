# Production Troubleshooting Guide

## Current Issues & Solutions

### Issue 1: API Routes Returning 404/500 Errors ⚠️

**Symptoms:**
```
Failed to load resource: the server responded with a status of 404 ()
api/auth/login:1  Failed to load resource: the server responded with a status of 500 ()
```

**Root Causes:**
1. ✅ **bcrypt compatibility** (FIXED) - Replaced with `bcryptjs`
2. ⚠️ **Azure deployment configuration** - Need to configure startup command

**Solutions Applied:**

#### 1. Fixed bcrypt Compatibility
- Replaced native `bcrypt` with `bcryptjs` (pure JavaScript)
- Works reliably in serverless/production environments

#### 2. Added Azure Deployment Configuration
- Created `web.config` for IIS/Azure App Service
- Created `ecosystem.config.js` for PM2 process management
- Updated GitHub Actions workflow to include all necessary files

---

## 🚀 Immediate Action Required

### Step 1: Configure Azure App Service Startup Command

You need to set the startup command in Azure Portal:

1. Go to **Azure Portal** → Your App Service
2. Navigate to **Configuration** → **General settings**
3. Set **Startup Command** to:
   ```
   node server.js
   ```
4. Click **Save** and restart the app

**Alternative (using PM2):**
```
pm2 start ecosystem.config.js --no-daemon
```

**Or use Azure CLI:**
```powershell
az webapp config set --name huronportal-app --resource-group huronportal-rg --startup-file "node server.js"
az webapp restart --name huronportal-app --resource-group huronportal-rg
```

### Step 2: Verify Environment Variables

In Azure Portal → Configuration → Application settings, ensure these are set:

```bash
COSMOS_ENDPOINT=https://your-cosmos-account.documents.azure.com:443/
COSMOS_KEY=your-primary-key-here
COSMOS_DATABASE=huronportal-db
SESSION_SECRET=your-secure-random-string
SESSION_DURATION=3600
NODE_ENV=production
PORT=8080
WEBSITE_NODE_DEFAULT_VERSION=20-lts
```

### Step 3: Deploy Updated Code

```powershell
git add .
git commit -m "Fix: Add Azure deployment configuration and bcryptjs"
git push origin main
```

Wait for GitHub Actions to complete, then restart your Azure App Service.

---

## Production Environment Variable Checklist

Before deploying, ensure these environment variables are set in your production environment:

### Required Variables

```bash
# Azure Cosmos DB Configuration
COSMOS_ENDPOINT=https://your-cosmos-account.documents.azure.com:443/
COSMOS_KEY=your-primary-key-here
COSMOS_DATABASE=huronportal-db

# Session Configuration
SESSION_SECRET=your-secure-random-string-here
SESSION_DURATION=3600

# Environment
NODE_ENV=production
```

### How to Set Environment Variables in Azure App Service

1. Go to Azure Portal
2. Navigate to your App Service
3. Go to **Configuration** → **Application settings**
4. Add each variable as a new application setting
5. Click **Save** and restart the app

---

## Debugging Production Issues

### View Logs in Azure

1. **Azure Portal Method:**
   - Go to your App Service
   - Click on **Log stream** in the left menu
   - Watch real-time logs

2. **CLI Method:**
   ```powershell
   az webapp log tail --name your-app-name --resource-group your-resource-group
   ```

### Look for These Log Messages

With the new enhanced logging, you'll see detailed messages:

✅ **Successful login flow:**
```
Login attempt for user: admin
Looking up user: admin
User found, verifying password
Password verified, creating session
Login successful for user: admin
```

❌ **Environment variable issues:**
```
Missing required environment variables: COSMOS_ENDPOINT or COSMOS_KEY
```

❌ **Cosmos DB connection issues:**
```
Cosmos DB configuration error:
COSMOS_ENDPOINT: set
COSMOS_KEY: missing
```

❌ **User not found:**
```
Login attempt for user: test
Looking up user: test
User not found by username, trying email
User not found or inactive
```

❌ **Invalid password:**
```
User found, verifying password
Password verification failed
```

---

## Common Production Issues & Solutions

### Issue 1: Missing Environment Variables
**Symptom:** Error about missing COSMOS_ENDPOINT or COSMOS_KEY

**Solution:**
1. Verify environment variables are set in Azure Portal
2. Ensure there are no extra spaces or quotes
3. Restart the App Service after adding variables

### Issue 2: Cosmos DB Connection Timeout
**Symptom:** Timeout errors when connecting to Cosmos DB

**Solution:**
1. Check Cosmos DB firewall settings
2. Ensure "Allow access from Azure services" is enabled
3. Verify the COSMOS_ENDPOINT URL is correct (should end with :443/)

### Issue 3: Invalid Credentials Error
**Symptom:** 401 error with "INVALID_CREDENTIALS"

**Solution:**
1. Verify the user exists in the database
2. Check if the user is active (`isActive: true`)
3. Ensure password hash was created with the same bcrypt/bcryptjs library
4. Re-run the admin seed script if needed: `npm run db:seed:admin`

### Issue 4: Session/Cookie Issues
**Symptom:** Login succeeds but session is not persisted

**Solution:**
1. Verify SESSION_SECRET is set in production
2. Check that cookies are being set (browser DevTools → Application → Cookies)
3. Ensure your domain supports secure cookies
4. Check that `secure: true` is appropriate for your setup

---

## Testing the Fix

### Local Testing
```powershell
# 1. Rebuild the application
npm run build

# 2. Test production mode locally
npm run start

# 3. Try logging in at http://localhost:3000/login
```

### Deploy to Production
```powershell
# If using Azure App Service
git add .
git commit -m "Fix: Replace bcrypt with bcryptjs for production compatibility"
git push

# Or redeploy using your CI/CD pipeline
```

### Verify in Production
1. Open browser DevTools (F12)
2. Go to Network tab
3. Navigate to your login page
4. Enter credentials and click login
5. Check the response from `/api/auth/login`
   - Should be 200 (success) not 500 (error)
6. Check Azure logs for detailed error messages if still failing

---

## Re-seeding Users (If Needed)

If you need to recreate the admin user with the new bcryptjs hashing:

```powershell
# Make sure environment variables are set
npm run db:seed:admin
```

This will create/update an admin user with:
- Username: `admin`
- Password: `Admin123!`
- Role: `admin`

---

## Next Steps After Fixing

1. ✅ **Deploy the changes** to production
2. ✅ **Verify environment variables** are set in Azure
3. ✅ **Test login** functionality
4. ✅ **Check logs** in Azure Log Stream
5. ✅ **Re-seed admin user** if password hashes are incompatible
6. ✅ **Remove console.log statements** from production code (optional, for security)

---

## Contact & Support

If the issue persists after these fixes:

1. Check Azure Log Stream for detailed error messages
2. Verify all environment variables are correctly set
3. Test Cosmos DB connection independently
4. Ensure the admin user exists and is active
5. Verify the deployment completed successfully

**Most Common Root Cause:** Missing or incorrect environment variables in Azure App Service configuration.
