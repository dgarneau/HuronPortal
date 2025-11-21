# Tasks: Système de Gestion des Machines CNC

**Input**: Design documents from `/specs/001-cnc-machine-management/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US6)
- Include exact file paths in descriptions

## Path Conventions

This is a Next.js App Router project with TypeScript:
- Frontend pages: `app/`
- Backend API routes: `app/api/`
- React components: `components/`
- Validation schemas: `lib/validation/`
- Database access: `lib/cosmos/`
- Utilities: `lib/utils/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create Next.js 14 project with TypeScript and App Router in `C:\GIT\HuronPortal`
- [ ] T002 Install dependencies: tailwindcss@3.4.18, @tanstack/react-query@5.90.5, @azure/cosmos, bcrypt, zod, react-hook-form, @hookform/resolvers
- [ ] T003 [P] Configure tailwind.config.ts with industrial color palette for CNC aesthetic (from research.md)
- [ ] T004 [P] Configure tsconfig.json with strict mode enabled
- [ ] T005 [P] Setup ESLint and Prettier configuration
- [ ] T006 Create project directory structure per plan.md (app, components, lib, types folders)
- [ ] T007 Create .env.local template with required environment variables (COSMOS_ENDPOINT, COSMOS_KEY, SESSION_SECRET)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T008 Setup Azure Cosmos DB connection in `lib/cosmos/client.ts`
- [ ] T009 Create Cosmos DB containers (Users, Machines, Clients) with partition key configuration per data-model.md
- [ ] T010 [P] Implement base validation schemas in `lib/validation/schemas.ts` (User, Machine, Client)
- [ ] T011 [P] Create French error messages dictionary in `lib/validation/messages.ts` with all validation messages
- [ ] T012 [P] Create base UI components in `components/ui/`: Button.tsx, Input.tsx, FormField.tsx, ErrorMessage.tsx, LoadingSpinner.tsx
- [ ] T013 Implement session management utilities in `lib/auth/session.ts` (create, validate, destroy sessions with HTTP-only cookies, 1-hour expiration)
- [ ] T014 [P] Create middleware for session validation in `lib/auth/middleware.ts`
- [ ] T015 [P] Create role-based access control utilities in `lib/auth/permissions.ts` (check Admin, Contrôleur, Utilisateur permissions)
- [ ] T016 Implement password hashing utilities in `lib/auth/password.ts` using bcrypt with cost factor 12
- [ ] T017 [P] Create base layout components: Navigation.tsx, Header.tsx in `components/layout/`
- [ ] T018 [P] Setup TanStack Query provider in `app/providers.tsx`
- [ ] T019 Create error handling utilities in `lib/utils/errors.ts` for French error responses
- [ ] T020 [P] Create date formatting utilities in `lib/utils/format.ts` (JJ/MM/AAAA format)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Connexion Administrateur et Accès Initial (Priority: P1) 🎯 MVP

**Goal**: Enable admin login with session management and redirect to main dashboard

**Independent Test**: Navigate to /login, enter admin credentials, verify redirect to dashboard and session persistence

### Implementation for User Story 1

- [ ] T021 [P] [US1] Create User entity model in `lib/cosmos/models/user.ts` with CRUD operations
- [ ] T022 [P] [US1] Seed initial admin user in database (username: admin, role: Admin, isActive: true)
- [ ] T023 [US1] Create login page in `app/(auth)/login/page.tsx` with custom validation (noValidate form)
- [ ] T024 [US1] Create LoginForm component in `components/forms/LoginForm.tsx` using React Hook Form + Zod
- [ ] T025 [US1] Implement POST /api/auth/login endpoint in `app/api/auth/login/route.ts` (validate credentials, create session, set HTTP-only cookie)
- [ ] T026 [US1] Implement POST /api/auth/logout endpoint in `app/api/auth/logout/route.ts` (destroy session, clear cookie)
- [ ] T027 [US1] Implement GET /api/auth/session endpoint in `app/api/auth/session/route.ts` (validate active session)
- [ ] T028 [US1] Create protected route wrapper in `app/(app)/layout.tsx` (check session, redirect to /login if expired)
- [ ] T029 [US1] Implement session timeout logic (1-hour inactivity check on each API request)
- [ ] T030 [US1] Add French error messages for invalid credentials: "Identifiants invalides" in messages.ts
- [ ] T031 [US1] Create Toast notification component in `components/ui/Toast.tsx` for success/error messages

**Checkpoint**: At this point, User Story 1 should be fully functional - admin can login, session persists for 1 hour, logout works

---

## Phase 4: User Story 2 - Consultation de la Liste des Machines (Priority: P1) 🎯 MVP

**Goal**: Display machine grid with Numéro #OL, Type, Client name columns for all authenticated users

**Independent Test**: After login, verify machine grid displays on homepage with all columns, shows empty state if no machines exist

### Implementation for User Story 2

- [ ] T032 [P] [US2] Create Machine entity model in `lib/cosmos/models/machine.ts` with CRUD operations and ETag support
- [ ] T033 [P] [US2] Create Client entity model in `lib/cosmos/models/client.ts` with CRUD operations and ETag support
- [ ] T034 [US2] Implement GET /api/machines endpoint in `app/api/machines/route.ts` (with pagination, role-based access)
- [ ] T035 [US2] Create main dashboard page in `app/(app)/page.tsx` (homepage after login)
- [ ] T036 [US2] Create DataGrid component in `components/ui/DataGrid.tsx` with sorting and pagination
- [ ] T037 [US2] Create MachineGrid component in `components/features/machines/MachineGrid.tsx` (fetch machines, display in DataGrid)
- [ ] T038 [US2] Add empty state message "Aucune machine enregistrée" when no machines exist
- [ ] T039 [US2] Implement role-based UI hiding (Utilisateur role shows read-only grid without action buttons)
- [ ] T040 [US2] Add loading spinner during grid data fetch
- [ ] T041 [US2] Optimize grid query for 500 machines (target <2s load time) using Cosmos DB query pagination

**Checkpoint**: At this point, User Stories 1 AND 2 work - users can login and view machine grid

---

## Phase 5: User Story 3 - Gestion des Clients (Priority: P2)

**Goal**: Enable Admin and Contrôleur to create/edit clients, Admin to delete clients, all users to view clients

**Independent Test**: Navigate to /clients, verify client list displays, create new client, edit existing, attempt delete with/without machines

### Implementation for User Story 3

- [ ] T042 [US3] Create clients page in `app/(app)/clients/page.tsx`
- [ ] T043 [US3] Create ClientList component in `components/features/clients/ClientList.tsx` with grid display
- [ ] T044 [US3] Implement GET /api/clients endpoint in `app/api/clients/route.ts` (with pagination, sorting, role-based access)
- [ ] T045 [US3] Create client form page in `app/(app)/clients/new/page.tsx`
- [ ] T046 [US3] Create ClientForm component in `components/forms/ClientForm.tsx` with custom validation (noValidate)
- [ ] T047 [US3] Add client validation schema in `lib/validation/schemas.ts` (companyName, address, province, postalCode with Canadian format)
- [ ] T048 [US3] Implement POST /api/clients endpoint in `app/api/clients/route.ts` (Admin and Contrôleur only)
- [ ] T049 [US3] Create client edit page in `app/(app)/clients/[id]/page.tsx`
- [ ] T050 [US3] Implement GET /api/clients/[id] endpoint in `app/api/clients/[id]/route.ts`
- [ ] T051 [US3] Implement PUT /api/clients/[id] endpoint in `app/api/clients/[id]/route.ts` (with ETag concurrency check, Admin and Contrôleur only)
- [ ] T052 [US3] Implement DELETE /api/clients/[id] endpoint in `app/api/clients/[id]/route.ts` (Admin only, block if machineCount > 0)
- [ ] T053 [US3] Add French validation messages for client fields in messages.ts
- [ ] T054 [US3] Implement role-based UI: hide delete button for Contrôleur and Utilisateur
- [ ] T055 [US3] Add error message "Ce client a {count} machine(s) associée(s)" when attempting to delete client with machines
- [ ] T056 [US3] Implement concurrent modification warning (412 response) with French message "Ce client a été modifié par un autre utilisateur"
- [ ] T057 [US3] Update Client model to maintain machineCount field (denormalized for performance)

**Checkpoint**: At this point, User Stories 1, 2, AND 3 work - clients can be managed with proper permissions

---

## Phase 6: User Story 4 - Création et Modification de Machines CNC (Priority: P2)

**Goal**: Enable Admin and Contrôleur to create/edit machines with client selection dropdown search

**Independent Test**: Navigate to /machines/new, fill form with Numéro #OL, Type, search and select Client, save, verify machine appears in grid

### Implementation for User Story 4

- [ ] T058 [US4] Create machine creation page in `app/(app)/machines/new/page.tsx`
- [ ] T059 [US4] Create MachineForm component in `components/forms/MachineForm.tsx` with custom validation (noValidate)
- [ ] T060 [US4] Add machine validation schema in `lib/validation/schemas.ts` (numeroOL unique, type required, clientId UUID)
- [ ] T061 [US4] Create searchable Select component in `components/ui/Select.tsx` with debounced search (300ms delay per research.md)
- [ ] T062 [US4] Implement GET /api/clients/search endpoint in `app/api/clients/search/route.ts` (query parameter ?q=, returns id, companyName, province)
- [ ] T063 [US4] Implement POST /api/machines endpoint in `app/api/machines/route.ts` (Admin and Contrôleur only, validate numeroOL uniqueness)
- [ ] T064 [US4] Add French validation messages: "Ce numéro #OL existe déjà", "Ce champ est requis", "Client invalide" in messages.ts
- [ ] T065 [US4] Create machine edit page in `app/(app)/machines/[id]/page.tsx`
- [ ] T066 [US4] Implement GET /api/machines/[id] endpoint in `app/api/machines/[id]/route.ts`
- [ ] T067 [US4] Implement PUT /api/machines/[id] endpoint in `app/api/machines/[id]/route.ts` (with ETag concurrency check, Admin and Contrôleur only)
- [ ] T068 [US4] Update Machine entity to denormalize clientName for grid performance
- [ ] T069 [US4] Add concurrent modification warning (412 response) with French message "Cette machine a été modifiée par un autre utilisateur"
- [ ] T070 [US4] Implement role-based UI: Admin and Contrôleur see "Ajouter une machine" button, Utilisateur does not
- [ ] T071 [US4] Add navigation link to machine creation page in Header/Navigation component
- [ ] T072 [US4] Validate all form fields are required with French error messages before submission

**Checkpoint**: At this point, User Stories 1-4 work - machines can be created and modified with client association

---

## Phase 7: User Story 5 - Gestion des Utilisateurs (Priority: P3)

**Goal**: Enable Admin to create, edit, delete users with role assignment and password setting

**Independent Test**: Login as admin, navigate to /users, create new user with password, verify role permissions work, edit role, delete user

### Implementation for User Story 5

- [ ] T073 [US5] Create users page in `app/(app)/users/page.tsx` (Admin only)
- [ ] T074 [US5] Create UserList component in `components/features/users/UserList.tsx` with grid display
- [ ] T075 [US5] Implement GET /api/users endpoint in `app/api/users/route.ts` (Admin only, with pagination and role filter)
- [ ] T076 [US5] Create user form page in `app/(app)/users/new/page.tsx` (Admin only)
- [ ] T077 [US5] Create UserForm component in `components/forms/UserForm.tsx` with password field (noValidate form)
- [ ] T078 [US5] Add user validation schema in `lib/validation/schemas.ts` (username unique, password min 8 chars, role enum, email format)
- [ ] T079 [US5] Implement POST /api/users endpoint in `app/api/users/route.ts` (Admin only, hash password with bcrypt before storing)
- [ ] T080 [US5] Create user edit page in `app/(app)/users/[id]/page.tsx` (Admin only)
- [ ] T081 [US5] Implement GET /api/users/[id] endpoint in `app/api/users/[id]/route.ts` (Admin only)
- [ ] T082 [US5] Implement PUT /api/users/[id] endpoint in `app/api/users/[id]/route.ts` (Admin only, with ETag concurrency, validate username uniqueness)
- [ ] T083 [US5] Implement DELETE /api/users/[id] endpoint in `app/api/users/[id]/route.ts` (Admin only, prevent deleting last admin, cannot delete self)
- [ ] T084 [US5] Add French validation messages: "Le nom d'utilisateur est requis", "Le mot de passe doit contenir au moins 8 caractères", "Adresse courriel invalide" in messages.ts
- [ ] T085 [US5] Add role-based navigation: only show "Utilisateurs" menu item for Admin role
- [ ] T086 [US5] Implement prevention of last admin deletion with error message "Impossible de supprimer le dernier administrateur"
- [ ] T087 [US5] Add prevention of self-deletion with error message "Vous ne pouvez pas supprimer votre propre compte"
- [ ] T088 [US5] Add password reset endpoint PUT /api/users/[id]/password (Admin only) for changing user passwords

**Checkpoint**: At this point, User Stories 1-5 work - full user management with role-based permissions

---

## Phase 8: User Story 6 - Suppression de Machines (Priority: P3)

**Goal**: Enable Admin to delete machines with confirmation, prevent Contrôleur and Utilisateur from deleting

**Independent Test**: Login as admin, select machine from grid, click delete, confirm, verify machine removed and does not cascade delete client

### Implementation for User Story 6

- [ ] T089 [US6] Implement DELETE /api/machines/[id] endpoint in `app/api/machines/[id]/route.ts` (Admin only)
- [ ] T090 [US6] Create Modal component in `components/ui/Modal.tsx` for confirmation dialogs
- [ ] T091 [US6] Add delete confirmation modal to MachineGrid component with French message "Êtes-vous sûr de vouloir supprimer cette machine?"
- [ ] T092 [US6] Implement role-based UI: only show delete button for Admin role in machine grid
- [ ] T093 [US6] Add success message after deletion "Machine supprimée avec succès"
- [ ] T094 [US6] Verify machine deletion does NOT delete associated client (no cascade delete)
- [ ] T095 [US6] Update Client.machineCount field when machine is deleted (decrement counter)
- [ ] T096 [US6] Add 403 Forbidden response for Contrôleur and Utilisateur attempting delete with French message "Seuls les Administrateurs peuvent supprimer des machines"

**Checkpoint**: All user stories (1-6) are now independently functional and tested

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T097 [P] Add responsive design breakpoints in Tailwind config for mobile and tablet views
- [ ] T098 [P] Implement loading states with LoadingSpinner for all async operations
- [ ] T099 [P] Add Toast notifications for all success operations (create, update, delete)
- [ ] T100 [P] Verify all UI text is in French (no English labels, buttons, or messages)
- [ ] T101 [P] Optimize Cosmos DB queries to stay within free tier RU budget (1000 RU/s)
- [ ] T102 [P] Add error boundary component in `app/error.tsx` with French error message
- [ ] T103 [P] Implement proper TypeScript types in `types/` folder (User, Machine, Client, Session)
- [ ] T104 [P] Add ARIA labels and accessibility attributes to all interactive components
- [ ] T105 Test performance: verify machine grid loads in <2s for 500 machines (SC-003)
- [ ] T106 Test performance: verify client search returns results in <500ms (SC-005)
- [ ] T107 Test session timeout: verify user is redirected to login after 1 hour inactivity (FR-003)
- [ ] T108 Test concurrent modification: verify warning displays when editing record modified by another user (FR-035)
- [ ] T109 Test role permissions: verify Utilisateur cannot create/edit/delete anything (FR-016)
- [ ] T110 Test role permissions: verify Contrôleur cannot delete machines or clients (FR-015, FR-023)
- [ ] T111 Verify client deletion blocked when machines exist with proper error message (FR-025)
- [ ] T112 Verify machine deletion does not cascade to client (FR-025a)
- [ ] T113 Verify all forms use noValidate attribute to disable browser validation (Research requirement)
- [ ] T114 Verify all error messages displayed through custom ErrorMessage components in French
- [ ] T115 Run through quickstart.md setup instructions to validate documentation
- [ ] T116 [P] Create README.md in project root with setup and deployment instructions
- [ ] T117 [P] Add Azure Static Web Apps deployment configuration in `.github/workflows/azure-static-web-apps.yml`
- [ ] T118 Test on Chrome, Edge, Firefox to verify cross-browser compatibility (SC-009)
- [ ] T119 Verify Lighthouse score >90 for performance, accessibility, best practices (Performance Goals)
- [ ] T120 Final code cleanup and removal of console.logs, unused imports

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-8)**: All depend on Foundational phase completion
  - User Story 1 (P1): Can start after Foundational - No dependencies on other stories
  - User Story 2 (P1): Can start after Foundational - No dependencies on other stories
  - User Story 3 (P2): Can start after Foundational - No dependencies on other stories
  - User Story 4 (P2): Should start after User Story 3 (needs Client entity) - but can be developed in parallel
  - User Story 5 (P3): Can start after Foundational - No dependencies on other stories
  - User Story 6 (P3): Should start after User Story 2 (needs machine grid) - but can be developed in parallel
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### Within Each User Story

- Models/entities before services/API routes
- API routes before UI pages
- Form components before pages that use them
- Validation schemas before forms
- Core implementation before role-based restrictions

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, User Stories 1, 2, 3, 5 can start in parallel (if team capacity allows)
- User Story 4 should wait for US3 client model, or develop in parallel with coordination
- All Polish tasks marked [P] can run in parallel
- T021 and T033 (entity models) can be built in parallel
- UI components in Phase 2 can be built in parallel with data layer

### Critical Path for MVP (User Stories 1 + 2 only)

1. Phase 1: Setup → T001-T007
2. Phase 2: Foundational → T008-T020
3. Phase 3: User Story 1 → T021-T031
4. Phase 4: User Story 2 → T032-T041

This delivers login + machine grid viewing, which is the core MVP.

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. Complete Phase 1: Setup (T001-T007)
2. Complete Phase 2: Foundational (T008-T020)
3. Complete Phase 3: User Story 1 - Login (T021-T031)
4. Complete Phase 4: User Story 2 - Machine Grid (T032-T041)
5. **STOP and VALIDATE**: Test login and machine viewing independently
6. Deploy/demo if ready

This gives you a working authentication system and read-only machine dashboard.

### Incremental Delivery (Recommended)

1. MVP: User Stories 1 + 2 → Deploy
2. Add User Story 3 (Clients) → Test independently → Deploy
3. Add User Story 4 (Machine CRUD) → Test independently → Deploy
4. Add User Story 5 (User Management) → Test independently → Deploy
5. Add User Story 6 (Machine Deletion) → Test independently → Deploy
6. Polish (Phase 9) → Final deployment

Each increment adds value without breaking previous stories.

### Parallel Team Strategy

With 3 developers after Foundational phase completes:

- **Developer A**: User Stories 1 + 2 (Login + Grid)
- **Developer B**: User Story 3 (Clients) + User Story 5 (Users)
- **Developer C**: Foundational UI components + User Story 4 setup

Then synchronize for User Story 4 (needs Client entity from Dev B).

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label (US1-US6) maps task to specific user story for traceability
- Each user story should be independently completable and testable
- All forms MUST use `noValidate` attribute to disable browser native validation
- All error messages MUST be in French from centralized dictionary
- All validation MUST use React Hook Form + Zod (no native browser validation)
- ETag concurrency checks required for PUT operations (Machines, Clients, Users)
- Commit after each task or logical group of related tasks
- Stop at any checkpoint to validate story works independently
- Admin role required for: delete machines, delete clients, all user management
- Contrôleur role: create/edit machines and clients, cannot delete
- Utilisateur role: read-only access to all pages
- Backend always runs in production (Azure), frontend can run locally connecting to production API
