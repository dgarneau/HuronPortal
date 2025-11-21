# Final Fix for bcrypt/bcryptjs Issue

## Problem
The application was failing on Azure App Service with `Error: Cannot find module 'bcrypt'`.
This was caused by a combination of:
1. Using an npm alias `"bcrypt": "npm:bcryptjs@^3.0.3"` in `package.json`.
2. Next.js `standalone` build resolving the alias to the actual package name (`bcryptjs`) but not creating a `bcrypt` folder in the output `node_modules`.
3. Potential confusion in the module resolution process where the runtime expected `bcrypt` to exist.

## Solution
We have completely removed the dependency on the `bcrypt` package name and switched to using `bcryptjs` directly.

### Changes Made
1. **package.json**: Removed `"bcrypt": "npm:bcryptjs@^3.0.3"` alias. Ensured `"bcryptjs": "^3.0.3"` is present.
2. **Source Code**: Verified that all imports use `import ... from 'bcryptjs'` (specifically in `lib/auth/password.ts`).
3. **Build Verification**: Verified that `npm run build` succeeds and `node_modules/bcrypt` does not exist in the output, confirming no hidden dependencies.

## Next Steps for Deployment
1. **Commit and Push**:
   ```bash
   git add package.json package-lock.json
   git commit -m "Fix: Remove bcrypt alias and use bcryptjs directly to resolve module not found error"
   git push origin main
   ```

2. **Monitor Deployment**:
   - Go to GitHub Actions tab.
   - Watch the "Deploy to Azure App Service" workflow.

3. **Verify on Azure**:
   - Once deployed, check the logs:
     ```bash
     az webapp log tail --name huronportal-app --resource-group huronportal-rg
     ```
   - Try to login again.

## Why this works
By removing the alias, we eliminate the ambiguity. The application now explicitly depends on `bcryptjs`, imports `bcryptjs`, and the build system bundles `bcryptjs`. There is no reference to `bcrypt` anywhere in the dependency tree or source code, so the runtime will never attempt to load a module named `bcrypt`.
