import { v4 as uuidv4 } from 'uuid';
import { getContainer } from '../client';
import type { Machine, MachineCreateInput, MachineUpdateInput } from '@/types';
import { getClientById, updateClient } from './client';

const CONTAINER_NAME = 'machines';

export async function createMachine(data: MachineCreateInput, createdBy?: string): Promise<Machine> {
  const container = await getContainer(CONTAINER_NAME);
  
  // Get client to denormalize company name
  const client = await getClientById(data.clientId);
  if (!client) {
    throw new Error('Client not found');
  }

  const machine: Machine = {
    id: uuidv4(),
    numeroOL: data.numeroOL,
    type: data.type,
    clientId: data.clientId,
    clientName: client.companyName,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy,
  };

  const { resource } = await container.items.create(machine);
  
  // Increment client machine count
  await updateClient(data.clientId, {});
  
  return resource as Machine;
}

export async function getMachineById(id: string): Promise<Machine | null> {
  const container = await getContainer(CONTAINER_NAME);
  
  try {
    const { resource } = await container.item(id, id).read<Machine>();
    return resource || null;
  } catch (error: any) {
    if (error.code === 404) {
      return null;
    }
    throw error;
  }
}

export async function getMachineByNumeroOL(numeroOL: string): Promise<Machine | null> {
  const container = await getContainer(CONTAINER_NAME);
  
  const query = {
    query: 'SELECT * FROM c WHERE c.numeroOL = @numeroOL',
    parameters: [
      { name: '@numeroOL', value: numeroOL },
    ],
  };

  const { resources } = await container.items.query<Machine>(query).fetchAll();
  
  return resources.length > 0 ? resources[0] : null;
}

export async function updateMachine(
  id: string,
  data: MachineUpdateInput
): Promise<Machine> {
  const container = await getContainer(CONTAINER_NAME);
  
  const { resource: existing } = await container.item(id, id).read<Machine>();
  if (!existing) {
    throw new Error('Machine not found');
  }

  // If clientId changed, update denormalized clientName
  let clientName = existing.clientName;
  if (data.clientId && data.clientId !== existing.clientId) {
    const client = await getClientById(data.clientId);
    if (!client) {
      throw new Error('Client not found');
    }
    clientName = client.companyName;
  }

  const updated: Machine = {
    ...existing,
    ...data,
    clientName,
    updatedAt: new Date().toISOString(),
  };

  const { resource } = await container
    .item(id, id)
    .replace(updated);
  
  return resource as Machine;
}

export async function deleteMachine(id: string): Promise<void> {
  const container = await getContainer(CONTAINER_NAME);
  await container.item(id, id).delete();
}

export async function listMachines(
  limit: number = 50,
  continuationToken?: string,
  filters?: {
    clientId?: string;
    numeroOL?: string;
  }
): Promise<{ machines: Machine[]; continuationToken?: string }> {
  const container = await getContainer(CONTAINER_NAME);
  
  let query = 'SELECT * FROM c';
  const parameters: Array<{ name: string; value: string }> = [];
  
  const conditions: string[] = [];
  
  if (filters?.clientId) {
    conditions.push('c.clientId = @clientId');
    parameters.push({ name: '@clientId', value: filters.clientId });
  }
  
  if (filters?.numeroOL) {
    conditions.push('CONTAINS(c.numeroOL, @numeroOL)');
    parameters.push({ name: '@numeroOL', value: filters.numeroOL });
  }
  
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  
  query += ' ORDER BY c.numeroOL ASC';
  
  const queryIterator = container.items.query<Machine>(
    { query, parameters },
    {
      maxItemCount: limit,
      continuationToken,
    }
  );

  const { resources, continuationToken: nextToken } = await queryIterator.fetchNext();
  
  return {
    machines: resources,
    continuationToken: nextToken,
  };
}

export async function getMachinesByClientId(clientId: string): Promise<Machine[]> {
  const container = await getContainer(CONTAINER_NAME);
  
  const query = {
    query: 'SELECT * FROM c WHERE c.clientId = @clientId ORDER BY c.numeroOL ASC',
    parameters: [
      { name: '@clientId', value: clientId },
    ],
  };

  const { resources } = await container.items.query<Machine>(query).fetchAll();
  
  return resources;
}

export async function countMachinesByClientId(clientId: string): Promise<number> {
  const container = await getContainer(CONTAINER_NAME);
  
  const query = {
    query: 'SELECT VALUE COUNT(1) FROM c WHERE c.clientId = @clientId',
    parameters: [
      { name: '@clientId', value: clientId },
    ],
  };

  const { resources } = await container.items.query<number>(query).fetchAll();
  
  return resources[0] || 0;
}
