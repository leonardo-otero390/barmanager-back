import { client } from '../../src/database.js';

export async function upsertEventCategories() {
  const categories: string[] = [
    'Birthday',
    'Wedding',
    'Corporative',
    'Debutante',
    'Party',
    'Graduation',
    'Other',
  ];
  await client.$transaction(
    categories.map((category) =>
      client.eventCategory.upsert({
        where: { name: category },
        update: {},
        create: { name: category },
      })
    )
  );
}
