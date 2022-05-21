import { Input } from '@prisma/client';
import { client } from '../../src/database.js';

export async function upsertInputs() {
  const measurements = await client.measurement.findMany();
  const kilogramId = measurements.find((m) => m.name === 'kilograma').id;
  const inputs: Omit<Input, 'id'>[] = [
    {
      name: 'Limão Taiti',
      price: 250,
      measurementId: kilogramId,
    },
    {
      name: 'Açucar',
      price: 623,
      measurementId: kilogramId,
    },
    {
      name: 'Gelo',
      price: 100,
      measurementId: kilogramId,
    },
  ];

  await client.$transaction(
    inputs.map((drink) =>
      client.input.upsert({
        where: { name: drink.name },
        update: {},
        create: drink,
      })
    )
  );
}
