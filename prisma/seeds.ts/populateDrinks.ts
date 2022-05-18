import { Drink } from '@prisma/client';
import { client } from '../../src/database';

export async function populateDrinks() {
  const drinks: Omit<Drink, 'id'>[] = [
    {
      name: 'Cachaça',
      price: 3200,
      volume: 1000,
      alcoholic: true,
    },
    {
      name: 'Vodka',
      price: 2400,
      volume: 1000,
      alcoholic: true,
    },
  ];

  await client.drink.createMany({ data: drinks });
}
