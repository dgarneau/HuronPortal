import { getContainer, handleCosmosError } from '../client';
import type { User, UserCreateInput, UserUpdateInput } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export async function createUser(data: UserCreateInput & { passwordHash: string }): Promise<User> {
  try {
    const container = await getContainer('users');
    const now = new Date().toISOString();
    
    const user: User = {
      id: uuidv4(),
      username: data.username,
      email: data.email,
      name: data.name,
      passwordHash: data.passwordHash,
      role: data.role,
      isActive: data.isActive,
      createdAt: now,
      updatedAt: now,
    };
    
    const { resource } = await container.items.create(user);
    return resource as User;
  } catch (error) {
    return handleCosmosError(error);
  }
}

export async function getUserByUsername(username: string): Promise<User | null> {
  try {
    const container = await getContainer('users');
    const querySpec = {
      query: 'SELECT * FROM users u WHERE u.username = @username',
      parameters: [{ name: '@username', value: username }],
    };
    
    const { resources } = await container.items.query<User>(querySpec).fetchAll();
    return resources[0] || null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const container = await getContainer('users');
    const querySpec = {
      query: 'SELECT * FROM users u WHERE u.email = @email',
      parameters: [{ name: '@email', value: email }],
    };
    
    const { resources } = await container.items.query<User>(querySpec).fetchAll();
    return resources[0] || null;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const container = await getContainer('users');
    const querySpec = {
      query: 'SELECT * FROM users u WHERE u.id = @id',
      parameters: [{ name: '@id', value: id }],
    };
    
    const { resources } = await container.items.query<User>(querySpec).fetchAll();
    return resources[0] || null;
  } catch (error) {
    console.error('Error fetching user by id:', error);
    return null;
  }
}

export async function updateUser(id: string, username: string, data: UserUpdateInput, etag?: string): Promise<User> {
  try {
    const container = await getContainer('users');
    const existing = await container.item(id, username).read<User>();
    
    if (!existing.resource) {
      throw new Error('NOT_FOUND');
    }
    
    const updated: User = {
      ...existing.resource,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    const options = etag ? { accessCondition: { type: 'IfMatch' as const, condition: etag } } : undefined;
    const { resource } = await container.item(id, username).replace<User>(updated, options);
    
    if (!resource) throw new Error('NOT_FOUND');
    return resource;
  } catch (error) {
    return handleCosmosError(error);
  }
}

export async function deleteUser(id: string, username: string): Promise<void> {
  try {
    const container = await getContainer('users');
    await container.item(id, username).delete();
  } catch (error) {
    return handleCosmosError(error);
  }
}

export async function listUsers(filters?: { role?: string; isActive?: boolean }): Promise<User[]> {
  try {
    const container = await getContainer('users');
    let query = 'SELECT * FROM users u WHERE 1=1';
    const parameters: Array<{ name: string; value: any }> = [];
    
    if (filters?.role) {
      query += ' AND u.role = @role';
      parameters.push({ name: '@role', value: filters.role });
    }
    
    if (filters?.isActive !== undefined) {
      query += ' AND u.isActive = @isActive';
      parameters.push({ name: '@isActive', value: filters.isActive });
    }
    
    query += ' ORDER BY u.username';
    
    const querySpec = { query, parameters };
    const { resources } = await container.items.query<User>(querySpec).fetchAll();
    
    return resources;
  } catch (error) {
    console.error('Error listing users:', error);
    return [];
  }
}

export async function updateLastLogin(id: string, username: string): Promise<void> {
  try {
    const container = await getContainer('users');
    const existing = await container.item(id, username).read<User>();
    
    if (existing.resource) {
      const updated = {
        ...existing.resource,
        lastLogin: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await container.item(id, username).replace(updated);
    }
  } catch (error) {
    console.error('Error updating last login:', error);
  }
}
