import main from '../../prisma/seeds/index.js';
import { client } from '../../src/database.js';

export async function clearCustomers() {
  await client.$executeRaw`TRUNCATE TABLE customers CASCADE;`;
}

export async function seed() {
  await main();
}
