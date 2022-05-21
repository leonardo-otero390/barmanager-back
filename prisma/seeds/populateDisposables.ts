import { Disposable } from '@prisma/client';
import { client } from '../../src/database.js';

export async function upsertDisposables() {
  const measurements = await client.measurement.findMany();
  const milharId = measurements.find((m) => m.name === 'milhar').id;
  const disposables: Omit<Disposable, 'id'>[] = [
    {
      name: 'Canudo',
      price: 1000,
      measurementId: milharId,
    },
    {
      name: 'Guardanapo',
      price: 500,
      measurementId: milharId,
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
