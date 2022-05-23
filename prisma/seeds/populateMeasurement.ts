import { Measurement } from '@prisma/client';
import { client } from '../../src/database.js';

export async function upsertMeasurement() {
  const units: Omit<Measurement, 'id'>[] = [
    {
      name: 'kilograma',
      category: 'mass',
    },
    {
      name: 'grama',
      category: 'mass',
    },
    { name: 'litro', category: 'volume' },
    {
      name: 'mililitro',
      category: 'volume',
    },
    {
      name: 'milhar',
      category: 'unit',
    },
    {
      name: 'unidade',
      category: 'unit',
    },
  ];
  await client.$transaction(
    units.map(({ name, category }) =>
      client.measurement.upsert({
        where: { name },
        update: {},
        create: { name, category },
      })
    )
  );
}
