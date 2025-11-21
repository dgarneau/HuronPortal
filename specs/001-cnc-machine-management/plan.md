# Implementation Plan: Système de Gestion des Machines CNC

**Branch**: `001-cnc-machine-management` | **Date**: 2025-11-20 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-cnc-machine-management/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a modern, sleek, and simple French-language web application for CNC machine management with role-based access (Admin, Contrôleur, Utilisateur). The system provides machine inventory visualization, client management, and user administration with custom form validation and error handling (no browser native validation). Technical approach uses Next.js App Router with TypeScript, Tailwind CSS, Azure Cosmos DB, and custom validation components for polished error messages in French.

## Technical Context

**Language/Version**: TypeScript 5.9.3 (strict mode), Node.js LTS  
**Primary Dependencies**: 
- Next.js 14.2.33 (App Router, SSR/SSG)
- React 18.3.1 with React DOM 18.3.1
- Tailwind CSS 3.4.18
- TanStack Query 5.90.5
- Azure Cosmos DB SDK (@azure/cosmos)
- bcrypt for password hashing
- Zod for schema validation
- React Hook Form for form management (disabling native validation)

**Storage**: Azure Cosmos DB (NoSQL API) with optimized partition keys  
**Testing**: Vitest for unit tests, React Testing Library for components, Playwright for E2E  
**Target Platform**: Web browsers (Chrome, Edge, Firefox) - Desktop, tablet, mobile  
**Project Type**: Web application (frontend + backend API routes)  
**Performance Goals**: 
- Grid load <2s for 500 machines
- Search response <500ms
- Login <10s
- Lighthouse score >90

**Constraints**: 
- All text in French (Canadian)
- No native browser validation (custom components only)
- Custom styled error messages and validation feedback
- 1-hour session timeout
- Azure free tier optimization
- Backend always runs in production (Azure)
- Frontend can run locally or production

**Scale/Scope**: 
- ~10 pages (login, dashboard, machines grid, machine form, clients, users)
- 3 entities (User, Machine, Client)
- 3 user roles with distinct permissions
- Target: 500 machines, 50 users, 200 clients

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Azure-First with Cost Optimization
- [x] Frontend deployed as Azure Static Web App (free tier)
- [x] Azure Cosmos DB for all data persistence
- [x] Free tier utilization prioritized
- [x] All resources in `huronportal-rg` resource group
- [x] GitHub Actions for CI/CD

### ✅ Modern Frontend Stack
- [x] Next.js 14.2.33 (App Router, SSR/SSG)
- [x] React 18.3.1 with React DOM 18.3.1
- [x] TypeScript 5.9.3 (strict mode enabled)
- [x] Tailwind CSS 3.4.18 for styling
- [x] TanStack Query 5.90.5 for state and data fetching
- [x] All components in TypeScript with explicit types
- [x] Server Components by default, Client Components when necessary
- [x] Responsive design mobile-first
- [x] Tailwind CSS utility-first approach

### ✅ Business-Focused Design System
- [x] Modern, sleek, and simple design for CNC business application
- [x] French (Canadian) as primary language for all UI
- [x] Custom validation components (no native browser validation)
- [x] Professional error messages and feedback in French
- [x] Industrial-inspired professional color palette
- [x] Clean, minimalist interface
- [x] Subtle professional animations
- [x] Clean sans-serif typography (Inter or Roboto)
- [x] WCAG 2.1 AA accessibility standards
- [x] Mobile-responsive for factory floor and office
- [x] French date format (JJ/MM/AAAA)

### ✅ Cosmos DB Data Modeling Best Practices
- [x] High-cardinality partition keys (userId for User, machineId for Machine)
- [x] Query pattern optimization (user by username, machines by client)
- [x] Latest Azure Cosmos DB SDK
- [x] Async APIs for better throughput
- [x] RU consumption monitoring

### ✅ Backend Architecture
- [x] Next.js API Routes (serverless in Azure Static Web Apps)
- [x] Backend execution always in production (Azure)
- [x] Frontend can run locally or production
- [x] No Azure Functions (per constitution update)
- [x] Azure Key Vault for secrets

### Validation Summary
**Status**: ✅ PASSED - All constitutional requirements met
**Deviations**: None
**Notes**: 
- Custom form validation system required to avoid native browser validation
- French localization throughout all components
- Professional error/success messaging with custom styling

## Project Structure

### Documentation (this feature)

```text
specs/001-cnc-machine-management/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   ├── auth.openapi.yaml
│   ├── machines.openapi.yaml
│   ├── clients.openapi.yaml
│   └── users.openapi.yaml
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Web application structure (frontend + backend)

app/                           # Next.js App Router
├── (auth)/
│   └── login/
│       └── page.tsx          # Page de connexion
├── (app)/                    # Pages protégées
│   ├── layout.tsx           # Layout avec navigation
│   ├── page.tsx             # Dashboard / Grille machines (page principale)
│   ├── machines/
│   │   ├── page.tsx         # Liste des machines (alt view)
│   │   ├── new/
│   │   │   └── page.tsx     # Création machine
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx # Modification machine
│   ├── clients/
│   │   ├── page.tsx         # Liste des clients
│   │   ├── new/
│   │   │   └── page.tsx     # Création client
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx # Modification client
│   └── users/
│       ├── page.tsx         # Gestion des utilisateurs (admin only)
│       ├── new/
│       │   └── page.tsx     # Création utilisateur
│       └── [id]/
│           └── edit/
│               └── page.tsx # Modification utilisateur
├── api/                     # Next.js API Routes
│   ├── auth/
│   │   ├── login/
│   │   │   └── route.ts
│   │   └── logout/
│   │       └── route.ts
│   ├── machines/
│   │   ├── route.ts         # GET (list), POST (create)
│   │   └── [id]/
│   │       └── route.ts     # GET, PUT, DELETE
│   ├── clients/
│   │   ├── route.ts
│   │   ├── search/
│   │   │   └── route.ts     # Recherche pour dropdown
│   │   └── [id]/
│   │       └── route.ts
│   └── users/
│       ├── route.ts
│       └── [id]/
│           └── route.ts
└── globals.css              # Tailwind imports

components/
├── ui/                      # Composants de base réutilisables
│   ├── Button.tsx
│   ├── Input.tsx           # Input avec validation custom
│   ├── Select.tsx          # Dropdown avec recherche
│   ├── DataGrid.tsx        # Grille de données
│   ├── Card.tsx
│   ├── Modal.tsx
│   ├── Toast.tsx           # Notifications
│   ├── FormField.tsx       # Wrapper avec label + erreur
│   ├── ErrorMessage.tsx    # Message d'erreur stylisé
│   └── LoadingSpinner.tsx
├── forms/                   # Formulaires avec validation
│   ├── MachineForm.tsx
│   ├── ClientForm.tsx
│   ├── UserForm.tsx
│   └── LoginForm.tsx
├── features/
│   ├── machines/
│   │   ├── MachineGrid.tsx
│   │   └── MachineCard.tsx
│   ├── clients/
│   │   └── ClientList.tsx
│   └── users/
│       └── UserList.tsx
├── layout/
│   ├── Navigation.tsx
│   ├── Header.tsx
│   └── Sidebar.tsx
└── providers/
    ├── AuthProvider.tsx
    └── QueryProvider.tsx

lib/
├── cosmos/
│   ├── client.ts           # CosmosClient singleton
│   ├── users.ts            # User operations
│   ├── machines.ts         # Machine operations
│   └── clients.ts          # Client operations
├── auth/
│   ├── session.ts          # Session management
│   ├── bcrypt.ts           # Password hashing
│   └── middleware.ts       # Auth middleware
├── validation/
│   ├── schemas.ts          # Zod schemas
│   ├── messages.ts         # French error messages
│   └── validators.ts       # Custom validators
└── utils/
    ├── format.ts           # Date/number formatting
    └── permissions.ts      # Role-based permissions

types/
├── user.ts
├── machine.ts
├── client.ts
└── api.ts

public/
└── images/

config/
├── cosmos.ts               # Cosmos DB config
└── constants.ts            # App constants

.env.local                  # Local env vars
.env.production             # Production env vars (in Azure Key Vault)
next.config.js
tailwind.config.ts
tsconfig.json
package.json
```

**Structure Decision**: Web application structure selected because this is a full-stack Next.js application with frontend pages and backend API routes. The App Router structure follows Next.js 14 conventions with route groups for authenticated vs public pages. Custom validation components in `components/ui/` ensure no native browser validation is used, with French error messages defined in `lib/validation/messages.ts`.

---

## Phase 1: Planning & Design

### Research Document

Created comprehensive research document covering:
1. **Custom Form Validation Strategy**: React Hook Form + Zod with `noValidate` on forms
2. **French Error Messages**: Centralized dictionary in `lib/validation/messages.ts`
3. **Professional UI Components**: Toast, Banner, Inline error displays with Tailwind
4. **Cosmos DB Partition Strategy**: Entity-specific partition keys for optimal queries
5. **Session Management**: HTTP-only cookies with 1-hour timeout
6. **Concurrent Edit Handling**: ETag-based optimistic concurrency
7. **Search-Enabled Dropdown**: Debounced server-side search for client selection
8. **Tailwind Design System**: Industrial color palette for CNC aesthetic
9. **Role-Based Access Control**: Middleware + UI guards for Admin/Contrôleur/Utilisateur
10. **Development Workflow**: Local frontend connecting to production backend

**Location**: `specs/001-cnc-machine-management/research.md`

### Data Model

Defined complete database schema with 3 entities:
- **User**: Partition key `/username`, includes passwordHash, role, isActive
- **Machine**: Partition key `/machineId`, includes numeroOL (unique), type, clientId, clientName
- **Client**: Partition key `/clientId`, includes companyName, address, province, postalCode, machineCount

Each entity includes:
- Cosmos DB container configuration
- Complete Zod validation schemas
- Query patterns with RU estimates
- ETag-based concurrency strategy

**RU Estimation**: ~8,500 RUs/day (within free tier 1000 RU/s budget)

**Location**: `specs/001-cnc-machine-management/data-model.md`

### API Contracts

Created OpenAPI 3.0 specifications for all endpoints:
1. **Authentication API** (`auth.openapi.yaml`):
   - POST /api/auth/login
   - POST /api/auth/logout
   - GET /api/auth/session
   - HTTP-only cookie handling
   - French error messages

2. **Machines API** (`machines.openapi.yaml`):
   - GET /api/machines (with pagination)
   - POST /api/machines
   - GET /api/machines/{id}
   - PUT /api/machines/{id}
   - DELETE /api/machines/{id}
   - ETag concurrency support
   - Role-based access enforcement

3. **Clients API** (`clients.openapi.yaml`):
   - GET /api/clients (with pagination)
   - GET /api/clients/search (for dropdown)
   - POST /api/clients
   - GET /api/clients/{id}
   - PUT /api/clients/{id}
   - DELETE /api/clients/{id}
   - Machine count validation on delete

4. **Users API** (`users.openapi.yaml`):
   - GET /api/users (admin only)
   - POST /api/users (admin only)
   - GET /api/users/{id}
   - PUT /api/users/{id}
   - DELETE /api/users/{id}
   - Password hashing with bcrypt

All contracts include:
- French validation error messages
- Consistent error code patterns
- Role-based response variations
- Request/response schemas

**Location**: `specs/001-cnc-machine-management/contracts/`

### Quickstart Guide

Created comprehensive setup documentation covering:
- Prerequisites and VS Code extensions
- Clone and install steps
- Environment configuration (`.env.local`)
- Azure Cosmos DB access setup
- Development server startup
- Verification tests
- Project structure overview
- Development workflow patterns
- Common tasks and troubleshooting
- Custom validation usage examples

**Location**: `specs/001-cnc-machine-management/quickstart.md`

### Agent Context Update

Updated Claude agent context file with:
- TypeScript 5.9.3 (strict mode), Node.js LTS
- Azure Cosmos DB (NoSQL API) integration
- Custom validation technologies (React Hook Form, Zod)
- French localization requirements

**File Updated**: `CLAUDE.md`

---

## Phase 1 Completion Status

✅ **All Phase 1 deliverables completed**:
- ✅ Technical Context defined
- ✅ Constitution Check passed (all gates)
- ✅ Research document created (10 research areas)
- ✅ Data Model specified (3 entities with Cosmos DB schemas)
- ✅ API Contracts documented (4 OpenAPI specs)
- ✅ Quickstart Guide written
- ✅ Agent Context updated

---

## Next Steps

**Ready for Task Breakdown**: Run `/speckit.tasks` to generate detailed implementation tasks based on this plan.

## Complexity Tracking

No constitutional violations requiring justification. All architectural decisions align with the constitution's mandates.
