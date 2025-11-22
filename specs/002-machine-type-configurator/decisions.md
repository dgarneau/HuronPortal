# Machine Type Configurator - Final Decisions

## Date: November 21, 2025

### Clarifications Resolved

#### ✅ 1. Axis Value Semantics
**Decision**: X, Y, Z, A, B, C represent **total travel distance/rotation**
- Linear axes (X, Y, Z): Maximum travel distance in millimeters
- Rotational axes (A, B, C): Maximum rotation range in degrees
- Example: X=1000 means the machine can travel 1000mm on the X-axis

#### ✅ 2. Unique Identifiers
**Decision**: Only GUID is unique, machineTypeId can be duplicated
- `id` (GUID): System-generated, guaranteed unique, never changes
- `machineTypeId` (integer): User-entered, **can have duplicates**, used for business reference
- `machineTypeName`: **Case-insensitive unique** ("DMU 50" = "dmu 50")

**Rationale**: Allows flexibility for business numbering schemes where types might share IDs

#### ✅ 3. Rotational Axes (A, B, C)
**Decision**: All axes are required but **can be 0**
- 3-axis machines: Set A=0, B=0, C=0
- 4-axis machines: Set two of A/B/C to 0
- 5-axis machines: All values > 0

**Rationale**: Simpler data model, clearer than nullable fields

#### ✅ 4. Deletion Behavior
**Decision**: **PREVENT deletion** if machines reference the type
- Check for references before allowing delete
- Show error message with count of referencing machines
- No soft delete, no cascade delete

**Rationale**: Data integrity and safety - avoid breaking machine records

#### ✅ 5. Manufacturer Field
**Decision**: **Free text entry**
- No dropdown/predefined list
- Accept any manufacturer name

**Consideration**: May lead to inconsistent entries, but provides flexibility

#### ✅ 6. Name Case Sensitivity
**Decision**: machineTypeName is **case-insensitive unique**
- "DMU 50" and "dmu 50" are considered the same
- System prevents creating both variations

#### ✅ 7. List Display Format
**Decision**: Use **configurable Description field** instead of axes summary
- Add optional `description` field (max 500 characters)
- Display in list view instead of auto-generated axis summary
- Gives admins flexibility to describe the machine type

#### ✅ 8. Duplicate Feature
**Decision**: **YES - Add duplicate functionality**
- Admin action to create copy with new GUID
- Auto-appends " (Copy)" to name if needed for uniqueness
- Speeds up creating similar machine types

#### ✅ 9. Export Feature
**Decision**: **YES - Add export functionality**
- Export to CSV or JSON format
- Available to all authenticated users (not just admins)
- Filename format: `machine-types-YYYY-MM-DD.csv`

#### ✅ 11. Audit Trail
**Decision**: **YES - Show in view page**
- Display createdBy, createdAt, updatedBy, updatedAt
- Visible in detail view page
- Not shown in list view (keeps it clean)

#### ✅ 12. Bulk Import
**Decision**: **NO - Not in initial version**
- Defer to future enhancement
- Focus on core CRUD + export first

---

## Updated Data Model

```typescript
interface MachineType {
  id: string;                    // GUID - Unique (system-generated)
  machineTypeId: number;         // Integer - Can be duplicated
  machineTypeName: string;       // String - Case-insensitive unique
  manufacturer: string;          // String - Free text
  description?: string;          // String - Optional (max 500 chars)
  x: number;                     // Integer - Total travel (mm)
  y: number;                     // Integer - Total travel (mm)
  z: number;                     // Integer - Total travel (mm)
  a: number;                     // Real - Total rotation (degrees, can be 0)
  b: number;                     // Real - Total rotation (degrees, can be 0)
  c: number;                     // Real - Total rotation (degrees, can be 0)
  createdAt: string;             // ISO 8601 timestamp
  updatedAt: string;             // ISO 8601 timestamp
  createdBy: string;             // User ID
  updatedBy: string;             // User ID
}
```

---

## Key Features Summary

### ✅ Included in Initial Version
1. Full CRUD for machine types (admin only)
2. Read-only access for non-admins
3. Case-insensitive unique name validation
4. Free-text manufacturer entry
5. Optional description field for list display
6. **Duplicate** functionality (admin only)
7. **Export** to CSV/JSON (all users)
8. Prevent deletion if machines reference the type
9. Audit trail display in detail view
10. machineTypeId can be duplicated (only GUID is unique)

### ❌ Deferred to Future Versions
1. Bulk import from CSV/Excel
2. Manufacturer standardization/dropdown
3. Soft delete functionality
4. Machine type versioning/history
5. Advanced filtering/grouping
6. Machine type templates

---

## Implementation Notes

### Validation Priority
1. **Critical**: machineTypeName case-insensitive uniqueness
2. **Important**: Prevent deletion with references check
3. **Important**: All numeric field ranges (0-10000 for travel, 0-360 for rotation)
4. **Nice to have**: Trim whitespace on manufacturer/name fields

### API Endpoints Required
- `GET /api/machine-types` - List all
- `POST /api/machine-types` - Create new
- `GET /api/machine-types/[id]` - Get one
- `PUT /api/machine-types/[id]` - Update
- `DELETE /api/machine-types/[id]` - Delete (with safety check)
- `POST /api/machine-types/[id]/duplicate` - Duplicate
- `GET /api/machine-types/export` - Export CSV/JSON

### UI Components Required
- List page with DataGrid
- Create form
- Edit form (same component as create)
- View/detail page
- Delete confirmation dialog
- Duplicate confirmation (optional)
- Export format selector (CSV/JSON)

---

## Timeline Update

With added features (duplicate + export):
- Data model and API: **5 hours** (was 4, +1 for new endpoints)
- UI components: **7 hours** (was 6, +1 for export/duplicate UI)
- Integration and testing: **4 hours** (unchanged)
- **Total**: ~16 hours (2 days)

---

## Sign-off

Specification clarified and approved: November 21, 2025
Ready for implementation: ✅
