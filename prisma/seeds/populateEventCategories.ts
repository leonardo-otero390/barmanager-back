import { client } from '../../src/database.js';

export async function upsertEventCategories() {
  const categories: string[] = [
    'Aniversário',
    'Casamento',
    'Corporativo',
    'Debutante',
    'Festa',
    'Formatura',
    'Outros',
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
