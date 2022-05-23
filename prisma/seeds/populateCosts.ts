import { Cost } from '@prisma/client';
import { client } from '../../src/database.js';

export async function upsertCosts() {
  const costs: Omit<Cost, 'id'>[] = [
    { name: 'Capitão', price: 35000, category: 'staff' },
    {
      name: 'Bartender',
      price: 14000,
      category: 'staff',
    },
    { name: 'Montagem', price: 6000, category: 'staff' },
    { name: 'Transporte', price: 5000, category: 'variable' },
    { name: 'Lavanderia', price: 1000, category: 'operationals' },
    {
      name: 'Depreciação de equipamento',
      price: 1000,
      category: 'operationals',
    },
    { name: 'Mobiliário', price: 16000, category: 'operationals' },
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
