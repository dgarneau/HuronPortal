/**
 * Seed script to populate machine types data
 * Run with: npm run db:seed:machine-types
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { v4 as uuidv4 } from 'uuid';
import { getContainer } from './client';

interface MachineTypeSeedData {
  machineTypeId: number;
  machineTypeName: string;
  manufacturer: string;
  x: number;
  y: number;
  z: number;
  a: number;
  b: number;
  c: number;
}

const machineTypesData: MachineTypeSeedData[] = [
  { machineTypeId: 180, machineTypeName: 'EX', manufacturer: 'Huron', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 200, machineTypeName: 'KX10', manufacturer: 'Huron', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 210, machineTypeName: 'K2X10', manufacturer: 'Huron', x: 1000, y: 800, z: 500, a: 0, b: 0, c: 0 },
  { machineTypeId: 215, machineTypeName: 'K2X10F', manufacturer: 'Huron', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 220, machineTypeName: 'UMill 630', manufacturer: 'Huron', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 225, machineTypeName: 'K2X15', manufacturer: 'Huron', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 230, machineTypeName: 'KX20', manufacturer: 'Huron', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 240, machineTypeName: 'K2X20', manufacturer: 'Huron', x: 1200, y: 1000, z: 500, a: 0, b: 0, c: 0 },
  { machineTypeId: 245, machineTypeName: 'K2X20F', manufacturer: 'Huron', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 250, machineTypeName: 'KX30', manufacturer: 'Huron', x: 1800, y: 1000, z: 700, a: 0, b: 0, c: 0 },
  { machineTypeId: 260, machineTypeName: 'KX8', manufacturer: 'Huron', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 260, machineTypeName: 'K2X8', manufacturer: 'Huron', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 270, machineTypeName: 'K3X8F', manufacturer: 'Huron', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 280, machineTypeName: 'KX100', manufacturer: 'Huron', x: 2300, y: 2300, z: 1000, a: 0, b: 220, c: 0 },
  { machineTypeId: 282, machineTypeName: 'KX200', manufacturer: 'Huron', x: 3300, y: 2300, z: 1000, a: 0, b: 220, c: 0 },
  { machineTypeId: 285, machineTypeName: 'KX300', manufacturer: 'Huron', x: 5000, y: 3100, z: 1500, a: 0, b: 220, c: 0 },
  { machineTypeId: 290, machineTypeName: 'KX50', manufacturer: 'Huron', x: 2000, y: 1700, z: 900, a: 0, b: 220, c: 0 },
  { machineTypeId: 290, machineTypeName: 'KX50L', manufacturer: 'Huron', x: 3000, y: 1700, z: 900, a: 0, b: 220, c: 0 },
  { machineTypeId: 290, machineTypeName: 'KX50LL', manufacturer: 'Huron', x: 3500, y: 1700, z: 900, a: 0, b: 220, c: 0 },
  { machineTypeId: 370, machineTypeName: 'MX4', manufacturer: 'Huron', x: 750, y: 700, z: 500, a: 0, b: 0, c: 0 },
  { machineTypeId: 390, machineTypeName: 'MX8', manufacturer: 'Huron', x: 1160, y: 1000, z: 900, a: 0, b: 0, c: 0 },
  { machineTypeId: 390, machineTypeName: 'MX10', manufacturer: 'Huron', x: 1200, y: 1200, z: 1000, a: 0, b: 0, c: 0 },
  { machineTypeId: 390, machineTypeName: 'MX12', manufacturer: 'Huron', x: 1200, y: 1600, z: 1000, a: 0, b: 0, c: 0 },
  { machineTypeId: 395, machineTypeName: 'MX20', manufacturer: 'Huron', x: 3000, y: 3100, z: 1600, a: 0, b: 0, c: 0 },
  { machineTypeId: 400, machineTypeName: 'KX5', manufacturer: 'Huron', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 410, machineTypeName: 'CX10', manufacturer: 'Huron', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 420, machineTypeName: 'CX12', manufacturer: 'Huron', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 430, machineTypeName: 'CX30', manufacturer: 'Huron', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 440, machineTypeName: 'Kmill10', manufacturer: 'Leaderway - Leadwell', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 450, machineTypeName: 'CX5', manufacturer: 'Huron', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 455, machineTypeName: 'CX7', manufacturer: 'Huron', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 460, machineTypeName: 'K2X8', manufacturer: 'Leaderway - Jyoti', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 470, machineTypeName: 'KX40', manufacturer: 'LGB', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 475, machineTypeName: 'KX45SP', manufacturer: 'LGB', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 480, machineTypeName: 'EX', manufacturer: 'Jyoti', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 480, machineTypeName: 'KXG45-14', manufacturer: 'Huron', x: 1400, y: 4500, z: 800, a: 0, b: 220, c: 0 },
  { machineTypeId: 480, machineTypeName: 'KXG45-23', manufacturer: 'Huron', x: 2300, y: 4500, z: 800, a: 0, b: 220, c: 0 },
  { machineTypeId: 480, machineTypeName: 'KXG60-23', manufacturer: 'Huron', x: 6000, y: 2300, z: 800, a: 0, b: 220, c: 0 },
  { machineTypeId: 600, machineTypeName: 'KXG90-23', manufacturer: 'Huron', x: 9000, y: 2300, z: 800, a: 0, b: 220, c: 0 },
  { machineTypeId: 701, machineTypeName: 'VX4', manufacturer: 'Jyoti', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 710, machineTypeName: 'VX6', manufacturer: 'Jyoti', x: 600, y: 400, z: 460, a: 0, b: 0, c: 0 },
  { machineTypeId: 720, machineTypeName: 'VX8', manufacturer: 'Jyoti', x: 820, y: 510, z: 510, a: 0, b: 0, c: 0 },
  { machineTypeId: 730, machineTypeName: 'VX10', manufacturer: 'Jyoti', x: 1020, y: 510, z: 510, a: 0, b: 0, c: 0 },
  { machineTypeId: 740, machineTypeName: 'VX12', manufacturer: 'Jyoti', x: 1220, y: 600, z: 610, a: 0, b: 0, c: 0 },
  { machineTypeId: 750, machineTypeName: 'K2X10', manufacturer: 'Jyoti', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 755, machineTypeName: 'VX15', manufacturer: 'Jyoti', x: 1510, y: 810, z: 810, a: 0, b: 0, c: 0 },
  { machineTypeId: 760, machineTypeName: 'VX18', manufacturer: 'Jyoti', x: 1810, y: 810, z: 810, a: 0, b: 0, c: 0 },
  { machineTypeId: 770, machineTypeName: 'K3X8F', manufacturer: 'Jyoti', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 775, machineTypeName: 'MU TECH', manufacturer: 'Jyoti', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 775, machineTypeName: 'NX30', manufacturer: 'Jyoti', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 775, machineTypeName: 'NX40', manufacturer: 'Jyoti', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 775, machineTypeName: 'NX50', manufacturer: 'Jyoti', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 790, machineTypeName: 'NX60', manufacturer: 'Jyoti', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 900, machineTypeName: 'SX4', manufacturer: 'Jyoti', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 900, machineTypeName: 'SX6', manufacturer: 'Jyoti', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 900, machineTypeName: 'SXG', manufacturer: 'Jyoti', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 901, machineTypeName: 'HMC450', manufacturer: 'Jyoti', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 901, machineTypeName: 'HMC560', manufacturer: 'Jyoti', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 903, machineTypeName: 'AM430', manufacturer: 'Jyoti', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 904, machineTypeName: 'ATM160', manufacturer: 'Jyoti', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 910, machineTypeName: 'TMC250', manufacturer: 'Jyoti', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 910, machineTypeName: 'TMC350', manufacturer: 'Jyoti', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 910, machineTypeName: 'DX160', manufacturer: 'Jyoti', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 910, machineTypeName: 'DX200', manufacturer: 'Jyoti', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 910, machineTypeName: 'DX250', manufacturer: 'Jyoti', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
  { machineTypeId: 910, machineTypeName: 'I-SECT', manufacturer: 'Jyoti', x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 },
];

async function seedMachineTypes() {
  try {
    console.log('Starting machine types seed...');
    
    const container = await getContainer('machineTypes');
    const timestamp = new Date().toISOString();
    const seedUser = 'system-seed';

    let created = 0;
    let skipped = 0;

    for (const data of machineTypesData) {
      try {
        // Check if machine type with same name and manufacturer already exists
        const query = {
          query: 'SELECT * FROM c WHERE c.machineTypeName = @name AND c.manufacturer = @manufacturer',
          parameters: [
            { name: '@name', value: data.machineTypeName },
            { name: '@manufacturer', value: data.manufacturer }
          ]
        };

        const { resources: existing } = await container.items.query(query).fetchAll();

        if (existing.length > 0) {
          console.log(`Skipped: ${data.machineTypeName} (${data.manufacturer}) - already exists`);
          skipped++;
          continue;
        }

        // Create new machine type
        const machineType = {
          id: uuidv4(),
          machineTypeId: data.machineTypeId,
          machineTypeName: data.machineTypeName,
          manufacturer: data.manufacturer,
          description: '',
          x: data.x,
          y: data.y,
          z: data.z,
          a: data.a,
          b: data.b,
          c: data.c,
          createdAt: timestamp,
          createdBy: seedUser,
          updatedAt: timestamp,
          updatedBy: seedUser,
        };

        await container.items.create(machineType);
        console.log(`Created: ${data.machineTypeName} (${data.manufacturer})`);
        created++;
      } catch (error) {
        console.error(`Error creating ${data.machineTypeName}:`, error);
      }
    }

    console.log('\n✅ Machine types seed completed!');
    console.log(`   Created: ${created}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Total: ${machineTypesData.length}`);
  } catch (error) {
    console.error('❌ Error seeding machine types:', error);
    process.exit(1);
  }
}

seedMachineTypes();
