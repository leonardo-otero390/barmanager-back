import * as cocktailRepository from '../repositories/cocktailRepository.js';
import * as measurementService from '../services/measurementService.js';

export async function findMany() {
  return cocktailRepository.findMany();
}

export async function findRecipes(ids: number[]) {
  return cocktailRepository.findRecipe(ids);
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
      price += totalQuantity * input.inputs.price;
    });

    return {
      name: cocktail.name,
      quantity,
      price,
    };
  });
}
