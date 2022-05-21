import { Input } from '@prisma/client';
import { client } from '../../src/database';

export async function populateDrinks() {
  const cachaca: Omit<Input, 'id'> = {
    name: 'Limão-taiti',
    price: 1,
    measurement: 'g',
  };

  const vodka: Omit<Input, 'id'> = {
    name: 'Vodka',
    price: 2400,
    volume: 1000,
    alcoholic: true,
  };

  await client.drink.createMany({ data: [cachaca, vodka] });
}
