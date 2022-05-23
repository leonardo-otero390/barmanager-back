import { Disposable } from '@prisma/client';
import { client } from '../../src/database.js';

export async function upsertDisposables() {
  const measurements = await client.measurement.findMany();
  const centenaId = measurements.find((m) => m.name === 'centena').id;
  const disposables: Omit<Disposable, 'id'>[] = [
    {
      name: 'centena',
      price: 2000,
      measurementId: centenaId,
    },
    {
      name: 'Guardanapo',
      price: 500,
      measurementId: centenaId,
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
