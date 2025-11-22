# Machine Type Configurator - Implementation Tasks

## Phase 1: Data Model & Backend (Priority: High)

### Task 1.1: Create TypeScript Types
- [ ] Add `MachineType` interface to `types/index.ts`
- [ ] Include all fields: id, machineTypeId, machineTypeName, manufacturer, x, y, z, a, b, c, timestamps
- **Estimated Time**: 30 minutes

### Task 1.2: Create Validation Schema
- [ ] Create `lib/validation/machine-type-schema.ts`
- [ ] Define Zod schema with all validation rules
- [ ] Add custom error messages for each field
- [ ] Export validation functions
- **Estimated Time**: 1 hour

### Task 1.3: Cosmos DB Model
- [ ] Create `lib/cosmos/models/machine-type.ts`
- [ ] Implement `createMachineType(data)` function
- [ ] Implement `getMachineTypeById(id)` function
- [ ] Implement `getAllMachineTypes()` function
- [ ] Implement `updateMachineType(id, data)` function
- [ ] Implement `deleteMachineType(id)` function
- [ ] Add uniqueness checks for machineTypeId and machineTypeName
- **Estimated Time**: 2 hours

### Task 1.4: API Routes - Collection
- [ ] Create `app/api/machine-types/route.ts`
- [ ] Implement GET handler (list all machine types)
- [ ] Implement POST handler (create new machine type)
- [ ] Add authentication check
- [ ] Add admin role check for POST
- [ ] Add validation error handling
- [ ] Add search/filter query params support
- **Estimated Time**: 1.5 hours

### Task 1.5: API Routes - Individual Resource
- [ ] Create `app/api/machine-types/[id]/route.ts`
- [ ] Implement GET handler (get single machine type)
- [ ] Implement PUT handler (update machine type)
- [ ] Implement DELETE handler (delete machine type)
- [ ] Add authentication checks
- [ ] Add admin role checks for PUT/DELETE
- [ ] Add reference check before deletion
- **Estimated Time**: 1.5 hours

## Phase 2: UI Components (Priority: High)

### Task 2.1: Machine Type Form Component
- [ ] Create `components/forms/MachineTypeForm.tsx`
- [ ] Add all form fields with proper types
- [ ] Integrate react-hook-form
- [ ] Add Zod validation with error display
- [ ] Add unit labels (mm, degrees)
- [ ] Add save/cancel buttons
- [ ] Style with Tailwind CSS
- **Estimated Time**: 2 hours

### Task 2.2: List Page
- [ ] Create `app/(app)/machine-types/page.tsx`
- [ ] Implement DataGrid with machine type columns
- [ ] Add search/filter functionality
- [ ] Add "Add Machine Type" button (admin only)
- [ ] Add edit/delete action buttons (admin only)
- [ ] Add loading and error states
- [ ] Implement pagination if needed
- **Estimated Time**: 2 hours

### Task 2.3: Create Page
- [ ] Create `app/(app)/machine-types/new/page.tsx`
- [ ] Use MachineTypeForm component
- [ ] Handle form submission
- [ ] Add success/error notifications
- [ ] Redirect to list after creation
- [ ] Add breadcrumb navigation
- **Estimated Time**: 1 hour

### Task 2.4: View/Edit Page
- [ ] Create `app/(app)/machine-types/[id]/page.tsx`
- [ ] Fetch machine type data
- [ ] Display read-only view for non-admins
- [ ] Use MachineTypeForm for admins (edit mode)
- [ ] Add delete functionality with confirmation
- [ ] Handle not found errors
- [ ] Add breadcrumb navigation
- **Estimated Time**: 1.5 hours

## Phase 3: Integration & Testing (Priority: Medium)

### Task 3.1: Database Setup
- [ ] Create `machineTypes` container in Cosmos DB (if not exists)
- [ ] Set up partition key configuration
- [ ] Create indexes for performance
- [ ] Verify container permissions
- **Estimated Time**: 30 minutes

### Task 3.2: Seed Data
- [ ] Create `lib/cosmos/seed-machine-types.ts`
- [ ] Add sample machine types (3-5 examples)
- [ ] Include various manufacturers
- [ ] Test script execution
- **Estimated Time**: 30 minutes

### Task 3.3: Permission Testing
- [ ] Test admin can create/edit/delete
- [ ] Test non-admin can only view
- [ ] Test unauthenticated users are blocked
- [ ] Verify role-based UI elements show/hide correctly
- **Estimated Time**: 1 hour

### Task 3.4: Validation Testing
- [ ] Test all field validations (min/max, required, type)
- [ ] Test uniqueness constraints
- [ ] Test error messages display correctly
- [ ] Test form prevents invalid submissions
- **Estimated Time**: 1 hour

### Task 3.5: End-to-End Testing
- [ ] Test complete create flow
- [ ] Test complete edit flow
- [ ] Test complete delete flow
- [ ] Test search/filter functionality
- [ ] Test responsive design on mobile
- **Estimated Time**: 1 hour

## Phase 4: Enhancement & Polish (Priority: Low)

### Task 4.1: UI Enhancements
- [ ] Add tooltips for axis fields
- [ ] Add visual preview of machine dimensions
- [ ] Improve error messages with suggestions
- [ ] Add loading skeletons
- **Estimated Time**: 2 hours

### Task 4.2: Documentation
- [ ] Add API documentation comments
- [ ] Create user guide for admins
- [ ] Document machine type field meanings
- [ ] Add troubleshooting guide
- **Estimated Time**: 1 hour

### Task 4.3: Performance Optimization
- [ ] Add caching for list queries
- [ ] Optimize Cosmos DB queries
- [ ] Add request debouncing for search
- [ ] Minimize re-renders
- **Estimated Time**: 1 hour

## Total Estimated Time
- **Phase 1 (Backend)**: ~6.5 hours
- **Phase 2 (Frontend)**: ~6.5 hours
- **Phase 3 (Testing)**: ~4 hours
- **Phase 4 (Polish)**: ~4 hours
- **Total**: ~21 hours (~3 days)

## Dependencies
- Existing authentication system
- Existing role-based access control
- Cosmos DB setup
- UI component library (Button, DataGrid, FormField, etc.)

## Notes
- Start with Phase 1 to establish solid backend foundation
- Phase 2 can begin once API routes are complete
- Phase 3 should be done incrementally during development
- Phase 4 can be deferred if timeline is tight
