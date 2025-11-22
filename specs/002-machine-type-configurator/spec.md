# Machine Type Configurator Feature Specification

## Overview
Add a CRUD interface for managing machine types (machine configurations). This feature allows administrators to define and manage different types of CNC machines with their axis specifications.

## Business Requirements

### User Stories
- **As an administrator**, I want to create, edit, and delete machine types so that I can maintain a catalog of supported machine configurations
- **As a non-admin user**, I want to view the list of available machine types so that I can understand what configurations are supported
- **As an administrator**, I want to define axis capabilities (X, Y, Z, A, B, C) for each machine type so that the system knows the physical constraints of each machine

### Use Cases
1. **Create Machine Type**: Admin creates a new machine type with all specifications
2. **Edit Machine Type**: Admin updates existing machine type details
3. **Delete Machine Type**: Admin removes obsolete machine types
4. **View Machine Types**: All users can browse and view machine type details
5. **Filter/Search Machine Types**: Users can search by manufacturer or machine type name

## Functional Requirements

### Data Model

#### MachineType Entity
```typescript
interface MachineType {
  id: string;                    // Guid - Unique identifier (Cosmos DB primary key) - ONLY UNIQUE FIELD
  machineTypeId: number;         // Integer - Numeric type identifier (CAN BE DUPLICATED)
  machineTypeName: string;       // String - Display name (case-insensitive unique)
  manufacturer: string;          // String - Machine manufacturer (free text)
  x: number;                     // Integer - X-axis total travel distance (mm)
  y: number;                     // Integer - Y-axis total travel distance (mm)
  z: number;                     // Integer - Z-axis total travel distance (mm)
  a: number;                     // Real - A-axis total rotation range (degrees, can be 0)
  b: number;                     // Real - B-axis total rotation range (degrees, can be 0)
  c: number;                     // Real - C-axis total rotation range (degrees, can be 0)
  description?: string;          // String - Optional configurable text field (max 500 chars)
  createdAt: string;             // ISO 8601 timestamp
  updatedAt: string;             // ISO 8601 timestamp
  createdBy: string;             // User ID who created
  updatedBy: string;             // User ID who last updated
}
```

### Validation Rules
- **id**: Auto-generated GUID, required, **ONLY UNIQUE FIELD**
- **machineTypeId**: Required, integer, **CAN BE DUPLICATED**, > 0
- **machineTypeName**: Required, string, 1-100 characters, **case-insensitive unique** ("DMU 50" = "dmu 50")
- **manufacturer**: Required, string, 1-100 characters, **free text entry**
- **x**: Required, integer, >= 0, <= 10000 (mm)
- **y**: Required, integer, >= 0, <= 10000 (mm)
- **z**: Required, integer, >= 0, <= 10000 (mm)
- **a**: Required, real number, >= 0, <= 360 (degrees), **can be 0 for 3-axis machines**
- **b**: Required, real number, >= 0, <= 360 (degrees), **can be 0 for 3-axis machines**
- **c**: Required, real number, >= 0, <= 360 (degrees), **can be 0 for 3-axis machines**
- **description**: Optional, string, max 500 characters

### Access Control
- **Admin Role**: Full CRUD access (Create, Read, Update, Delete)
- **Manager Role**: Read-only access
- **Operator Role**: Read-only access
- **Viewer Role**: Read-only access

### UI Requirements

#### Machine Types List Page (`/machine-types`)
- **Layout**: DataGrid component with columns:
  - Machine Type ID (numeric, sortable, **can have duplicates**)
  - Machine Type Name (string, sortable, searchable)
  - Manufacturer (string, sortable, searchable)
  - Description (configurable text field)
  - Actions (Edit/Delete/Duplicate for admins, View for others)
- **Actions**:
  - "Add Machine Type" button (admin only)
  - "Export" button (exports list to CSV/JSON)
  - Search/filter by name or manufacturer
  - Click row to view details
  - Edit icon (admin only)
  - Duplicate icon (admin only) - creates copy with new GUID
  - Delete icon with confirmation (admin only)

#### Create/Edit Machine Type Form (`/machine-types/new`, `/machine-types/[id]`)
- **Form Fields**:
  - Machine Type ID (number input, **can match existing IDs**)
  - Machine Type Name (text input, **must be unique case-insensitive**)
  - Manufacturer (text input, **free text**)
  - Description (text area, optional configurable text)
  - X Axis (mm) (number input with "Total Travel" label)
  - Y Axis (mm) (number input with "Total Travel" label)
  - Z Axis (mm) (number input with "Total Travel" label)
  - A Axis (degrees) (number input with "Total Rotation" label, **can be 0**)
  - B Axis (degrees) (number input with "Total Rotation" label, **can be 0**)
  - C Axis (degrees) (number input with "Total Rotation" label, **can be 0**)
- **Actions**:
  - Save button (creates or updates)
  - Cancel button (returns to list)
  - Delete button (edit mode, admin only)
- **Validation**: Real-time validation with error messages

#### View Machine Type Page (`/machine-types/[id]`)
- **Display**: Read-only view of all machine type details
- **Layout**: Card-based layout with sections:
  - Basic Information (ID, Name, Manufacturer)
  - Linear Axes (X, Y, Z with mm units)
  - Rotational Axes (A, B, C with degree units)
  - Metadata (Created/Updated by, timestamps)
- **Actions**:
  - Back button
  - Edit button (admin only)

### API Endpoints

#### GET /api/machine-types
- **Access**: All authenticated users
- **Response**: List of all machine types
- **Query Params**: 
  - `search`: Filter by name or manufacturer
  - `sortBy`: Sort field
  - `order`: asc/desc

#### GET /api/machine-types/[id]
- **Access**: All authenticated users
- **Response**: Single machine type details
- **Error**: 404 if not found

#### POST /api/machine-types
- **Access**: Admin only
- **Body**: MachineType data (without id, timestamps)
- **Response**: Created machine type with generated id
- **Validation**: 
  - Check case-insensitive uniqueness of machineTypeName only
  - machineTypeId can be duplicated
- **Error**: 400 for validation errors, 409 for name conflicts

#### PUT /api/machine-types/[id]
- **Access**: Admin only
- **Body**: Updated MachineType data
- **Response**: Updated machine type
- **Validation**: Check case-insensitive machineTypeName uniqueness (excluding current record)
- **Error**: 404 if not found, 400 for validation, 409 for name conflicts

#### DELETE /api/machine-types/[id]
- **Access**: Admin only
- **Response**: 204 No Content
- **Business Rule**: **PREVENT deletion** if any machines reference this type (show error with count)
- **Error**: 404 if not found, 409 if still referenced by machines (include count in error message)

#### POST /api/machine-types/[id]/duplicate
- **Access**: Admin only
- **Response**: New machine type with different GUID, all other fields copied
- **Behavior**: Auto-appends " (Copy)" to machineTypeName if needed to ensure uniqueness
- **Error**: 404 if source not found

#### GET /api/machine-types/export
- **Access**: All authenticated users
- **Response**: CSV or JSON file with all machine types
- **Query Params**: `format=csv|json` (default: csv)
- **Filename**: `machine-types-YYYY-MM-DD.csv`

## Technical Implementation

### Database (Cosmos DB)
- **Container**: `machineTypes`
- **Partition Key**: `/id`
- **Indexes**: 
  - machineTypeId (non-unique, for filtering)
  - machineTypeName (case-insensitive, for uniqueness checks)
  - manufacturer (for filtering)
- **Note**: Only `id` (GUID) is guaranteed unique. machineTypeName must be checked for case-insensitive uniqueness at application level

### File Structure
```
lib/cosmos/models/
  machine-type.ts              # Cosmos DB operations

lib/validation/
  machine-type-schema.ts       # Zod validation schemas

app/api/machine-types/
  route.ts                     # GET all, POST create
  [id]/route.ts               # GET one, PUT update, DELETE
  [id]/duplicate/route.ts     # POST duplicate
  export/route.ts             # GET export (CSV/JSON)

app/(app)/machine-types/
  page.tsx                     # List page
  [id]/page.tsx               # View/Edit page
  new/page.tsx                # Create page

components/forms/
  MachineTypeForm.tsx         # Create/Edit form component

types/
  index.ts                    # MachineType TypeScript interface
```

### Validation Schema (Zod)
```typescript
const machineTypeSchema = z.object({
  machineTypeId: z.number().int().positive(), // Can be duplicated
  machineTypeName: z.string().min(1).max(100).trim(), // Case-insensitive unique
  manufacturer: z.string().min(1).max(100).trim(), // Free text
  description: z.string().max(500).optional(), // Optional configurable text
  x: z.number().int().min(0).max(10000), // Total travel (mm)
  y: z.number().int().min(0).max(10000), // Total travel (mm)
  z: z.number().int().min(0).max(10000), // Total travel (mm)
  a: z.number().min(0).max(360), // Total rotation (degrees), can be 0
  b: z.number().min(0).max(360), // Total rotation (degrees), can be 0
  c: z.number().min(0).max(360), // Total rotation (degrees), can be 0
});
```

## Non-Functional Requirements

### Performance
- List page should load within 2 seconds
- Form validation should be instant (<100ms)
- CRUD operations should complete within 1 second

### Security
- All endpoints require authentication
- Write operations require admin role verification
- Input sanitization on all fields
- CSRF protection on forms

### Usability
- Form should have clear field labels with units
- Validation errors should be specific and helpful
- Success/error messages after operations
- Responsive design for mobile/tablet

### Accessibility
- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader friendly labels
- Proper ARIA attributes

## Integration Points

### Existing Features
- **Machines**: Machine records can reference machineTypeId
- **Users**: Admin role check for write operations
- **Authentication**: Session-based access control

### Future Considerations
- Machine type templates for quick machine creation
- Import/export machine type definitions
- Machine type versioning/history
- Association with specific clients or projects

## Success Criteria
- [ ] Admins can create new machine types with all fields
- [ ] Admins can edit existing machine types
- [ ] Admins can delete machine types (with safety checks)
- [ ] All users can view machine type list and details
- [ ] Validation prevents invalid data entry
- [ ] Non-admins cannot access create/edit/delete functions
- [ ] Search/filter works on list page
- [ ] Responsive UI works on mobile devices

## Risks and Mitigations
- **Risk**: Deleting machine type breaks existing machine references
  - **Mitigation**: **PREVENT deletion entirely** if references exist, show error with machine count
- **Risk**: Duplicate machineTypeName (case variations like "DMU 50" vs "dmu 50")
  - **Mitigation**: Case-insensitive uniqueness check at API level before save
- **Risk**: Duplicate machineTypeId values cause confusion
  - **Mitigation**: **ALLOWED BY DESIGN** - only GUID must be unique, use machineTypeName for display
- **Risk**: Invalid axis values cause machine operation issues
  - **Mitigation**: Strict validation with reasonable limits, clearly label as "total travel"
- **Risk**: Free-text manufacturer leads to inconsistent entries
  - **Mitigation**: Accept for now, consider standardization in future version

## Timeline Estimate
- Data model and API: 4 hours
- UI components: 6 hours
- Integration and testing: 4 hours
- **Total**: ~14 hours (2 days)
