# 🚨 QUICK FIX: API Routes 404/500 Errors in Production

## Problem
- Login fails with 500 error
- API routes return 404 errors
- App works locally but fails in Azure

## Root Causes
1. ✅ bcrypt native bindings fail in serverless (FIXED)
2. ⚠️ Azure App Service not configured to run Next.js standalone server

## 🎯 Solution (3 Steps)

### 1. Set Startup Command in Azure
```powershell
az webapp config set --name huronportal-app --resource-group huronportal-rg --startup-file "node server.js"
```

**OR** in Azure Portal:
- Configuration → General settings → Startup Command: `node server.js`

### 2. Verify Environment Variables
```powershell
az webapp config appsettings list --name huronportal-app --resource-group huronportal-rg
```

Must have:
- `COSMOS_ENDPOINT`
- `COSMOS_KEY`
- `COSMOS_DATABASE`
- `SESSION_SECRET`
- `NODE_ENV=production`

### 3. Deploy Fixed Code
```powershell
git add .
git commit -m "Fix: Azure deployment configuration and bcryptjs"
git push origin main
```

## 🔧 Automated Setup
Run this script to configure everything:
```powershell
.\configure-azure.ps1 -AppName huronportal-app -ResourceGroup huronportal-rg
```

## ✅ Verify It Works
```powershell
# Watch logs
az webapp log tail --name huronportal-app --resource-group huronportal-rg

# Test the app
https://huronportal-app.azurewebsites.net/login
```

## 📝 What Changed
- ✅ Replaced `bcrypt` with `bcryptjs` (no native bindings)
- ✅ Added `web.config` for Azure IIS
- ✅ Added `ecosystem.config.js` for PM2
- ✅ Updated GitHub Actions deployment workflow
- ✅ Added enhanced error logging

## 🆘 Still Not Working?
Check logs for specific error:
```powershell
az webapp log tail --name huronportal-app --resource-group huronportal-rg
```

Look for:
- "Missing required environment variables"
- "Cosmos DB configuration error"
- "User not found"
- "Password verification failed"
