import * as cocktailService from './cocktailService.js';

export async function create(guests: number, cocktails: number[]) {
  const cocktailsQnt = guests * 4;
  const eachCocktailQnt = Math.ceil(cocktailsQnt / cocktails.length);

  return cocktailService.calculatePrices(cocktails, eachCocktailQnt);
}
