# Research: Système de Gestion des Machines CNC

**Feature**: 001-cnc-machine-management  
**Date**: 2025-11-20  
**Status**: Complete

## Overview

This document consolidates research findings for implementing a modern, sleek French-language CNC machine management system with custom form validation (no native browser validation) and professional error/success messaging.

## Key Research Areas

### 1. Custom Form Validation Strategy (No Native Browser Validation)

**Decision**: Use React Hook Form + Zod with custom-styled error components

**Rationale**:
- React Hook Form provides excellent performance with minimal re-renders
- Zod offers TypeScript-first schema validation with type inference
- Complete control over error message styling and positioning
- Eliminates browser native validation tooltips/bubbles
- Supports French error messages with full customization
- Integrates seamlessly with Next.js Server Actions

**Implementation Approach**:
```typescript
// Disable native validation
<form noValidate onSubmit={handleSubmit(onSubmit)}>
  
// Custom error display
{errors.field && (
  <ErrorMessage>{errors.field.message}</ErrorMessage>
)}
```

**Alternatives Considered**:
- **Formik**: Heavier bundle size, less TypeScript integration
- **Plain React state**: Too much boilerplate, error-prone
- **Server-only validation**: Poor UX, requires round-trip for every field

**Best Practices**:
- Always set `noValidate` on `<form>` elements
- Display errors below/next to fields (not in tooltips)
- Show field-level errors on blur
- Show form-level errors on submit
- Use consistent error styling across all forms
- Provide clear, actionable French error messages
- Support keyboard navigation for accessibility

### 2. French Error Messages and Validation Feedback

**Decision**: Centralized French message dictionary with Zod integration

**Rationale**:
- Consistency across all forms and validation scenarios
- Easy to update/maintain all messages in one place
- Type-safe message retrieval
- Supports variable interpolation (e.g., "Maximum {max} characters")
- Professional business-appropriate tone

**Message Categories**:
```typescript
{
  required: "Ce champ est requis",
  email: "Adresse courriel invalide",
  minLength: "Minimum {min} caractères requis",
  maxLength: "Maximum {max} caractères permis",
  unique: "{field} déjà utilisé",
  format: "Format invalide",
  password: {
    weak: "Mot de passe trop faible",
    mismatch: "Les mots de passe ne correspondent pas"
  },
  machine: {
    duplicateOL: "Ce numéro #OL existe déjà",
    clientRequired: "Veuillez sélectionner un client"
  },
  client: {
    hasM achines: "Impossible de supprimer - {count} machine(s) associée(s)",
    invalidPostal: "Code postal invalide (format: A1A 1A1)"
  },
  user: {
    duplicateUsername: "Nom d'utilisateur déjà utilisé",
    duplicateEmail: "Adresse courriel déjà utilisée",
    lastAdmin: "Impossible de supprimer le dernier administrateur"
  },
  auth: {
    invalidCredentials: "Nom d'utilisateur ou mot de passe incorrect",
    sessionExpired: "Votre session a expiré. Veuillez vous reconnecter",
    unauthorized: "Vous n'êtes pas autorisé à effectuer cette action"
  },
  conflict: {
    concurrentEdit: "Cet enregistrement a été modifié par un autre utilisateur"
  },
  success: {
    created: "{entity} créé avec succès",
    updated: "{entity} mis à jour avec succès",
    deleted: "{entity} supprimé avec succès"
  }
}
```

**Alternatives Considered**:
- **i18n library**: Overkill for single language
- **Inline messages**: Hard to maintain, inconsistent
- **English with translation layer**: Unnecessary complexity

### 3. Professional UI Components for Error/Success Feedback

**Decision**: Custom Toast/Banner/Inline components with Tailwind styling

**Component Types**:
1. **Inline Field Errors**: Below/next to form fields
2. **Banner Errors**: Top of form for form-level errors
3. **Toast Notifications**: Success/error for API operations
4. **Modal Confirmations**: For destructive actions

**Design Guidelines**:
- **Colors**: 
  - Error: Red-600/Red-50 background
  - Success: Green-600/Green-50 background
  - Warning: Amber-600/Amber-50 background
  - Info: Blue-600/Blue-50 background
- **Icons**: Consistent iconography (circle-x for error, check-circle for success)
- **Animation**: Subtle fade-in (no jarring effects)
- **Typography**: Clear, readable fonts (Inter/Roboto)
- **Spacing**: Adequate padding/margins for readability

**Alternatives Considered**:
- **Third-party libraries** (Radix UI, Headless UI): Added dependency weight
- **Native alerts**: Poor UX, not customizable
- **Browser notifications**: Too intrusive, requires permission

### 4. Cosmos DB Partition Strategy

**Decision**: Use entity-specific partition keys for optimal query performance

**Partition Keys**:
- **Users**: `/username` (high cardinality, unique lookups)
- **Machines**: `/machineId` (unique identifier, supports cross-partition client queries)
- **Clients**: `/clientId` (unique identifier, minimal cross-partition queries)

**Rationale**:
- Minimizes cross-partition queries for primary use cases
- Supports efficient point reads (GET by ID)
- Avoids hot partitions
- Each entity <2MB (well within limits)
- Aligns with access patterns from spec

**Query Patterns Optimized**:
- Login: User by username (partition key lookup)
- Machine list: All machines (acceptable cross-partition)
- Machines by client: Cross-partition with client filter (< 500 machines total)
- Client lookup for dropdown: All clients with search (acceptable, <200 clients)

**Alternatives Considered**:
- **Single partition key** (/type): Hot partition risk
- **/clientId for machines**: Breaks machine uniqueness queries
- **Hierarchical keys**: Unnecessary complexity for scale

### 5. Session Management (1-hour timeout)

**Decision**: HTTP-only cookies with server-side session validation

**Implementation**:
- JWT tokens stored in HTTP-only, Secure, SameSite cookies
- 1-hour expiration in token payload
- Server-side validation on every API route
- Automatic redirect to login on expiration
- Silent token refresh on activity (optional enhancement)

**Security Measures**:
- CSRF protection via SameSite cookies
- bcrypt/argon2 password hashing (cost factor 12)
- No sensitive data in tokens (only userId + role)
- Secure flag enabled in production

**Alternatives Considered**:
- **LocalStorage**: XSS vulnerable
- **Server sessions**: Requires session store (Redis), complexity
- **Longer sessions**: Security vs UX trade-off (chose 1hr per spec)

### 6. Concurrent Edit Handling (Last-Write-Wins with Warning)

**Decision**: ETag-based optimistic concurrency with user notification

**Implementation Flow**:
1. Fetch record with `_etag` from Cosmos DB
2. Store `_etag` in form state
3. On save, include `_etag` in PUT request
4. Cosmos DB rejects if `_etag` mismatches (412 Precondition Failed)
5. Display French warning: "Cet enregistrement a été modifié..."
6. Offer user choice: reload/overwrite

**Rationale**:
- Built into Cosmos DB (no custom logic)
- Lightweight (no locking overhead)
- Clear user feedback on conflicts
- Acceptable for low-concurrency scenario

**Alternatives Considered**:
- **No detection**: Silent data loss
- **Pessimistic locking**: Complex, requires lock management
- **Full conflict resolution UI**: Over-engineered for use case

### 7. Search-Enabled Dropdown for Client Selection

**Decision**: Combobox pattern with debounced server-side search

**Component**: Custom `<SearchableSelect>` using React Hook Form

**Features**:
- Type-ahead filtering (debounced 300ms)
- Keyboard navigation (arrow keys, Enter, Escape)
- Highlights matching text
- "No results" message in French
- Accessible (ARIA labels, roles)

**API Endpoint**: `GET /api/clients/search?q={query}`
- Returns filtered clients (name contains query, case-insensitive)
- Limited to 50 results
- Response time <500ms

**Alternatives Considered**:
- **Client-side filtering**: Inefficient for 200+ clients
- **Native `<select>` with `<datalist>`**: Limited browser support, styling issues
- **Third-party autocomplete**: Bundle size, customization limits

### 8. Tailwind CSS Design System for CNC Application

**Decision**: Custom Tailwind theme with industrial color palette

**Color Palette**:
```typescript
{
  primary: {
    50: '#f0f9ff',  // Light blue (precision)
    600: '#0284c7', // Main blue
    700: '#0369a1', // Dark blue
  },
  neutral: {
    50: '#fafafa',  // Off-white
    100: '#f5f5f5', // Light gray
    600: '#525252', // Medium gray
    900: '#171717', // Near-black
  },
  success: '#16a34a',
  error: '#dc2626',
  warning: '#d97706',
}
```

**Typography**:
- Primary: Inter (clean, modern sans-serif)
- Fallback: Roboto, system sans-serif
- Sizes: Consistent scale (text-sm, text-base, text-lg, text-xl)

**Spacing**:
- Generous whitespace (padding/margins)
- Card-based layouts
- Consistent 4px grid

**Components**:
- Rounded corners (rounded-lg)
- Subtle shadows (shadow-sm, shadow-md)
- Focus rings for accessibility
- Hover states for interactivity

**Alternatives Considered**:
- **Custom CSS**: More work, less consistency
- **Material UI**: Too opinionated, heavy bundle
- **Bootstrap**: Dated aesthetic, conflicts with constitution

### 9. Role-Based Access Control (RBAC)

**Decision**: Middleware-based permission checks + UI-level guards

**Implementation Layers**:
1. **API Middleware**: Validate role before handler execution
2. **React Context**: `useAuth()` hook exposes role
3. **Conditional Rendering**: Hide UI elements based on role
4. **Route Guards**: Redirect unauthorized users

**Role Permissions Matrix**:
| Action | Admin | Contrôleur | Utilisateur |
|--------|-------|------------|-------------|
| View machines | ✓ | ✓ | ✓ |
| Create machine | ✓ | ✓ | ✗ |
| Edit machine | ✓ | ✓ | ✗ |
| Delete machine | ✓ | ✗ | ✗ |
| View clients | ✓ | ✓ | ✓ |
| Create client | ✓ | ✓ | ✗ |
| Edit client | ✓ | ✓ | ✗ |
| Delete client | ✓ | ✗ | ✗ |
| Manage users | ✓ | ✗ | ✗ |

**Alternatives Considered**:
- **API-only checks**: UI shows unauthorized actions
- **UI-only checks**: Security bypass via API
- **External auth service**: Over-engineered for simple RBAC

### 10. Development Workflow (Local Frontend + Production Backend)

**Decision**: Use environment variables to point to production API

**Local Development Setup**:
```bash
# .env.local
NEXT_PUBLIC_API_URL=https://huronportal.azurestaticapps.net/api
COSMOS_CONNECTION_STRING=<production-from-keyvault>
```

**Benefits**:
- No local backend setup required
- Always test against real data
- Simplified onboarding
- Consistent environment

**Safeguards**:
- Read-only credentials for non-admins
- Separate development container in Cosmos DB
- Feature flags for WIP features

**Alternatives Considered**:
- **Full local stack**: Complex setup (Cosmos Emulator, etc.)
- **Mocked APIs**: Divergence from production behavior
- **Staging environment**: Additional cost/maintenance

## Technology Stack Summary

| Category | Technology | Version | Justification |
|----------|------------|---------|---------------|
| **Framework** | Next.js | 14.2.33 | Constitution mandate, App Router, SSR/SSG |
| **Language** | TypeScript | 5.9.3 | Constitution mandate, strict mode |
| **UI Library** | React | 18.3.1 | Constitution mandate |
| **Styling** | Tailwind CSS | 3.4.18 | Constitution mandate, utility-first |
| **State Management** | TanStack Query | 5.90.5 | Constitution mandate, server state |
| **Form Handling** | React Hook Form | Latest | Performance, TypeScript support |
| **Validation** | Zod | Latest | TypeScript-first schemas, French messages |
| **Database** | Azure Cosmos DB | Latest SDK | Constitution mandate, NoSQL API |
| **Auth** | bcrypt | Latest | Password hashing per spec clarification |
| **Testing** | Vitest + RTL + Playwright | Latest | Modern, fast, comprehensive |
| **Deployment** | Azure Static Web Apps | N/A | Constitution mandate, free tier |

## Implementation Priorities

### Phase 1 (MVP - P1 Features)
1. Authentication system (login page)
2. Machine grid/dashboard (main page)
3. Basic navigation and layout
4. Custom form validation components
5. French error message system

### Phase 2 (Core Features - P2)
6. Client management (CRUD)
7. Machine creation/editing
8. Searchable client dropdown
9. Role-based UI rendering

### Phase 3 (Admin Features - P3)
10. User management (admin only)
11. Machine deletion (admin only)
12. Concurrent edit warnings
13. Session timeout handling

## Open Questions

None - all clarifications resolved during spec clarification phase.

## Next Steps

1. Create data model document (data-model.md)
2. Define API contracts (contracts/*.openapi.yaml)
3. Create quickstart guide (quickstart.md)
4. Update agent context
5. Proceed to task breakdown (/speckit.tasks)
