// User entity types
export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  _etag?: string;
}

export type UserRole = 'Admin' | 'Contrôleur' | 'Utilisateur';

export interface UserCreateInput {
  username: string;
  email: string;
  name: string;
  password: string;
  role: UserRole;
  isActive: boolean;
}

export interface UserUpdateInput {
  username?: string;
  email?: string;
  name?: string;
  role?: UserRole;
  isActive?: boolean;
  passwordHash?: string;
}

// Machine entity types
export interface Machine {
  id: string;
  numeroOL: string;
  type: string;
  clientId: string;
  clientName: string; // Denormalized
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  _etag?: string;
}

export interface MachineCreateInput {
  numeroOL: string;
  type: string;
  clientId: string;
}

export interface MachineUpdateInput {
  numeroOL?: string;
  type?: string;
  clientId?: string;
}

// Client entity types
export interface Client {
  id: string;
  companyName: string;
  address: string;
  province: Province;
  postalCode: string;
  machineCount: number;
  createdAt: string;
  updatedAt: string;
  _etag?: string;
}

export type Province = 'QC' | 'ON' | 'AB' | 'BC' | 'MB' | 'NB' | 'NL' | 'NT' | 'NS' | 'NU' | 'PE' | 'SK' | 'YT';

export interface ClientCreateInput {
  companyName: string;
  address: string;
  province: Province;
  postalCode: string;
}

export interface ClientUpdateInput {
  companyName?: string;
  address?: string;
  province?: Province;
  postalCode?: string;
}

// Machine Type entity types
export interface MachineType {
  id: string;                    // GUID - Unique system identifier
  machineTypeId: number;         // Integer - Business ID (can be duplicated)
  machineTypeName: string;       // String - Display name (case-insensitive unique)
  manufacturer: string;          // String - Manufacturer name (free text)
  description?: string;          // String - Optional description (max 500 chars)
  x: number;                     // Integer - X-axis total travel (mm)
  y: number;                     // Integer - Y-axis total travel (mm)
  z: number;                     // Integer - Z-axis total travel (mm)
  a: number;                     // Real - A-axis total rotation (degrees, can be 0)
  b: number;                     // Real - B-axis total rotation (degrees, can be 0)
  c: number;                     // Real - C-axis total rotation (degrees, can be 0)
  createdAt: string;             // ISO 8601 timestamp
  updatedAt: string;             // ISO 8601 timestamp
  createdBy: string;             // User ID who created
  updatedBy: string;             // User ID who last updated
  _etag?: string;                // Cosmos DB concurrency token
}

export interface MachineTypeCreateInput {
  machineTypeId: number;
  machineTypeName: string;
  manufacturer: string;
  description?: string;
  x: number;
  y: number;
  z: number;
  a: number;
  b: number;
  c: number;
}

export interface MachineTypeUpdateInput {
  machineTypeId?: number;
  machineTypeName?: string;
  manufacturer?: string;
  description?: string;
  x?: number;
  y?: number;
  z?: number;
  a?: number;
  b?: number;
  c?: number;
}

// Session types
export interface Session {
  id: string;
  userId: string;
  username: string;
  role: UserRole;
  createdAt: number;
  expiresAt: number;
}

// API Response types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  code?: string;
  message?: string;
  details?: Array<{ field: string; message: string }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
