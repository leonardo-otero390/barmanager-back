import { Input, InputCategory } from '@prisma/client';
import { client } from '../../src/database.js';

async function upsertInputCategory() {
  const categories: Omit<InputCategory, 'id'>[] = [
    {
      name: 'Drinks',
    },
    {
      name: 'Fruits',
    },
    { name: 'Inputs' },
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
  const drinkCategory = categories.find((c) => c.name === 'Drinks');
  const fruitCategory = categories.find((c) => c.name === 'Fruits');
  const ingredientCategory = categories.find((c) => c.name === 'Inputs');

  const measurements = await client.measurement.findMany();
  const literId = measurements.find((m) => m.name === 'liter').id;
  const kilogramId = measurements.find((m) => m.name === 'kilogram').id;
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
      name: 'Lime',
      price: 250,
      measurementId: kilogramId,
      categoryId: fruitCategory.id,
    },
    {
      name: 'Sugar',
      price: 623,
      measurementId: kilogramId,
      categoryId: ingredientCategory.id,
    },
    {
      name: 'Ice',
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
