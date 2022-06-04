import { Disposable } from '@prisma/client';
import { client } from '../../src/database.js';

export async function upsertDisposables() {
  const measurements = await client.measurement.findMany();
  const hundredId = measurements.find((m) => m.name === 'hundred').id;
  const disposables: Omit<Disposable, 'id'>[] = [
    {
      name: 'Straw',
      price: 2000,
      measurementId: hundredId,
    },
    {
      name: 'Napkin',
      price: 500,
      measurementId: hundredId,
    },
  ];

  await client.$transaction(
    disposables.map((disposable) =>
      client.disposable.upsert({
        where: { name: disposable.name },
        update: {},
        create: disposable,
      })
    )
  );
}
