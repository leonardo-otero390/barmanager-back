import {
  Cocktail,
  CocktailDisposable,
  CocktailDrink,
  CocktailInput,
  Measurement,
} from '@prisma/client';
import { client } from '../../src/database.js';

export async function upsertCocktailsInput(
  measurements: Measurement[],
  cocktails: Cocktail[]
) {
  const unitId = measurements.find((m) => m.name === 'grama').id;

  const inputs = await client.input.findMany();

  const cocktailInputs: Omit<CocktailInput, 'id'>[] = [];

  inputs.forEach((input) => {
    cocktails.forEach((cocktail) => {
      cocktailInputs.push({
        cocktailId: cocktail.id,
        inputId: input.id,
        quantity: Math.floor(Math.random() * 100),
        measurementId: unitId,
      });
    });
  });

  await client.cocktailInput.createMany({ data: cocktailInputs });
}

export async function upsertCocktailsDisposable(
  measurements: Measurement[],
  cocktails: Cocktail[]
) {
  const unitId = measurements.find((m) => m.name === 'unidade').id;

  const disposables = await client.disposable.findMany();

  const cocktailDisposables: Omit<CocktailDisposable, 'id'>[] = [];

  disposables.forEach((disposable) => {
    cocktails.forEach((cocktail) => {
      cocktailDisposables.push({
        cocktailId: cocktail.id,
        disposableId: disposable.id,
        quantity: Math.floor(Math.random() * 100),
        measurementId: unitId,
      });
    });
  });

  await client.cocktailDisposable.createMany({ data: cocktailDisposables });
}

export async function upsertCocktailsDrink(
  measurements: Measurement[],
  cocktails: Cocktail[]
) {
  const mililiterId = measurements.find((m) => m.name === 'mililitro').id;

  const drinks = await client.drink.findMany();

  const cocktailDrink: Omit<CocktailDrink, 'id'>[] = [
    {
      drinkId: drinks[0].id,
      cocktailId: cocktails[0].id,
      quantity: 50,
      measurementId: mililiterId,
    },
    {
      drinkId: drinks[1].id,
      cocktailId: cocktails[1].id,
      quantity: 50,
      measurementId: mililiterId,
    },
  ];

  await client.cocktailDrink.createMany({ data: cocktailDrink });
}

export async function upsertCocktails() {
  const cocktails: Omit<Cocktail, 'id'>[] = [
    {
      name: 'Caipirinha tradicional',
    },
    {
      name: 'Caipiroska de limão',
    },
  ];

  const result = await client.$transaction(
    cocktails.map((cocktail) =>
      client.cocktail.upsert({
        where: { name: cocktail.name },
        update: {},
        create: cocktail,
      })
    )
  );

  const measurements = await client.measurement.findMany();

  await upsertCocktailsDisposable(measurements, result);
  await upsertCocktailsDrink(measurements, result);
  await upsertCocktailsInput(measurements, result);
}
