# Quickstart Guide: Système de Gestion des Machines CNC

**Feature**: 001-cnc-machine-management  
**Target Audience**: Developers setting up the project for the first time

## Overview

This guide will help you set up and run the Huron Portal CNC management system locally. The frontend runs locally while connecting to the production backend API in Azure.

## Prerequisites

- **Node.js**: v20.x LTS or higher
- **npm** or **pnpm**: Latest version
- **Git**: For version control
- **VS Code**: Recommended IDE with extensions
- **Azure Account**: Access to `huronportal-rg` resource group

## Required VS Code Extensions

```bash
# Install recommended extensions
code --install-extension ms-azure-tools.vscode-azurefunctions
code --install-extension ms-azure-tools.azure-cosmos-db
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
```

## Step 1: Clone and Install

```powershell
# Clone repository
git clone <repository-url>
cd HuronPortal

# Checkout feature branch
git checkout 001-cnc-machine-management

# Install dependencies
npm install
# or
pnpm install
```

## Step 2: Environment Configuration

Create `.env.local` in the project root:

```env
# API Configuration (Production Backend)
NEXT_PUBLIC_API_URL=https://huronportal.azurestaticapps.net/api

# Azure Cosmos DB (Get from Azure Key Vault or team lead)
COSMOS_ENDPOINT=https://huronportal-cosmosdb.documents.azure.com:443/
COSMOS_KEY=<primary-key-from-azure>
COSMOS_DATABASE=huronportal-db

# Session Configuration
SESSION_SECRET=<generate-with-openssl-rand-base64-32>
SESSION_DURATION=3600

# Environment
NODE_ENV=development
NEXT_PUBLIC_APP_ENV=development
```

### Getting Azure Secrets

```powershell
# Login to Azure
az login

# Get Cosmos DB connection string
az cosmosdb keys list `
  --name huronportal-cosmosdb `
  --resource-group huronportal-rg `
  --type keys `
  --query primaryMasterKey `
  --output tsv
```

## Step 3: Database Setup (First Time Only)

The production Cosmos DB should already be configured, but verify containers exist:

```powershell
# Run verification script
npm run db:verify

# If containers missing, create them
npm run db:init
```

**Seed Admin User** (if not exists):

```powershell
# Creates default admin user
npm run db:seed:admin
# Username: admin
# Password: <provided-by-team-lead>
```

## Step 4: Run Development Server

```powershell
# Start Next.js development server
npm run dev

# Server starts at http://localhost:3000
```

Open browser to `http://localhost:3000` - you should see the login page.

## Step 5: Verify Setup

### Test Login
1. Navigate to `http://localhost:3000/login`
2. Enter credentials:
   - **Username**: `admin`
   - **Password**: `<from-team-lead>`
3. Should redirect to machine grid dashboard

### Test API Connection
```powershell
# Test auth endpoint
curl http://localhost:3000/api/auth/session

# Should return 401 Unauthorized (expected when not logged in)
```

### Check TypeScript Compilation
```powershell
# Build project
npm run build

# Should complete without errors
```

## Project Structure Overview

```
HuronPortal/
├── app/                      # Next.js App Router pages
│   ├── (auth)/login/         # Login page
│   ├── (app)/                # Protected pages
│   │   ├── page.tsx          # Machine grid (homepage)
│   │   ├── machines/         # Machine CRUD
│   │   ├── clients/          # Client CRUD
│   │   └── users/            # User management
│   └── api/                  # API Routes (backend)
│       ├── auth/             # Authentication
│       ├── machines/         # Machine endpoints
│       ├── clients/          # Client endpoints
│       └── users/            # User endpoints
├── components/               # React components
│   ├── ui/                   # Base UI components (Button, Input, etc.)
│   ├── forms/                # Form components with validation
│   ├── features/             # Feature-specific components
│   └── layout/               # Layout components (Nav, Header)
├── lib/                      # Utility libraries
│   ├── cosmos/               # Cosmos DB data access
│   ├── auth/                 # Authentication logic
│   ├── validation/           # Zod schemas + French messages
│   └── utils/                # Helper functions
├── types/                    # TypeScript type definitions
├── public/                   # Static assets
├── specs/                    # Feature specifications
│   └── 001-cnc-machine-management/
│       ├── spec.md           # Requirements
│       ├── plan.md           # Technical plan
│       ├── data-model.md     # Database schema
│       └── contracts/        # API contracts (OpenAPI)
└── .specify/                 # Project memory/constitution
```

## Development Workflow

### Creating a New Component

```powershell
# Create component file
New-Item -Path "components/ui/MyComponent.tsx" -ItemType File

# Component template (TypeScript + no native validation)
```

```typescript
import React from 'react';

interface MyComponentProps {
  // Props with explicit types
}

export const MyComponent: React.FC<MyComponentProps> = ({ }) => {
  return (
    <div className="...">
      {/* Tailwind CSS classes */}
    </div>
  );
};
```

### Creating a New API Route

```powershell
# Create route file
New-Item -Path "app/api/my-endpoint/route.ts" -ItemType File
```

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  // Validate session
  const session = await validateSession(request);
  if (!session) {
    return NextResponse.json(
      { error: 'Authentification requise', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }

  // Your logic here

  return NextResponse.json({ data });
}
```

### Adding Form Validation

```typescript
// lib/validation/schemas.ts
import { z } from 'zod';
import { messages } from './messages';

export const machineSchema = z.object({
  numeroOL: z.string()
    .min(1, messages.required)
    .max(50, messages.maxLength(50))
    .regex(/^[A-Z0-9-]+$/, messages.machine.invalidFormat),
  type: z.string()
    .min(1, messages.required)
    .max(200, messages.maxLength(200)),
  clientId: z.string()
    .uuid(messages.machine.clientRequired),
});
```

### Using Forms (No Native Validation)

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { machineSchema } from '@/lib/validation/schemas';

export const MachineForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(machineSchema),
  });

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      {/* noValidate disables browser validation */}
      <Input {...register('numeroOL')} error={errors.numeroOL?.message} />
    </form>
  );
};
```

## Common Tasks

### Running Tests

```powershell
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

### Linting and Formatting

```powershell
# Lint code
npm run lint

# Fix lint issues
npm run lint:fix

# Format code
npm run format
```

### Building for Production

```powershell
# Create production build
npm run build

# Start production server locally (testing)
npm run start
```

## Troubleshooting

### "Cannot connect to Cosmos DB"
- Verify `COSMOS_ENDPOINT` and `COSMOS_KEY` in `.env.local`
- Check Azure portal - Cosmos DB firewall may block your IP
- Add your IP: Azure Portal → Cosmos DB → Firewall and virtual networks

### "Session expired" on every request
- Check `SESSION_SECRET` is set in `.env.local`
- Verify cookies are enabled in browser
- Clear browser cookies and try again

### "Identifiants invalides" with correct password
- Verify admin user exists in database
- Check password hash format in database
- Re-run `npm run db:seed:admin`

### TypeScript errors after pulling latest
```powershell
# Clean and reinstall
Remove-Item -Recurse -Force node_modules, .next
npm install
npm run build
```

### Tailwind classes not applying
- Restart dev server (`Ctrl+C`, then `npm run dev`)
- Verify `tailwind.config.ts` includes correct content paths
- Check browser console for CSS loading errors

## Next Steps

1. **Read the Spec**: `specs/001-cnc-machine-management/spec.md`
2. **Review Data Model**: `specs/001-cnc-machine-management/data-model.md`
3. **Explore API Contracts**: `specs/001-cnc-machine-management/contracts/`
4. **Check Tasks**: `specs/001-cnc-machine-management/tasks.md` (after `/speckit.tasks`)

## Important Notes

### Custom Validation (No Browser Native)
- **Always** use `noValidate` on `<form>` elements
- Display errors using custom `<ErrorMessage>` components
- All error messages in French from `lib/validation/messages.ts`

### French Localization
- All UI text must be in French
- Use `lib/utils/format.ts` for dates (JJ/MM/AAAA format)
- Error messages defined in `lib/validation/messages.ts`

### Backend in Production
- Local dev frontend connects to production API
- No local Cosmos DB emulator needed
- Be cautious with write operations during development

### Role-Based Access
- Test with different roles (Admin, Contrôleur, Utilisateur)
- UI should hide unauthorized actions
- API enforces permissions server-side

## Support

- **Technical Issues**: Create issue in repository
- **Azure Access**: Contact DevOps team
- **Specification Questions**: Review `specs/` directory
- **Architecture Decisions**: See `.specify/memory/constitution.md`

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Azure Cosmos DB Docs](https://learn.microsoft.com/azure/cosmos-db/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
