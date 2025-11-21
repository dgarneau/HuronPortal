import { CosmosClient, Database, Container } from '@azure/cosmos';

let cosmosClient: CosmosClient | null = null;

function getCosmosClient(): CosmosClient {
  if (!cosmosClient) {
    const endpoint = process.env.COSMOS_ENDPOINT;
    const key = process.env.COSMOS_KEY;
    
    if (!endpoint || !key) {
      throw new Error('COSMOS_ENDPOINT and COSMOS_KEY must be defined in environment variables');
    }
    
    cosmosClient = new CosmosClient({ endpoint, key });
  }
  return cosmosClient;
}

const databaseId = process.env.COSMOS_DATABASE || 'huronportal-db';

// Database reference
let _database: Database | null = null;

export async function getDatabase(): Promise<Database> {
  const client = getCosmosClient();
  if (!_database) {
    const { database } = await client.databases.createIfNotExists({
      id: databaseId,
    });
    _database = database;
  }
  return _database!;
}

// Container references with lazy initialization
const containers: Record<string, Container | null> = {
  users: null,
  machines: null,
  clients: null,
};

export async function getContainer(name: 'users' | 'machines' | 'clients'): Promise<Container> {
  if (!containers[name]) {
    const database = await getDatabase();
    
    const partitionKeys: Record<string, string> = {
      users: '/username',
      machines: '/id',
      clients: '/id',
    };
    
    const { container } = await database.containers.createIfNotExists({
      id: name,
      partitionKey: { paths: [partitionKeys[name]] },
    });
    
    containers[name] = container;
  }
  
  return containers[name]!;
}

// Helper function to handle Cosmos DB errors
export function handleCosmosError(error: any): never {
  if (error.code === 409) {
    throw new Error('DUPLICATE_ENTRY');
  }
  if (error.code === 404) {
    throw new Error('NOT_FOUND');
  }
  if (error.code === 412) {
    throw new Error('CONCURRENT_MODIFICATION');
  }
  throw error;
}
