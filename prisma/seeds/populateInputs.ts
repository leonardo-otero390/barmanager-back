import { Input, InputCategory } from '@prisma/client';
import { client } from '../../src/database.js';

async function upsertInputCategory() {
  const categories: Omit<InputCategory, 'id'>[] = [
    {
      name: 'Bebidas',
    },
    {
      name: 'Frutas',
    },
    { name: 'Insumos' },
  ];

  return client.$transaction(
    categories.map((category) =>
      client.inputCategory.upsert({
        where: { name: category.name },
        update: {},
        create: category,
      })
    )
  );
}

export async function upsertInputs() {
  const categories = await upsertInputCategory();
  const drinkCategory = categories.find((c) => c.name === 'Bebidas');
  const fruitCategory = categories.find((c) => c.name === 'Frutas');
  const ingredientCategory = categories.find((c) => c.name === 'Insumos');

  const measurements = await client.measurement.findMany();
  const literId = measurements.find((m) => m.name === 'litro').id;
  const kilogramId = measurements.find((m) => m.name === 'kilograma').id;
  const inputs: Omit<Input, 'id'>[] = [
    {
      name: 'Cachaça',
      price: 3200,
      measurementId: literId,
      categoryId: drinkCategory.id,
    },
    {
      name: 'Vodka',
      price: 2400,
      measurementId: literId,
      categoryId: drinkCategory.id,
    },
    {
      name: 'Limão Taiti',
      price: 250,
      measurementId: kilogramId,
      categoryId: fruitCategory.id,
    },
    {
      name: 'Açucar',
      price: 623,
      measurementId: kilogramId,
      categoryId: ingredientCategory.id,
    },
    {
      name: 'Gelo',
      price: 100,
      measurementId: kilogramId,
      categoryId: ingredientCategory.id,
    },
  ];

  return client.$transaction(
    inputs.map((input) =>
      client.input.upsert({
        where: { name: input.name },
        update: {},
        create: input,
      })
    )
  );
}
