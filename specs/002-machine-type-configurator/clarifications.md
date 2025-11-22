# Machine Type Configurator - Clarification Questions

## Critical Questions (Need Answers Before Implementation)

### 1. **Axis Value Semantics**
**Question**: What do the X, Y, Z, A, B, C values represent exactly?
- **Option A**: Maximum travel distance/rotation (e.g., X=1000 means the machine can move 1000mm on X-axis)
- **Option B**: Current position limits
- **Option C**: Physical machine dimensions

**Recommendation**: Assuming Option A (max travel range) - please confirm.

**Impact**: Affects validation rules, UI labels, and how machines use this data.

---

### 2. **MachineTypeId vs ID**
**Question**: Why do we need both `id` (GUID) and `machineTypeId` (integer)?
- Is `machineTypeId` a user-visible/business identifier?
- Should it be auto-incremented or manually entered?
- Can users edit `machineTypeId` after creation?

**Current Assumption**: 
- `id` = Internal system ID (auto-generated GUID)
- `machineTypeId` = User-managed business ID (manually entered, must be unique)

**Recommendation**: If `machineTypeId` doesn't have business value, consider removing it to simplify.

**Impact**: Affects form design, validation, and user workflow.

---

### 3. **Rotational Axes (A, B, C) - Can they be optional?**
**Question**: Are all rotational axes required, or can some be 0/null for simpler machines?
- Many CNC machines only have 3 axes (X, Y, Z)
- Some have 4 axes (X, Y, Z, A)
- 5-axis machines have all six

**Current Spec**: All axes are required (can be 0)

**Recommendation**: Allow 0 values for axes that don't exist on the machine.

**Alternative**: Make A, B, C optional (nullable) to clearly indicate "not present" vs "0 range"

**Impact**: Affects validation, UI display, and machine compatibility checks.

---

### 4. **Machine Type Deletion Behavior**
**Question**: What happens when trying to delete a machine type that's referenced by existing machines?

**Options**:
- **A**: Prevent deletion entirely (show error message)
- **B**: Allow deletion but set machines to "null" or "unknown" type
- **C**: Allow deletion with cascade (delete all machines of this type - **DANGEROUS**)
- **D**: Soft delete (mark as inactive, hide from list but keep data)

**Current Spec**: Prevent deletion (Option A)

**Recommendation**: Option A is safest. Consider adding Option D for long-term data integrity.

**Impact**: Affects business logic and user experience.

---

### 5. **Manufacturer Field - Free Text or Predefined List?**
**Question**: Should manufacturer be:
- **Free text** (users can enter any manufacturer name)
- **Dropdown/Autocomplete** (predefined list of manufacturers)
- **Hybrid** (autocomplete with "Add New" option)

**Current Spec**: Free text

**Concern**: May lead to inconsistent entries (e.g., "Haas", "HAAS", "Haas Automation")

**Recommendation**: Use free text initially, but consider adding manufacturer standardization later.

**Impact**: Affects data consistency and filtering capabilities.

---

## Moderate Priority Questions

### 6. **Uniqueness - Case Sensitivity**
**Question**: Should `machineTypeName` uniqueness be case-sensitive?
- "DMU 50" vs "dmu 50" - are these the same or different?

**Current Spec**: Case-insensitive uniqueness

**Recommendation**: Case-insensitive is better for user experience.

---

### 7. **Edit Form - Pre-population**
**Question**: When editing, should the form show:
- Current values only
- Current values + change history
- Current values + suggestion for "typical" values

**Current Spec**: Shows current values only

**Recommendation**: Keep it simple - current values only.

---

### 8. **Axes Summary Display Format**
**Question**: In the list view, how should axes be summarized?
- **Option A**: "X:1000 Y:800 Z:600" (linear only)
- **Option B**: "X:1000 Y:800 Z:600 A:90 B:45 C:0" (all axes)
- **Option C**: "1000×800×600mm" (linear only, formatted)
- **Option D**: "3-axis" or "5-axis" (count of non-zero axes)

**Current Spec**: Option A

**Recommendation**: Use Option C for cleaner display, with tooltip showing all details.

---

### 9. **Sorting Default**
**Question**: How should the machine types list be sorted by default?
- By machineTypeId (numeric)
- By machineTypeName (alphabetical)
- By createdAt (newest first)
- By manufacturer then name

**Recommendation**: By machineTypeName (alphabetical) for easier browsing.

---

### 10. **Mobile Responsiveness**
**Question**: On mobile devices, should the form:
- Scroll vertically with all fields visible
- Use a wizard/stepper approach (Basic Info → Linear Axes → Rotational Axes)
- Use collapsible sections

**Recommendation**: Vertical scroll with collapsible sections for better UX.

---

## Low Priority (Nice to Have)

### 11. **Duplicate Machine Type**
**Question**: Should there be a "Duplicate" action to create a new machine type based on an existing one?

**Recommendation**: Yes - useful for creating similar machine types quickly.

---

### 12. **Bulk Operations**
**Question**: Do admins need to:
- Import multiple machine types from CSV/Excel?
- Export machine types for backup?
- Bulk delete?

**Recommendation**: Add export feature, defer import until needed.

---

### 13. **Audit Trail Visibility**
**Question**: Should users see the full audit trail (who created/updated and when)?
- Show in view page
- Show in list view (tooltip/column)
- Admin-only visibility
- Not shown in UI (available via API only)

**Current Spec**: Show in view page

**Recommendation**: Show in view page for admins, hide for others.

---

### 14. **Validation - Axis Relationships**
**Question**: Are there any relationships between axes that should be validated?
- E.g., Should Z always be smaller than X and Y?
- Should rotational axes have any constraints based on linear axes?

**Current Spec**: No cross-field validation

**Recommendation**: No special validation unless you have specific business rules.

---

### 15. **Integration with Machine Records**
**Question**: When creating/editing a machine, how is the machine type selected?
- Dropdown showing machineTypeName?
- Dropdown showing machineTypeId + name?
- Search/autocomplete?

**Current Assumption**: Dropdown with machineTypeName

**Recommendation**: Autocomplete for better UX if there are many types.

---

## Assumptions Made in Current Spec

1. ✓ All users can view machine types (read access)
2. ✓ Only admins can create/edit/delete
3. ✓ Linear axes (X, Y, Z) are in millimeters
4. ✓ Rotational axes (A, B, C) are in degrees
5. ✓ All fields are required (cannot be null)
6. ✓ MachineTypeId is manually entered (not auto-generated)
7. ✓ Deletion is prevented if machines reference the type
8. ✓ No soft delete (full deletion)
9. ✓ No versioning/history tracking
10. ✓ No approval workflow for changes

---

## Recommendations Summary

**Must Clarify Before Starting:**
1. Axis value semantics (Q1)
2. Purpose of machineTypeId vs id (Q2)
3. Whether rotational axes can be optional (Q3)

**Can Proceed With Assumptions:**
- Use case-insensitive uniqueness
- Prevent deletion if referenced
- Free text manufacturer
- Show current values only in edit form
- Default sort by name

**Defer to Later:**
- Duplicate functionality
- Import/export
- Advanced audit trail display
- Cross-field validation

---

## Next Steps

1. **Get answers to Critical Questions (1-3)**
2. **Review and approve assumptions**
3. **Proceed with implementation using clarified requirements**
4. **Re-evaluate moderate/low priority items after initial release**
