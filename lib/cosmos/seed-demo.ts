// Load environment variables FIRST before any imports
import { config } from 'dotenv';
config({ path: '.env.local' });

// Now import after env is loaded
import { createClient } from './models/client';
import { createMachine } from './models/machine';

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Create clients
    const clients = [
      {
        companyName: 'Bombardier Aéronautique',
        address: '400 Chemin de la Côte-Vertu, Dorval',
        province: 'QC' as const,
        postalCode: 'H4S 1Y9',
      },
      {
        companyName: 'CAE Inc.',
        address: '8585 Chemin de la Côte-de-Liesse, Saint-Laurent',
        province: 'QC' as const,
        postalCode: 'H4T 1G6',
      },
      {
        companyName: 'Pratt & Whitney Canada',
        address: '1000 Boulevard Marie-Victorin, Longueuil',
        province: 'QC' as const,
        postalCode: 'J4G 1A1',
      },
      {
        companyName: 'Héroux-Devtek Inc.',
        address: '1111 Rue St-Charles Ouest, Longueuil',
        province: 'QC' as const,
        postalCode: 'J4K 5G4',
      },
      {
        companyName: 'Linamar Corporation',
        address: '287 Speedvale Avenue West, Guelph',
        province: 'ON' as const,
        postalCode: 'N1H 1C5',
      },
    ];

    console.log('Creating clients...');
    const createdClients = [];
    for (const clientData of clients) {
      const client = await createClient(clientData);
      createdClients.push(client);
      console.log(`✓ Created client: ${client.companyName}`);
    }

    // Create machines
    const machineTypes = [
      'CNC Lathe',
      'CNC Mill',
      'Vertical Machining Center',
      'Horizontal Machining Center',
      '5-Axis Mill',
      'Wire EDM',
      'Sinker EDM',
      'Grinding Machine',
      'Turning Center',
      'Multi-Tasking Machine',
    ];

    console.log('\nCreating machines...');
    let machineCount = 0;
    
    for (const client of createdClients) {
      // Create 3-7 machines per client
      const numMachines = Math.floor(Math.random() * 5) + 3;
      
      for (let i = 0; i < numMachines; i++) {
        const numeroOL = `OL-${String(machineCount + 1001).padStart(5, '0')}`;
        const type = machineTypes[Math.floor(Math.random() * machineTypes.length)];
        
        const machine = await createMachine({
          numeroOL,
          type,
          clientId: client.id,
        }, 'system');
        
        machineCount++;
        console.log(`✓ Created machine: ${machine.numeroOL} (${machine.type}) for ${client.companyName}`);
      }
    }

    console.log(`\n✅ Seeding completed successfully!`);
    console.log(`   - ${createdClients.length} clients created`);
    console.log(`   - ${machineCount} machines created`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log('\n🎉 Database is ready!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Seeding failed:', error);
    process.exit(1);
  });
