import { httpErrors } from '../errors/HttpError.js';
import { NeededCocktail } from '../interface/cocktailInterfaces.js';
import * as cocktailRepository from '../repositories/cocktailRepository.js';
import * as measurementService from '../services/measurementService.js';
import * as budgetRepository from '../repositories/budgetRepository.js';

export async function findMany() {
  return cocktailRepository.findMany();
}

export async function findRecipes(ids: number[]) {
  const result = await cocktailRepository.findRecipes(ids);
  const missing = ids.filter((id) => !result.find((r) => r.id === id));
  if (missing.length) {
    throw httpErrors.notFound(
      `Não foi encontrado o cocktail de id: ${missing.join(', ')}`
    );
  }
  return result;
}

export async function calculatePrices(ids: number[], quantity: number) {
  const cocktails = await findRecipes(ids);

  return cocktails.map((cocktail) => {
    let price = 0;
    cocktail.cocktailInputs.forEach((input) => {
      let totalQuantity = input.quantity * quantity;
      totalQuantity = measurementService.convertUnits(
        totalQuantity,
        input.measurement.name,
        input.inputs.measurement.name
      );
      price += Math.ceil(totalQuantity * input.inputs.price);
    });

    return {
      id: cocktail.id,
      name: cocktail.name,
      quantity,
      price,
    };
  });
}

export async function insertToBudget(
  budgetId: number,
  cocktails: NeededCocktail[]
) {
  await budgetRepository.createCocktails(budgetId, cocktails);
}
