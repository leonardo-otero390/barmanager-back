import { Cocktail, CocktailInput } from '@prisma/client';
import { client } from '../../src/database.js';
import { upsertInputs } from './populateInputs.js';

export async function buildRecipes(
  cocktails: Cocktail[],
  inputs: any,
  measurements: any
) {
  const recipesInputs: Omit<CocktailInput, 'id'>[] = [];

  cocktails.forEach((cocktail) => {
    const newItems: Omit<CocktailInput, 'id'>[] = [
      {
        cocktailId: cocktail.id,
        inputId: inputs.Sugar,
        quantity: 30,
        measurementId: measurements.gram,
      },
      {
        cocktailId: cocktail.id,
        inputId: inputs.Lime,
        quantity: 100,
        measurementId: measurements.gram,
      },
      {
        cocktailId: cocktail.id,
        inputId: inputs.Ice,
        quantity: 300,
        measurementId: measurements.gram,
      },
    ];
    recipesInputs.push(...newItems);
  });

  recipesInputs.push(
    {
      cocktailId: cocktails.find((c) => c.name === 'Caipirinha').id,
      inputId: inputs['Cachaça'],
      quantity: 50,
      measurementId: measurements.mililiter,
    },
    {
      cocktailId: cocktails.find((c) => c.name === 'Caipiroska').id,
      inputId: inputs.Vodka,
      quantity: 50,
      measurementId: measurements.mililiter,
    }
  );
  await client.cocktailInput.createMany({ data: recipesInputs });
}

export async function upsertCocktailsInput(
  measurements: any,
  cocktails: Cocktail[]
) {
  const inputs = await upsertInputs();
  const inputHash: any = {};
  inputs.forEach((i) => {
    inputHash[i.name] = i.id;
  });

  await buildRecipes(cocktails, inputHash, measurements);
}

export async function upsertCocktails() {
  const cocktails: string[] = ['Caipirinha', 'Caipiroska'];

  const result = await client.$transaction(
    cocktails.map((cocktail) =>
      client.cocktail.upsert({
        where: { name: cocktail },
        update: {},
        create: { name: cocktail },
      })
    )
  );

  const measurements = await client.measurement.findMany();
  const measurementsHash: any = {};
  measurements.forEach((m) => {
    measurementsHash[m.name] = m.id;
  });
  const recipes = await client.cocktailInput.findMany();
  if (!recipes.length) {
    await upsertCocktailsInput(measurementsHash, result);
  }
}
