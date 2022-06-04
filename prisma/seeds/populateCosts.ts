import { Cost } from '@prisma/client';
import { client } from '../../src/database.js';

export async function upsertCosts() {
  const costs: Omit<Cost, 'id'>[] = [
    { name: 'Bartender leader', price: 35000, category: 'staff' },
    {
      name: 'Bartender',
      price: 14000,
      category: 'staff',
    },
    { name: 'Installation', price: 6000, category: 'staff' },
    { name: 'Transport', price: 5000, category: 'variable' },
    { name: 'Laundry', price: 1000, category: 'operationals' },
    {
      name: 'Equipment depreciation',
      price: 1000,
      category: 'operationals',
    },
    { name: 'Furniture', price: 16000, category: 'operationals' },
  ];
  await client.$transaction(
    costs.map((cost) =>
      client.cost.upsert({
        where: { name: cost.name },
        update: {},
        create: cost,
      })
    )
  );
}
