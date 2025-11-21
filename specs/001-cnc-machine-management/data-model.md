# Data Model: Système de Gestion des Machines CNC

**Feature**: 001-cnc-machine-management  
**Date**: 2025-11-20  
**Database**: Azure Cosmos DB (NoSQL API)

## Overview

This document defines the data entities, schemas, relationships, and validation rules for the CNC machine management system. All data is stored in Azure Cosmos DB with optimized partition keys for query performance.

## Database Structure

**Database**: `huronportal-db`  
**Containers**:
- `users` - User accounts and authentication
- `machines` - CNC machine inventory
- `clients` - Customer/client companies

## Entities

### 1. User (Utilisateur)

**Container**: `users`  
**Partition Key**: `/username`  
**Purpose**: Stores user accounts with authentication credentials and role-based access control

**Schema**:
```typescript
interface User {
  // Cosmos DB fields
  id: string;                    // GUID, unique identifier
  username: string;              // Partition key, unique, lowercase
  _etag: string;                 // Cosmos DB managed, for concurrency
  _ts: number;                   // Cosmos DB managed, timestamp
  
  // Core fields
  name: string;                  // Full name (e.g., "Jean Tremblay")
  email: string;                 // Email address, unique, lowercase
  passwordHash: string;          // bcrypt hash of password
  role: 'Admin' | 'Utilisateur' | 'Contrôleur';
  
  // Metadata
  createdAt: string;             // ISO 8601 datetime
  createdBy: string;             // User ID of creator
  updatedAt: string;             // ISO 8601 datetime
  updatedBy: string;             // User ID of last updater
  lastLoginAt: string | null;    // ISO 8601 datetime, null if never logged in
  isActive: boolean;             // Soft delete flag
}
```

**Indexes**:
- Primary: `/username` (partition key + id)
- Composite: `/email` (for uniqueness check)

**Validation Rules**:
```typescript
{
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[\p{L}\s'-]+$/u, // Unicode letters, spaces, hyphens, apostrophes
  },
  username: {
    required: true,
    minLength: 3,
    maxLength: 50,
    pattern: /^[a-z0-9_-]+$/,  // Lowercase alphanumeric, underscore, hyphen
    unique: true,
  },
  email: {
    required: true,
    format: 'email',
    maxLength: 254,
    unique: true,
  },
  password: {  // Only for creation
    required: true,
    minLength: 8,
    maxLength: 128,
    // Must contain: uppercase, lowercase, number
  },
  role: {
    required: true,
    enum: ['Admin', 'Utilisateur', 'Contrôleur'],
  },
}
```

**Business Rules**:
- Username must be unique (case-insensitive)
- Email must be unique (case-insensitive)
- Cannot delete the last active Admin user
- Password must be hashed with bcrypt (cost factor 12) before storage
- New users are created with `isActive: true`
- Username and email are stored lowercase for case-insensitive lookups

**Sample Data**:
```json
{
  "id": "usr_a1b2c3d4",
  "username": "admin",
  "name": "Administrateur Système",
  "email": "admin@huronportal.com",
  "passwordHash": "$2b$12$...",
  "role": "Admin",
  "createdAt": "2025-11-20T10:00:00Z",
  "createdBy": "system",
  "updatedAt": "2025-11-20T10:00:00Z",
  "updatedBy": "system",
  "lastLoginAt": "2025-11-20T14:30:00Z",
  "isActive": true
}
```

---

### 2. Machine CNC

**Container**: `machines`  
**Partition Key**: `/machineId` (same as id)  
**Purpose**: Stores CNC machine inventory with client associations

**Schema**:
```typescript
interface Machine {
  // Cosmos DB fields
  id: string;                    // GUID, unique identifier (machineId)
  machineId: string;             // Same as id, partition key
  _etag: string;                 // Cosmos DB managed, for concurrency
  _ts: number;                   // Cosmos DB managed, timestamp
  
  // Core fields
  numeroOL: string;              // Order/Line number, unique, user-facing ID
  type: string;                  // Free text, machine type (e.g., "Fraiseuse CNC 5 axes")
  clientId: string;              // Reference to Client.id
  clientName: string;            // Denormalized for display in grid
  
  // Metadata
  createdAt: string;             // ISO 8601 datetime
  createdBy: string;             // User ID of creator
  createdByName: string;         // Denormalized creator name
  updatedAt: string;             // ISO 8601 datetime
  updatedBy: string;             // User ID of last updater
  isActive: boolean;             // Soft delete flag
}
```

**Indexes**:
- Primary: `/machineId` (partition key + id)
- Composite: `/numeroOL` (for uniqueness check)
- Composite: `/clientId` (for machines by client queries)

**Validation Rules**:
```typescript
{
  numeroOL: {
    required: true,
    minLength: 1,
    maxLength: 50,
    pattern: /^[A-Z0-9-]+$/,  // Uppercase alphanumeric and hyphen
    unique: true,
  },
  type: {
    required: true,
    minLength: 1,
    maxLength: 200,
    // Free text, any characters allowed
  },
  clientId: {
    required: true,
    format: 'uuid',
    exists: true,  // Must reference existing Client
  },
}
```

**Business Rules**:
- NumeroOL must be unique across all machines
- ClientId must reference an active Client
- ClientName is denormalized from Client for grid performance
- Cannot delete machine; set `isActive: false` instead
- Admin can delete (hard delete from DB)
- Contrôleur can create/edit but not delete
- Utilisateur has read-only access

**Sample Data**:
```json
{
  "id": "mch_x7y8z9a0",
  "machineId": "mch_x7y8z9a0",
  "numeroOL": "OL-2025-001",
  "type": "Fraiseuse CNC 5 axes Haas VF-4",
  "clientId": "clt_m1n2o3p4",
  "clientName": "Aérospatiale Québec Inc.",
  "createdAt": "2025-11-20T09:00:00Z",
  "createdBy": "usr_a1b2c3d4",
  "createdByName": "Admin Système",
  "updatedAt": "2025-11-20T09:00:00Z",
  "updatedBy": "usr_a1b2c3d4",
  "isActive": true
}
```

---

### 3. Client

**Container**: `clients`  
**Partition Key**: `/clientId` (same as id)  
**Purpose**: Stores customer/client company information

**Schema**:
```typescript
interface Client {
  // Cosmos DB fields
  id: string;                    // GUID, unique identifier (clientId)
  clientId: string;              // Same as id, partition key
  _etag: string;                 // Cosmos DB managed, for concurrency
  _ts: number;                   // Cosmos DB managed, timestamp
  
  // Core fields
  companyName: string;           // Company name (e.g., "Aérospatiale Québec Inc.")
  address: string;               // Street address
  city: string;                  // City name
  province: string;              // Province code (QC, ON, etc.)
  postalCode: string;            // Canadian postal code (A1A 1A1)
  phone: string;                 // Phone number
  email: string;                 // Company email
  contactPerson: string;         // Main contact person name
  
  // Metadata
  createdAt: string;             // ISO 8601 datetime
  createdBy: string;             // User ID of creator
  updatedAt: string;             // ISO 8601 datetime
  updatedBy: string;             // User ID of last updater
  isActive: boolean;             // Soft delete flag
  machineCount: number;          // Cached count of associated machines
}
```

**Indexes**:
- Primary: `/clientId` (partition key + id)
- Composite: `/companyName` (for search/dropdown)

**Validation Rules**:
```typescript
{
  companyName: {
    required: true,
    minLength: 2,
    maxLength: 200,
  },
  address: {
    required: true,
    minLength: 5,
    maxLength: 200,
  },
  city: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  province: {
    required: true,
    enum: ['QC', 'ON', 'BC', 'AB', 'MB', 'SK', 'NS', 'NB', 'PE', 'NL', 'NT', 'YT', 'NU'],
  },
  postalCode: {
    required: true,
    pattern: /^[A-Z]\d[A-Z] ?\d[A-Z]\d$/i,  // A1A 1A1 or A1A1A1
    normalize: uppercase with space,  // Store as "A1A 1A1"
  },
  phone: {
    required: true,
    pattern: /^(\+1)?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
    normalize: "+1 (XXX) XXX-XXXX",
  },
  email: {
    required: true,
    format: 'email',
    maxLength: 254,
  },
  contactPerson: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
}
```

**Business Rules**:
- Cannot delete Client if `machineCount > 0`
- Display error: "Impossible de supprimer - {machineCount} machine(s) associée(s)"
- Admin can create/edit/delete
- Contrôleur can create/edit but not delete
- Utilisateur has read-only access
- Postal code is normalized to uppercase with space
- Phone number is normalized to consistent format

**Sample Data**:
```json
{
  "id": "clt_m1n2o3p4",
  "clientId": "clt_m1n2o3p4",
  "companyName": "Aérospatiale Québec Inc.",
  "address": "1234 Rue Industrielle",
  "city": "Montréal",
  "province": "QC",
  "postalCode": "H3B 2Y5",
  "phone": "+1 (514) 555-1234",
  "email": "contact@aeroquebec.ca",
  "contactPerson": "Marie Dubois",
  "createdAt": "2025-11-15T08:00:00Z",
  "createdBy": "usr_a1b2c3d4",
  "updatedAt": "2025-11-18T10:30:00Z",
  "updatedBy": "usr_c3d4e5f6",
  "isActive": true,
  "machineCount": 3
}
```

---

## Relationships

### Machine → Client (N:1)

**Relationship**: Many machines belong to one client  
**Implementation**: `Machine.clientId` references `Client.id`  
**Denormalization**: `Machine.clientName` cached for grid display  
**Integrity**: 
- Client cannot be deleted if machines reference it
- Machine requires valid clientId (foreign key check)
- No cascade delete (per spec clarification)

### User → Machine (1:N Creator)

**Relationship**: One user creates many machines  
**Implementation**: `Machine.createdBy` references `User.id`  
**Denormalization**: `Machine.createdByName` cached for audit trail  
**Integrity**:
- User deletion does not affect machines (retain audit trail)
- CreatedBy is immutable after creation

### User → Client (1:N Creator)

**Relationship**: One user creates many clients  
**Implementation**: `Client.createdBy` references `User.id`  
**Integrity**:
- User deletion does not affect clients
- CreatedBy is immutable after creation

## Query Patterns

### High-Frequency Queries (Optimized)

1. **User Login**: 
   ```sql
   SELECT * FROM users u WHERE u.username = @username AND u.isActive = true
   ```
   - Uses partition key: O(1) lookup
   - RU cost: ~2-3 RUs

2. **Machine Grid (All Machines)**:
   ```sql
   SELECT m.id, m.numeroOL, m.type, m.clientName 
   FROM machines m 
   WHERE m.isActive = true
   ORDER BY m.numeroOL
   ```
   - Cross-partition query (acceptable for < 500 machines)
   - RU cost: ~10-15 RUs
   - Cache in TanStack Query (5 min TTL)

3. **Client Search (Dropdown)**:
   ```sql
   SELECT c.id, c.companyName 
   FROM clients c 
   WHERE CONTAINS(LOWER(c.companyName), LOWER(@query)) 
     AND c.isActive = true
   ORDER BY c.companyName
   OFFSET 0 LIMIT 50
   ```
   - Cross-partition query (acceptable for < 200 clients)
   - RU cost: ~5-8 RUs
   - Debounced (300ms) + cached

### Medium-Frequency Queries

4. **Machines by Client**:
   ```sql
   SELECT * FROM machines m 
   WHERE m.clientId = @clientId AND m.isActive = true
   ```
   - Cross-partition query with filter
   - RU cost: ~5-10 RUs

5. **Check NumeroOL Uniqueness**:
   ```sql
   SELECT VALUE COUNT(1) FROM machines m 
   WHERE m.numeroOL = @numeroOL
   ```
   - Cross-partition query
   - RU cost: ~3-5 RUs
   - Run on form submit

### Low-Frequency Queries

6. **User Management (Admin)**:
   ```sql
   SELECT * FROM users u WHERE u.isActive = true ORDER BY u.name
   ```
   - Cross-partition query
   - RU cost: ~5-10 RUs

7. **Last Admin Check**:
   ```sql
   SELECT VALUE COUNT(1) FROM users u 
   WHERE u.role = 'Admin' AND u.isActive = true
   ```
   - Cross-partition query
   - RU cost: ~3-5 RUs
   - Run before user deletion

## Concurrency Strategy

**Approach**: Optimistic concurrency using Cosmos DB `_etag`

**Implementation**:
1. Read record with `_etag`
2. Store `_etag` in form state
3. Include `if-match: <_etag>` header in PUT/DELETE request
4. Cosmos DB returns 412 Precondition Failed if mismatch
5. Display warning: "Cet enregistrement a été modifié par un autre utilisateur"
6. Offer reload/overwrite options

**Applies To**: Machine edit, Client edit, User edit

## Soft Delete Strategy

**Approach**: Use `isActive` flag for soft deletes (except Admin hard deletes)

**Benefits**:
- Preserves audit trail
- Allows "undelete" functionality
- Maintains referential integrity

**Implementation**:
- Default queries filter `isActive = true`
- Admin UI can show/restore deleted records
- Hard delete only for Admin role on machines

## Performance Optimizations

### Denormalization

**Machine.clientName**: Cached from Client to avoid joins in grid
- **Update Strategy**: Update when Client.companyName changes
- **Trade-off**: 2x writes (Client + all Machines) vs N joins on read

**Machine.createdByName**: Cached from User for audit display
- **Update Strategy**: Immutable, no updates needed

### Caching (TanStack Query)

- **Machine Grid**: 5-minute stale time, background refetch
- **Client Dropdown**: 10-minute stale time, on-demand refetch
- **User Session**: Session duration (1 hour), no background refetch

### Indexing

- Partition keys chosen for point-read optimization
- Composite indexes for uniqueness checks
- Cross-partition queries acceptable for current scale (< 500 records)

## Migration Strategy

**Initial Setup**:
1. Create database `huronportal-db`
2. Create containers with partition keys
3. Define composite indexes
4. Seed admin user (username: admin, password: provided separately)

**Schema Versioning**:
- Add `schemaVersion` field to documents if schema evolves
- Use versioned handlers in API routes
- Cosmos DB schema-less nature allows gradual migration

## Estimated RU Consumption

**Container Provisioning** (Free Tier: 1000 RU/s):
- `users`: 100 RU/s (10%)
- `machines`: 600 RU/s (60%)
- `clients`: 300 RU/s (30%)

**Daily Operations** (estimated):
- 100 logins: 300 RUs
- 500 grid loads: 7,500 RUs
- 50 machine creates/edits: 500 RUs
- 20 client searches: 160 RUs
- **Total**: ~8,500 RUs/day (within free tier with buffer)

## Next Steps

1. Create API contracts (OpenAPI specs)
2. Implement data access layer (`lib/cosmos/*.ts`)
3. Create Zod schemas for validation
4. Implement seed script for admin user
