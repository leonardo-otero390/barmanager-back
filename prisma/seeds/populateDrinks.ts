import { Drink } from '@prisma/client';
import { client } from '../../src/database.js';

export async function upsertDrinks() {
  const drinks: Omit<Drink, 'id'>[] = [
    {
      name: 'Cachaça',
      price: 3200,
      alcoholic: true,
    },
    {
      name: 'Vodka',
      price: 2400,
      alcoholic: true,
    },
  ];

  await client.$transaction(
    drinks.map((drink) =>
      client.drink.upsert({
        where: { name: drink.name },
        update: {},
        create: drink,
      })
    )
  );
}
