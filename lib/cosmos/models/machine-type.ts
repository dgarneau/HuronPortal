import { getContainer } from '../client';
import { MachineType, MachineTypeCreateInput, MachineTypeUpdateInput } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const CONTAINER_NAME = 'machineTypes';

/**
 * Get all machine types
 */
export async function getAllMachineTypes(): Promise<MachineType[]> {
  const container = await getContainer(CONTAINER_NAME);
  const querySpec = {
    query: 'SELECT * FROM c ORDER BY c.machineTypeName',
  };

  const { resources } = await container.items.query<MachineType>(querySpec).fetchAll();
  return resources;
}

/**
 * Get machine type by ID
 */
export async function getMachineTypeById(id: string): Promise<MachineType | null> {
  const container = await getContainer(CONTAINER_NAME);
  
  try {
    const { resource } = await container.item(id, id).read<MachineType>();
    return resource || null;
  } catch (error: any) {
    if (error.code === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Check if machine type name exists (case-insensitive)
 * @param name Machine type name to check
 * @param excludeId Optional ID to exclude from check (for updates)
 */
export async function machineTypeNameExists(name: string, excludeId?: string): Promise<boolean> {
  const container = await getContainer(CONTAINER_NAME);
  
  const querySpec = {
    query: excludeId
      ? 'SELECT VALUE COUNT(1) FROM c WHERE LOWER(c.machineTypeName) = LOWER(@name) AND c.id != @excludeId'
      : 'SELECT VALUE COUNT(1) FROM c WHERE LOWER(c.machineTypeName) = LOWER(@name)',
    parameters: excludeId
      ? [{ name: '@name', value: name }, { name: '@excludeId', value: excludeId }]
      : [{ name: '@name', value: name }],
  };

  const { resources } = await container.items.query<number>(querySpec).fetchAll();
  return resources[0] > 0;
}

/**
 * Create a new machine type
 */
export async function createMachineType(
  input: MachineTypeCreateInput,
  userId: string
): Promise<MachineType> {
  const container = await getContainer(CONTAINER_NAME);

  // Check if name already exists (case-insensitive)
  const nameExists = await machineTypeNameExists(input.machineTypeName);
  if (nameExists) {
    throw new Error(`Machine type name "${input.machineTypeName}" already exists`);
  }

  const now = new Date().toISOString();
  const machineType: MachineType = {
    id: uuidv4(),
    ...input,
    createdAt: now,
    updatedAt: now,
    createdBy: userId,
    updatedBy: userId,
  };

  const { resource } = await container.items.create(machineType);
  if (!resource) {
    throw new Error('Failed to create machine type');
  }

  return resource;
}

/**
 * Update an existing machine type
 */
export async function updateMachineType(
  id: string,
  input: MachineTypeUpdateInput,
  userId: string
): Promise<MachineType> {
  const container = await getContainer(CONTAINER_NAME);

  // Get existing machine type
  const existing = await getMachineTypeById(id);
  if (!existing) {
    throw new Error('Machine type not found');
  }

  // Check if name is being changed and if new name already exists
  if (input.machineTypeName && input.machineTypeName.toLowerCase() !== existing.machineTypeName.toLowerCase()) {
    const nameExists = await machineTypeNameExists(input.machineTypeName, id);
    if (nameExists) {
      throw new Error(`Machine type name "${input.machineTypeName}" already exists`);
    }
  }

  const updated: MachineType = {
    ...existing,
    ...input,
    updatedAt: new Date().toISOString(),
    updatedBy: userId,
  };

  const { resource } = await container.item(id, id).replace(updated);
  if (!resource) {
    throw new Error('Failed to update machine type');
  }

  return resource;
}

/**
 * Delete a machine type
 * @throws Error if machine type is referenced by machines
 */
export async function deleteMachineType(id: string): Promise<void> {
  const container = await getContainer(CONTAINER_NAME);

  // Check if any machines reference this type
  const machineCount = await getMachineCountByTypeId(id);
  if (machineCount > 0) {
    throw new Error(`Cannot delete machine type: ${machineCount} machine(s) are using this type`);
  }

  try {
    await container.item(id, id).delete();
  } catch (error: any) {
    if (error.code === 404) {
      throw new Error('Machine type not found');
    }
    throw error;
  }
}

/**
 * Duplicate a machine type (create a copy with new GUID)
 */
export async function duplicateMachineType(
  id: string,
  userId: string
): Promise<MachineType> {
  const existing = await getMachineTypeById(id);
  if (!existing) {
    throw new Error('Machine type not found');
  }

  // Generate a unique name by appending " (Copy)" or " (Copy N)"
  let newName = `${existing.machineTypeName} (Copy)`;
  let copyNumber = 1;
  
  while (await machineTypeNameExists(newName)) {
    copyNumber++;
    newName = `${existing.machineTypeName} (Copy ${copyNumber})`;
  }

  const input: MachineTypeCreateInput = {
    machineTypeId: existing.machineTypeId,
    machineTypeName: newName,
    manufacturer: existing.manufacturer,
    description: existing.description,
    x: existing.x,
    y: existing.y,
    z: existing.z,
    a: existing.a,
    b: existing.b,
    c: existing.c,
  };

  return createMachineType(input, userId);
}

/**
 * Get count of machines using a specific machine type
 */
async function getMachineCountByTypeId(machineTypeId: string): Promise<number> {
  try {
    const machinesContainer = await getContainer('machines');
    const querySpec = {
      query: 'SELECT VALUE COUNT(1) FROM c WHERE c.machineTypeId = @machineTypeId',
      parameters: [{ name: '@machineTypeId', value: machineTypeId }],
    };

    const { resources } = await machinesContainer.items.query<number>(querySpec).fetchAll();
    return resources[0] || 0;
  } catch (error) {
    // If machines container doesn't exist yet, return 0
    return 0;
  }
}

/**
 * Search machine types by name or manufacturer
 */
export async function searchMachineTypes(searchTerm: string): Promise<MachineType[]> {
  const container = await getContainer(CONTAINER_NAME);
  
  const querySpec = {
    query: `
      SELECT * FROM c 
      WHERE CONTAINS(LOWER(c.machineTypeName), LOWER(@searchTerm))
         OR CONTAINS(LOWER(c.manufacturer), LOWER(@searchTerm))
      ORDER BY c.machineTypeName
    `,
    parameters: [{ name: '@searchTerm', value: searchTerm }],
  };

  const { resources } = await container.items.query<MachineType>(querySpec).fetchAll();
  return resources;
}
