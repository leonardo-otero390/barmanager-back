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
        inputId: inputs['Açucar'],
        quantity: 30,
        measurementId: measurements.grama,
      },
      {
        cocktailId: cocktail.id,
        inputId: inputs['Limão Taiti'],
        quantity: 100,
        measurementId: measurements.grama,
      },
      {
        cocktailId: cocktail.id,
        inputId: inputs.Gelo,
        quantity: 300,
        measurementId: measurements.grama,
      },
    ];
    recipesInputs.push(...newItems);
  });

  recipesInputs.push(
    {
      cocktailId: cocktails.find((c) => c.name === 'Caipirinha tradicional').id,
      inputId: inputs['Cachaça'],
      quantity: 50,
      measurementId: measurements.mililitro,
    },
    {
      cocktailId: cocktails.find((c) => c.name === 'Caipiroska').id,
      inputId: inputs.Vodka,
      quantity: 50,
      measurementId: measurements.mililitro,
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
  const cocktails: string[] = ['Caipirinha tradicional', 'Caipiroska'];

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
  await upsertCocktailsInput(measurementsHash, result);
}
