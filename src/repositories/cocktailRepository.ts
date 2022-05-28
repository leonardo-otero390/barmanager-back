import { client } from '../database.js';

export async function findMany() {
  return client.cocktail.findMany();
}

export async function findRecipes(ids: number[]) {
  const result = await client.cocktail.findMany({
    where: { id: { in: ids } },
    include: {
      cocktailInputs: {
        select: {
          quantity: true,
          measurement: { select: { name: true } },
          inputs: {
            select: {
              name: true,
              price: true,
              measurement: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  return result;
}
