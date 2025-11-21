import type { UserRole, Session } from '@/types';

/**
 * Check if user role has permission for an action
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions.includes(permission);
}

/**
 * Check if session user can perform action
 */
export function canPerformAction(session: Session | null, permission: Permission): boolean {
  if (!session) return false;
  return hasPermission(session.role, permission);
}

/**
 * Available permissions in the system
 */
export type Permission =
  // Machine permissions
  | 'machines:read'
  | 'machines:create'
  | 'machines:update'
  | 'machines:delete'
  // Client permissions
  | 'clients:read'
  | 'clients:create'
  | 'clients:update'
  | 'clients:delete'
  // User permissions
  | 'users:read'
  | 'users:create'
  | 'users:update'
  | 'users:delete';

/**
 * Role-based permission matrix
 */
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  Admin: [
    'machines:read',
    'machines:create',
    'machines:update',
    'machines:delete',
    'clients:read',
    'clients:create',
    'clients:update',
    'clients:delete',
    'users:read',
    'users:create',
    'users:update',
    'users:delete',
  ],
  Contrôleur: [
    'machines:read',
    'machines:create',
    'machines:update',
    // NO machines:delete
    'clients:read',
    'clients:create',
    'clients:update',
    // NO clients:delete
    // NO user permissions
  ],
  Utilisateur: [
    'machines:read',
    'clients:read',
    // Read-only access only
  ],
};

/**
 * Check if user is Admin
 */
export function isAdmin(session: Session | null): boolean {
  return session?.role === 'Admin';
}

/**
 * Check if user is Contrôleur or Admin
 */
export function isContrôleurOrAdmin(session: Session | null): boolean {
  return session?.role === 'Contrôleur' || session?.role === 'Admin';
}

/**
 * Check if user can manage users (Admin only)
 */
export function canManageUsers(session: Session | null): boolean {
  return isAdmin(session);
}

/**
 * Check if user can delete entities (Admin only)
 */
export function canDelete(session: Session | null): boolean {
  return isAdmin(session);
}

/**
 * Check if user can write (create/update) - Contrôleur or Admin
 */
export function canWrite(role: UserRole): boolean {
  return role === 'Admin' || role === 'Contrôleur';
}
