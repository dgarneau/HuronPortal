import { v4 as uuidv4 } from 'uuid';
import { getContainer } from '../client';
import type { Client, ClientCreateInput, ClientUpdateInput } from '@/types';

const CONTAINER_NAME = 'clients';

export async function createClient(data: ClientCreateInput): Promise<Client> {
  const container = await getContainer(CONTAINER_NAME);
  
  const client: Client = {
    id: uuidv4(),
    companyName: data.companyName,
    address: data.address,
    province: data.province,
    postalCode: data.postalCode,
    machineCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const { resource } = await container.items.create(client);
  return resource as Client;
}

export async function getClientById(id: string): Promise<Client | null> {
  const container = await getContainer(CONTAINER_NAME);
  
  try {
    const { resource } = await container.item(id, id).read<Client>();
    return resource || null;
  } catch (error: any) {
    if (error.code === 404) {
      return null;
    }
    throw error;
  }
}

export async function updateClient(
  id: string,
  data: ClientUpdateInput
): Promise<Client> {
  const container = await getContainer(CONTAINER_NAME);
  
  const { resource: existing } = await container.item(id, id).read<Client>();
  if (!existing) {
    throw new Error('Client not found');
  }

  const updated: Client = {
    ...existing,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  const { resource } = await container
    .item(id, id)
    .replace(updated);
  
  return resource as Client;
}

export async function deleteClient(id: string): Promise<void> {
  const container = await getContainer(CONTAINER_NAME);
  await container.item(id, id).delete();
}

export async function listClients(
  limit: number = 50,
  continuationToken?: string
): Promise<{ clients: Client[]; continuationToken?: string }> {
  const container = await getContainer(CONTAINER_NAME);
  
  const query = 'SELECT * FROM c ORDER BY c.companyName ASC';
  
  const queryIterator = container.items.query<Client>(query, {
    maxItemCount: limit,
    continuationToken,
  });

  const { resources, continuationToken: nextToken } = await queryIterator.fetchNext();
  
  return {
    clients: resources,
    continuationToken: nextToken,
  };
}

export async function searchClients(
  searchTerm: string,
  limit: number = 50
): Promise<Client[]> {
  const container = await getContainer(CONTAINER_NAME);
  
  const query = {
    query: 'SELECT * FROM c WHERE CONTAINS(LOWER(c.companyName), @searchTerm) ORDER BY c.companyName ASC',
    parameters: [
      { name: '@searchTerm', value: searchTerm.toLowerCase() },
    ],
  };

  const { resources } = await container.items
    .query<Client>(query, { maxItemCount: limit })
    .fetchAll();
  
  return resources;
}
