import { Measurement } from '@prisma/client';
import { client } from '../../src/database.js';

export async function upsertMeasurement() {
  const units: Omit<Measurement, 'id'>[] = [
    {
      name: 'kilogram',
      category: 'mass',
    },
    {
      name: 'gram',
      category: 'mass',
    },
    { name: 'liter', category: 'volume' },
    {
      name: 'mililiter',
      category: 'volume',
    },
    {
      name: 'thousand',
      category: 'unit',
    },
    { name: 'hundred', category: 'unit' },
    {
      name: 'unity',
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
